import { PrismaClient, HouseStatus, Role } from "@prisma/client";
import { hashPassword } from "../lib/security/password";

const prisma = new PrismaClient();

const amenities = [
  { slug: "forest-view", label: "Forest view", icon: "trees" },
  { slug: "fireplace", label: "Fireplace", icon: "flame" },
  { slug: "hot-tub", label: "Hot tub", icon: "waves" },
  { slug: "wifi", label: "High-speed Wi-Fi", icon: "wifi" },
  { slug: "parking", label: "Private parking", icon: "car" },
  { slug: "kitchen", label: "Full kitchen", icon: "utensils" },
  { slug: "breakfast", label: "Breakfast setup", icon: "coffee" },
  { slug: "pet-friendly", label: "Pet friendly", icon: "paw-print" },
];

const houseSeeds = [
  {
    slug: "pine-canopy-retreat",
    featured: true,
    pricePerNightAmd: 85000,
    guestCapacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    latitude: 40.7406,
    longitude: 44.8632,
    location: "Near Dilijan National Park",
    nearby: "A calm woodland edge with direct access to forest walks.",
    imagePrefix: "pine",
    amenities: ["forest-view", "fireplace", "wifi", "parking", "kitchen"],
    translations: {
      en: {
        name: "Pine Canopy Retreat",
        shortDescription:
          "A cedar-toned cabin tucked into the pines, designed for long mornings and slow evenings.",
        description:
          "Pine Canopy Retreat is Aygoot’s warmest forest hideaway: a private two-bedroom cabin with a generous lounge, tactile wood interiors, a fireplace, and a soft terrace view into the Dilijan canopy. It is built for couples, small families, and remote weekend resets.",
      },
      hy: {
        name: "Սոճիների Հովանոց",
        shortDescription:
          "Սոճիների մեջ թաքնված տաք փայտե տուն՝ հանգիստ առավոտների և դանդաղ երեկոների համար։",
        description:
          "«Սոճիների Հովանոցը» Այգութի ամենաջերմ անտառային տներից է․ մասնավոր երկու ննջասենյակով տուն՝ փայտային ինտերիերով, բուխարիով և բացվող խաղաղ տեսարանով դեպի Դիլիջանի բնությունը։ Հարմար է զույգերի, փոքր ընտանիքների և հանգստյան փախուստների համար։",
      },
      ru: {
        name: "Сосновый Навес",
        shortDescription:
          "Уютный деревянный дом среди сосен для медленных вечеров и спокойных выходных.",
        description:
          "«Сосновый Навес» — один из самых теплых домов Aygoot: приватный двухспальный дом с камином, деревянными фактурами и спокойной террасой с видом на лес Дилижана. Идеален для пар, небольших семей и тихих поездок на природу.",
      },
    },
  },
  {
    slug: "moss-stone-villa",
    featured: true,
    pricePerNightAmd: 132000,
    guestCapacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    latitude: 40.7462,
    longitude: 44.869,
    location: "Old Dilijan hillside",
    nearby: "A premium family stay with broad valley views and quiet privacy.",
    imagePrefix: "moss",
    amenities: ["forest-view", "hot-tub", "wifi", "parking", "breakfast"],
    translations: {
      en: {
        name: "Moss & Stone Villa",
        shortDescription:
          "A panoramic hillside villa balancing mountain drama with calm hospitality.",
        description:
          "Moss & Stone Villa opens toward the Dilijan hills with large windows, layered textures, and room for families or friend groups who want privacy without losing access to town. The house pairs a generous living area with warm bedrooms and a restorative outdoor soak.",
      },
      hy: {
        name: "Քար և Մամուռ Վիլլա",
        shortDescription:
          "Բարձրադիր վիլլա՝ լեռների տեսարանով և հանգիստ, հյուրընկալ միջավայրով։",
        description:
          "«Քար և Մամուռ Վիլլան» բացվում է դեպի Դիլիջանի բլուրները՝ մեծ պատուհաններով, շերտավոր բնական նյութերով և ընդարձակ ներքին տարածքով։ Այն հարմար է ընտանիքների և ընկերական խմբերի համար, ովքեր ուզում են խաղաղություն՝ չկորցնելով քաղաքի հասանելիությունը։",
      },
      ru: {
        name: "Вилла Камень и Мох",
        shortDescription:
          "Панорамная вилла на склоне с ощущением тишины, уюта и приватности.",
        description:
          "«Вилла Камень и Мох» смотрит на холмы Дилижана через большие окна и сочетает просторную гостиную, теплые спальни и спокойную атмосферу для семьи или компании друзей. Это вариант для тех, кто ищет комфортный природный отдых с высоким уровнем сервиса.",
      },
    },
  },
  {
    slug: "amber-ridge-cabin",
    featured: false,
    pricePerNightAmd: 98000,
    guestCapacity: 5,
    bedrooms: 2,
    bathrooms: 2,
    latitude: 40.7412,
    longitude: 44.8575,
    location: "Quiet ridge above Dilijan",
    nearby: "Elevated views, crisp air, and a softer off-grid feeling.",
    imagePrefix: "amber",
    amenities: ["fireplace", "wifi", "pet-friendly", "parking", "kitchen"],
    translations: {
      en: {
        name: "Amber Ridge Cabin",
        shortDescription:
          "A ridge-top stay for guests who want silence, glow, and clean mountain air.",
        description:
          "Amber Ridge Cabin feels slightly more secluded, with warmer evening light, a textured living room, and a simple luxury that centers quiet. It is ideal for guests who want a more intimate base for reading, hiking, and slow conversation.",
      },
      hy: {
        name: "Սաթե Լանջի Տնակ",
        shortDescription:
          "Լանջի վրա գտնվող տուն՝ լռության, ջերմ լույսի և մաքուր օդի սիրահարների համար։",
        description:
          "«Սաթե Լանջի Տնակը» ավելի մեկուսի բնավորություն ունի՝ երեկոյան տաք լուսավորությամբ, հարմարավետ հյուրասենյակով և լռության վրա հիմնված պարզ շքեղությամբ։ Այն հարմար է ընթերցելու, քայլելու և հանգիստ զրույցների համար։",
      },
      ru: {
        name: "Домик Янтарный Хребет",
        shortDescription:
          "Дом на возвышенности для тех, кто ищет тишину, мягкий свет и свежий воздух.",
        description:
          "«Янтарный Хребет» ощущается более уединенным: теплый вечерний свет, уютная общая зона и спокойная атмосфера делают его хорошим выбором для чтения, прогулок и медленного отдыха в Дилижане.",
      },
    },
  },
];

async function seedAmenities() {
  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { slug: amenity.slug },
      update: amenity,
      create: amenity,
    });
  }
}

async function seedHouses() {
  const amenityMap = new Map(
    (await prisma.amenity.findMany()).map((amenity) => [amenity.slug, amenity.id]),
  );

  for (const [index, house] of houseSeeds.entries()) {
    await prisma.house.upsert({
      where: { slug: house.slug },
      update: {
        status: HouseStatus.PUBLISHED,
        featured: house.featured,
        pricePerNightAmd: house.pricePerNightAmd,
        guestCapacity: house.guestCapacity,
        bedrooms: house.bedrooms,
        bathrooms: house.bathrooms,
        latitude: house.latitude,
        longitude: house.longitude,
        sortOrder: index,
        publishedAt: new Date(),
        translations: {
          deleteMany: {},
          create: Object.entries(house.translations).map(([locale, value]) => ({
            locale,
            name: value.name,
            shortDescription: value.shortDescription,
            description: value.description,
            locationLabel: house.location,
            nearbyLabel: house.nearby,
          })),
        },
        images: {
          deleteMany: {},
          create: [1, 2, 3].map((position) => ({
            url: `/images/${house.imagePrefix}-${position}.svg`,
            alt: `${house.translations.en.name} image ${position}`,
            position,
            isCover: position === 1,
          })),
        },
        houseAmenities: {
          deleteMany: {},
          create: house.amenities.map((slug) => ({
            amenityId: amenityMap.get(slug)!,
          })),
        },
      },
      create: {
        slug: house.slug,
        status: HouseStatus.PUBLISHED,
        featured: house.featured,
        pricePerNightAmd: house.pricePerNightAmd,
        guestCapacity: house.guestCapacity,
        bedrooms: house.bedrooms,
        bathrooms: house.bathrooms,
        latitude: house.latitude,
        longitude: house.longitude,
        sortOrder: index,
        publishedAt: new Date(),
        translations: {
          create: Object.entries(house.translations).map(([locale, value]) => ({
            locale,
            name: value.name,
            shortDescription: value.shortDescription,
            description: value.description,
            locationLabel: house.location,
            nearbyLabel: house.nearby,
          })),
        },
        images: {
          create: [1, 2, 3].map((position) => ({
            url: `/images/${house.imagePrefix}-${position}.svg`,
            alt: `${house.translations.en.name} image ${position}`,
            position,
            isCover: position === 1,
          })),
        },
        houseAmenities: {
          create: house.amenities.map((slug) => ({
            amenityId: amenityMap.get(slug)!,
          })),
        },
      },
    });
  }
}

async function seedAdmin() {
  const password = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123";
  const email = process.env.ADMIN_EMAIL ?? "hello@aygoot.am";
  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Aygoot Admin",
      role: Role.ADMIN,
      passwordHash,
    },
    create: {
      email,
      name: "Aygoot Admin",
      role: Role.ADMIN,
      passwordHash,
    },
  });
}

async function main() {
  await seedAmenities();
  await seedHouses();
  await seedAdmin();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
