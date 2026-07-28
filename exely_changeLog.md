# Exely Integration Change Log

## 1. Overview

Exely was integrated so new public AyGood booking availability, rates, and reservations are handled by the official Exely Booking Engine instead of AyGood's legacy local booking-request form.

Final architecture: AyGood website -> Exely Booking Engine -> Exely availability, prices, and reservations -> Exely Channel Manager -> Booking.com. AyGood does not connect directly to Booking.com.

Legacy local bookings remain available as historical account/admin records. Admin status changes for those legacy records still work, with additional conflict protection.

## 2. Git Information

- Source branch: `main`
- Feature branch: `feature/exely-booking-engine`
- Base commit SHA: `b2f722754a7dbff70faf7525b51d3f40f2fe7942`
- Final commit SHA: available in Git history after commit; this file cannot contain the SHA of the commit that contains itself without a follow-up commit.
- `main` was not modified or merged. Existing uncommitted work was stashed, branch-created, and restored onto the feature branch.

## 3. Exely Source Files Reviewed

- `exely_temp/1_Main.png`: desktop search-form placement screenshot; reference-only; not modified.
- `exely_temp/2_Book.png`: booking-page layout screenshot; reference-only; not modified.
- `exely_temp/Mobile.png`: mobile stacked search-form screenshot; reference-only; not modified.
- `exely_temp/aygoodriverlake/.DS_Store`: ignored macOS metadata; not used; not modified.
- `exely_temp/aygoodriverlake/SCRIPT/head_script/head_script-am.html`: head loader for Exely `am`; adapted into typed loader/script components; not modified. Extracted context, hosts, containers, Google verification token, and locale.
- `exely_temp/aygoodriverlake/SCRIPT/head_script/head_script-en.html`: head loader for Exely `en`; adapted; not modified.
- `exely_temp/aygoodriverlake/SCRIPT/head_script/head_script-ru.html`: head loader for Exely `ru`; adapted; not modified.
- `exely_temp/aygoodriverlake/SCRIPT/search_form.2.0/search_form-am.html`: vendor search-form markup/styles; adapted into React and global CSS; not modified.
- `exely_temp/aygoodriverlake/SCRIPT/search_form.2.0/search_form-en.html`: same search-form markup/styles; reference-only after comparison; not modified.
- `exely_temp/aygoodriverlake/SCRIPT/search_form.2.0/search_form-ru.html`: same search-form markup/styles; reference-only after comparison; not modified.
- `exely_temp/aygoodriverlake/SCRIPT/booking_form.2.0/reservation-am.html`: vendor booking container/styles; adapted; not modified.
- `exely_temp/aygoodriverlake/SCRIPT/booking_form.2.0/reservation-en.html`: same booking container/styles; reference-only after comparison; not modified.
- `exely_temp/aygoodriverlake/SCRIPT/booking_form.2.0/reservation-ru.html`: same booking container/styles; reference-only after comparison; not modified.
- `exely_temp/aygoodriverlake/LINK/links_room.html`: room-type link IDs and Russian labels; adapted into `config/exely.ts`; not modified.
- `exely_temp/aygoodriverlake/LINK/links_offer.html`: special-offer IDs and Russian labels; adapted into `config/exely.ts`; not modified.
- `exely_temp/aygoodriverlake/CHECK_LIST/Instruction and Self-checklist.pdf`: integration instructions/checklist; extracted with bundled Python `pypdf`; reference-only; not modified.
- `aygoodriverlake.zip`: not present under `exely_temp` in the restored repository, so no archive comparison was possible.

Locale differences found: only the `setContext` language argument differs in the head scripts (`am`, `en`, `ru`). Search-form and booking-form markup are otherwise identical across locales.

## 4. Exely Configuration

- Context ID: `BE-INT-aygoodriverlake_2026-07-22`
- Hosts: `am-ibe.hopenapi.com`, `ibe.hopenapi.com`, `ibe.behopenapi.com`
- Container IDs: `be-search-form`, `be-booking-form`
- Locale map: `en -> en`, `hy -> am`, `ru -> ru`
- Verification token location: root Next.js metadata in `app/layout.tsx`
- Room-type catalog: `5077490`, `5077491`, `5077492`, `5077493`, `5077538`
- Offer catalog: `10166034`, `10166187`, `10166624`
- These are public browser integration values.
- No private Exely credentials or environment variables were added.

## 5. Files Added

- `config/exely.ts`: typed Exely constants and helpers: `getExelyLocale`, `buildExelyBookingHref`, `isSupportedExelyRoomTypeId`, `isSupportedExelyOfferId`.
- `.gitattributes`: marks PDFs as binary so the Exely checklist PDF is stored without noisy text diffs.
- `components/exely/exely-script.tsx`: global Exely loader script using the official fallback-host behavior.
- `components/exely/exely-initializer.tsx`: client-side queue/bootstrap helper for containers mounted during navigation.
- `components/exely/exely-search-form.tsx`: reusable search-form container.
- `components/exely/exely-booking-form.tsx`: reusable booking-form container.
- `components/exely/exely-fallback.tsx`: translated timeout fallback with phone/email actions.
- `components/exely/localized-public-shell.tsx`: route-aware localized shell for search-form/footer inclusion.
- `components/marketing/exely-booking-cta-card.tsx`: house-detail Exely booking CTA.
- `prisma/migrations/20260728183000_add_exely_room_type_id/migration.sql`: nullable unique `House.exelyRoomTypeId` migration.
- `docs/EXELY_INTEGRATION.md`: maintainer documentation.
- `exely_changeLog.md`: this implementation changelog.

## 6. Files Modified

- `app/layout.tsx`: added Google Search Console verification metadata.
- `app/[locale]/layout.tsx`: added Exely script and route-aware public shell.
- `app/[locale]/booking/page.tsx`: replaced redirect placeholder with focused Exely booking page and localized metadata.
- `app/[locale]/page.tsx`: passes Book now label into house cards.
- `app/[locale]/houses/page.tsx`: passes Book now label into house cards.
- `app/[locale]/houses/[slug]/page.tsx`: removed auth/session and `BookingRequestForm`; added Exely CTA card.
- `proxy.ts`: added bare `/booking` and `/booking/` compatibility redirect preserving query parameters.
- `styles/globals.css`: added vendor-compatible Exely search/booking container styles, reserved heights, and fallback styles.
- `components/marketing/house-card.tsx`: added native Book now anchor using mapped or generic Exely booking URL.
- `components/admin/admin-house-form.tsx`: added Exely room-type dropdown and payload field.
- `app/admin/houses/[id]/page.tsx`: passes existing `exelyRoomTypeId` to the form.
- `features/houses/queries.ts`: exposes `exelyRoomTypeId` in public/admin house query outputs.
- `features/admin/validation.ts`: validates `exelyRoomTypeId` against official room IDs or `null`.
- `app/api/admin/houses/route.ts`: saves mapping and returns specific unique-conflict copy.
- `app/api/admin/houses/[id]/route.ts`: saves mapping and returns specific unique-conflict copy.
- `app/api/bookings/route.ts`: disables public local booking creation with HTTP 410.
- `features/bookings/service.ts`: removed exported public booking-creation helper; added serializable legacy confirmation conflict checks and email-after-commit behavior.
- `app/api/admin/bookings/[id]/route.ts`: maps `BookingAvailabilityConflictError` to HTTP 409.
- `components/admin/admin-booking-status-form.tsx`: displays specific API error messages.
- `messages/en/common.json`, `messages/hy/common.json`, `messages/ru/common.json`: added Book now and live availability labels.
- `messages/en/booking.json`, `messages/hy/booking.json`, `messages/ru/booking.json`: added booking page, Exely fallback, and CTA copy.
- `messages/en/houses.json`, `messages/hy/houses.json`, `messages/ru/houses.json`: updated availability hints to point to Exely.
- `prisma/schema.prisma`: added `House.exelyRoomTypeId String? @unique`.

## 7. Files Removed or Deprecated

- `components/marketing/booking-request-form.tsx`: removed because public house pages no longer collect local booking requests.
- `POST /api/bookings`: kept for compatibility but deprecated with HTTP 410.
- Local pending booking creation: disabled for the public site.
- Local booking-request emails for new public bookings: disabled by removing the public creation path.
- Legacy admin booking pages: preserved.
- Legacy account booking history: preserved.

## 8. Database and Prisma Changes

Schema change:

```prisma
exelyRoomTypeId String? @unique
```

Migration SQL:

```sql
ALTER TABLE "House" ADD COLUMN "exelyRoomTypeId" TEXT;
CREATE UNIQUE INDEX "House_exelyRoomTypeId_key" ON "House"("exelyRoomTypeId");
```

Existing houses receive `NULL`. Multiple `NULL` values are allowed by PostgreSQL. Non-null IDs are unique. No current house slug was mapped automatically.

Admins can assign official room IDs through the house form. Unknown IDs are rejected. Duplicate room mappings return: `This Exely room type is already assigned to another house.`

Legacy confirmation changes use serializable Prisma transactions, half-open overlap checks, `AvailabilityBlock` checks, current-booking exclusion, post-commit email sending, and bounded retry of `P2034` serialization failures.

## 9. House-to-Exely Mapping

Available IDs: `5077490`, `5077491`, `5077492`, `5077493`, `5077538`.

Admins assign one optional ID per house. If a house is mapped, its public CTA opens `/{locale}/booking?room-type={id}`. If unmapped, it opens `/{locale}/booking`. No mapping was guessed because names differ between AyGood content and Exely room labels.

## 10. Routing Changes

- Localized booking routes: `/en/booking`, `/hy/booking`, `/ru/booking`
- Compatibility redirect: `/booking` and `/booking/` -> `/{locale}/booking`
- Query preservation: all query parameters survive redirect.
- Native navigation: public Book now anchors use normal `<a href>`.
- Locale switching: native locale anchors preserve path/query and force reliable language changes.

## 11. UI and Responsive Changes

The search form is placed once in the localized public shell below the fixed header and above page content. It is excluded from booking and account routes. The booking page has one booking container and omits the large footer.

AyGood styling is preserved with cream surfaces, forest-green actions, rounded cards, subtle borders, Newsreader headings, and Manrope body text. Fallback and `noscript` states include direct contact actions.

## 12. Legacy Booking Conflict Fix

Original problem: two overlapping `PENDING` bookings for the same house could both be changed to `CONFIRMED`.

Implemented behavior: first confirmation succeeds; second overlapping confirmation throws `BookingAvailabilityConflictError`; API returns HTTP 409; second booking remains `PENDING`; no confirmation email is sent for the failed booking. Availability blocks use the same overlap logic. Adjacent stays remain allowed.

## 13. Environment Variables

No Exely environment variables were added. No Exely secrets were added. `.env.example` was not modified for Exely.

## 14. Google Search Console

The verification token is configured in `app/layout.tsx` with Next.js metadata. Manual Search Console verification remains required by someone with the correct Google account access.

## 15. Validation Results

- `pnpm install`: passed using `CI=true pnpm install` with network escalation. Initial sandboxed run failed with DNS `ENOTFOUND`.
- `pnpm prisma generate`: passed.
- `pnpm prisma validate`: passed.
- `pnpm typecheck`: passed.
- `pnpm build`: passed.
- `pnpm check`: passed.
- `pnpm prisma migrate dev --skip-seed`: failed against local `localhost:5433` with `Schema engine error:` and no additional details.
- Local migration SQL was manually applied for smoke testing only.

## 16. Browser and Route Testing

Browser automation was not available in this session. Local HTTP/HTML testing covered:

- `/en`, `/hy`, `/ru`: 200 after local SQL setup.
- `/en/houses`, `/hy/houses`, `/ru/houses`: 200 after local SQL setup.
- `/en/houses/big-cottage-with-a-view-to-the-river`: 200, search container present, generic `/en/booking` CTA present.
- `/en/booking`, `/hy/booking`, `/ru/booking`: 200, one booking container present.
- Room, offer, and combined booking query URLs: 200.
- `/booking?room-type=5077492`: 307 to `/en/booking?room-type=5077492`.
- `POST /api/bookings`: 410 with Exely message.

Serialized script checks confirmed `/en -> en`, `/hy -> am`, `/ru -> ru`. Exely loader hosts returned `200 application/javascript` with network access. Full widget rendering, console checks, and viewport/browser matrix remain pending.

## 17. Legacy Conflict Test Results

Local service-level test with fake data and SMTP disabled:

- Two overlapping pending bookings were created.
- First confirmation succeeded and became `CONFIRMED`.
- Second confirmation threw `BookingAvailabilityConflictError` and stayed `PENDING`.
- Overlapping `AvailabilityBlock` prevented confirmation and the booking stayed `PENDING`.
- Adjacent stay where previous checkout equals next check-in confirmed successfully.
- Email delivery was attempted only for successful confirmations; failed confirmations created no delivery rows.

Admin HTTP 409 was not exercised through a live authenticated browser session, but the route maps `BookingAvailabilityConflictError` to 409.

## 18. Known Limitations and Remaining Actions

Code-complete work:

- Exely embed wiring.
- Public custom booking shutdown.
- House mapping field/admin UI.
- Legacy conflict fix.
- Documentation.

External pending work:

- AyGood management must confirm exact house-to-room mappings.
- Exely representative must verify integration and Channel Manager setup.
- Booking.com mappings must be verified through Exely.
- A preview deployment must be tested in real browsers/viewports.
- A safe cancellable test reservation must be approved before testing end-to-end inventory sync.
- Google Search Console verification must be completed manually.

## 19. Rollback Instructions

Switch back to `main` for an application rollback, or revert the Exely integration commit on this feature branch. Do not use destructive database commands. If the migration was applied, keeping the nullable column is low-risk; dropping it should be done only through a reviewed migration.

## 20. Final Status

- Implementation complete: yes.
- Build passing: yes.
- Exely rendering verified: blocked for full browser widget rendering; local containers/scripts and loader host reachability verified.
- Channel Manager verified: external pending.
- Production reservation flow verified: not performed.
- Unresolved blockers: Prisma migrate engine local failure details, full browser/viewport verification, management mappings, Exely/Booking.com external acceptance.
