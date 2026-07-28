# Exely Booking Engine Integration

## Architecture

AyGood embeds the official Exely Booking Engine scripts supplied in `exely_temp/`. AyGood does not call a custom Exely API and does not connect directly to Booking.com.

Final public booking flow:

```text
AyGood website
  -> Exely Booking Engine
  -> Exely availability, prices, and reservations
  -> Exely Channel Manager
  -> Booking.com
```

Exely is the source of truth for new public booking availability, rates, and reservations. PostgreSQL remains the store for legacy local bookings, account history, admin history, houses, media, contact inquiries, auth, and email delivery records.

## Official Values

- Integration context: `BE-INT-aygoodriverlake_2026-07-22`
- Loader fallback hosts, in order: `am-ibe.hopenapi.com`, `ibe.hopenapi.com`, `ibe.behopenapi.com`
- Site locale map: `en -> en`, `hy -> am`, `ru -> ru`
- Search container: `be-search-form`
- Booking container: `be-booking-form`
- Google Search Console token: stored in root Next.js metadata via `verification.google`

These are public browser integration values, not secrets. No Exely API key, client secret, webhook secret, access token, or environment variable is required.

The vendor checklist PDF is kept as reference material under `exely_temp/`; `.gitattributes` marks PDFs as binary so future diffs remain readable.

## Room Types

Administrators can optionally map one Exely room type to each AyGood house. Existing rows remain `null`; null values are allowed, while non-null mappings are unique.

- `5077490` - Three-bedroom cottage (`Коттедж с тремя спальнями`)
- `5077491` - One-bedroom cottage with furako (`Коттедж с одной спальней и с фурако`)
- `5077492` - One-bedroom cottage with river view (`Коттедж с одной спальней и с видом на речку`)
- `5077493` - One-bedroom cottage with lake view (`Коттедж с одной спальней и с видом на озеро`)
- `5077538` - Three-bedroom cottage with hot tub/chan (`Коттедж с тремя спальнями и чаном`)

No automatic mapping was guessed because the current AyGood cottage names do not exactly match the Exely room labels. Until management confirms a mapping, public Book now links use the generic localized booking page.

## Special Offers

- `10166034` - Best price of the day (`Лучшая цена дня`)
- `10166187` - Standard rate with breakfast (`Стандартный тариф с завтраком`)
- `10166624` - Standard rate (`Стандартный тариф`)

`buildExelyBookingHref(locale, options)` supports `room-type`, `special-offer`, both together, and comma-separated multiple IDs.

## Public URLs

- `/en/booking`
- `/hy/booking`
- `/ru/booking`
- `/en/booking?room-type=5077492`
- `/en/booking?special-offer=10166187`
- `/en/booking?room-type=5077492&special-offer=10166187`

Bare `/booking` and `/booking/` redirect to `/{locale}/booking`, preserving all query parameters. The redirect uses a valid `NEXT_LOCALE` cookie when present and falls back to `en`.

Public Book now CTAs are native same-tab anchors. This avoids relying on client-side navigation for Exely-rendered DOM and keeps browser back navigation predictable.

## UI Placement

Localized public pages render the AyGood fixed header, the Exely search form directly below the header, page content, and the normal footer. The search form is hidden on `/[locale]/booking` and account routes. Admin and API routes are outside the localized public shell.

The booking page is intentionally focused: compact heading, description, one `#be-booking-form`, no search form, and no large footer.

The Exely containers preserve the vendor foundation styles and are wrapped with AyGood's cream background, forest-green actions, rounded surfaces, subtle borders, and reserved heights to reduce layout shift. A translated fallback appears if the widget does not render after a timeout, and `noscript` fallback copy is included.

## Legacy Booking Flow

`POST /api/bookings` now returns `410 Gone`:

```json
{
  "error": "Public booking requests are now handled by Exely."
}
```

`components/marketing/booking-request-form.tsx` was removed, and individual house pages now show an Exely CTA card. Local booking request and confirmation emails are not sent for new public Exely reservations.

Legacy booking records remain available in account and admin history.

## Legacy Conflict Fix

Changing a legacy booking to `CONFIRMED` now runs in a Prisma transaction with `Serializable` isolation. The transaction:

- loads the target booking;
- preserves idempotency when the booking is already in the requested status;
- checks for another confirmed booking on the same house using half-open overlap logic;
- checks `AvailabilityBlock` with the same half-open range;
- excludes the current booking from conflict checks;
- updates only when no conflict exists;
- retries Prisma serialization failures (`P2034`) up to three attempts.

Confirmation, rejection, and cancellation emails are sent only after the transaction commits. `BookingAvailabilityConflictError` maps to HTTP 409 in the admin API, and the admin status form displays the API's specific error message.

Adjacent stays are valid: a checkout date equal to another check-in date does not overlap.

## Database

Migration: `20260728183000_add_exely_room_type_id`

```sql
ALTER TABLE "House" ADD COLUMN "exelyRoomTypeId" TEXT;
CREATE UNIQUE INDEX "House_exelyRoomTypeId_key" ON "House"("exelyRoomTypeId");
```

Prisma schema field:

```prisma
exelyRoomTypeId String? @unique
```

PostgreSQL unique indexes allow multiple `NULL` values, so existing unmapped houses remain valid.

## Google Search Console

The supplied ownership verification token is emitted through root Next.js metadata. Someone with access to the relevant Google account still needs to complete manual verification in Google Search Console.

## Local Testing Results

- `pnpm install`: passed with `CI=true` and network escalation after sandbox DNS blocked the initial install.
- `pnpm prisma generate`: passed.
- `pnpm prisma validate`: passed.
- `pnpm typecheck`: passed.
- `pnpm build`: passed.
- `pnpm check`: passed.
- `pnpm prisma migrate dev --skip-seed`: reached local PostgreSQL at `localhost:5433` but failed with `Schema engine error:` and no further details.
- Local manual SQL equivalent to the migration was applied only to the local database for route and conflict smoke testing.

Routes checked through local HTTP requests:

- `/en`, `/hy`, `/ru`
- `/en/houses`, `/hy/houses`, `/ru/houses`
- `/en/houses/big-cottage-with-a-view-to-the-river`
- `/en/booking`, `/hy/booking`, `/ru/booking`
- `/en/booking?room-type=5077492`
- `/en/booking?special-offer=10166187`
- `/en/booking?room-type=5077492&special-offer=10166187`
- `/booking?room-type=5077492`
- `POST /api/bookings`

Local HTML verified the expected Exely containers and serialized locale mapping (`en`, `am`, `ru`). External Exely loader URLs returned `200 application/javascript` with network access. Full browser-rendered Exely widget verification was not performed because browser automation tools were not available in this session.

## Preview And Production Acceptance

Before production release:

- deploy this branch to a preview, not production;
- verify the Exely search form and booking engine in Chrome, Safari, Firefox, and mobile/tablet/desktop viewports;
- confirm no duplicate loader scripts or duplicate containers;
- confirm no horizontal scroll or clipping;
- confirm Search Console sees the verification meta tag;
- ask Exely to verify the integration quality.

External Channel Manager acceptance remains pending:

- Exely confirms room and rate mappings;
- Exely confirms Booking.com Channel Manager connectivity;
- management confirms current Exely availability;
- an approved cancellable test reservation is created and cancelled;
- Booking.com availability changes are verified through Exely.

## Rollback

Safe application rollback is to switch back to `main` or revert the Exely integration commit on the feature branch. Do not run destructive database commands. If the migration has been applied, leaving the nullable `House.exelyRoomTypeId` column in place is usually harmless; dropping it should be a deliberate migration reviewed separately.
