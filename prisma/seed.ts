import { HouseStatus, PrismaClient, Role } from "@prisma/client";
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
    pricePerNightAmd: 98000,
    guestCapacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    latitude: 40.7406,
    longitude: 44.8632,
    images: [
      "/images/houses/1.webp",
      "/images/houses/2.webp",
      "/images/houses/4.jpg",
    ],
    amenities: ["forest-view", "fireplace", "wifi", "parking", "kitchen"],
    translations: {
      en: {
        name: "Pine Canopy Retreat",
        shortDescription:
          "A cedar-toned forest house with long-window light and a slower morning rhythm.",
        description:
          "Pine Canopy Retreat is shaped for quiet weekends and small family resets: a warm two-bedroom house with cathedral glass, tactile wood finishes, a calm lounge, and a view line that keeps the forest present from the first coffee to the last firelight.",
        locationLabel: "National Park edge, Dilijan",
        nearbyLabel:
          "Set close to woodland trails and cooler air, with a gentler buffer from town noise.",
      },
      hy: {
        name: "Սոճու Հովանոց Հանգրվան",
        shortDescription:
          "Մայրու երանգներով անտառային տուն՝ լայն ապակիներով և դանդաղ առավոտների համար։",
        description:
          "«Սոճու Հովանոց Հանգրվանը» ստեղծված է հանգիստ հանգստյան օրերի և փոքր ընտանեկան փախուստների համար․ երկսենյականոց տաք տուն՝ բարձր ապակիներով, փայտե նուրբ հյուսվածքներով և հյուրասենյակով, որտեղ անտառը մնում է ներկայություն առավոտյան սուրճից մինչև երեկոյան բուխարի։",
        locationLabel: "Ազգային պարկի եզր, Դիլիջան",
        nearbyLabel:
          "Մոտ է անտառային արահետներին և զով օդին՝ քաղաքային աղմուկից ավելի հեռու զգացողությամբ։",
      },
      ru: {
        name: "Сосновый Навес",
        shortDescription:
          "Лесной дом в кедровых тонах с большим остеклением и более медленным ритмом утра.",
        description:
          "«Сосновый Навес» создан для спокойных выходных и небольших семейных поездок: теплый дом с двумя спальнями, высоким остеклением, древесными фактурами и мягкой гостиной, где лес остается частью атмосферы с первого кофе до вечернего камина.",
        locationLabel: "У кромки нацпарка, Дилижан",
        nearbyLabel:
          "Рядом лесные маршруты и прохладный воздух, с более мягким отступом от городского шума.",
      },
    },
  },
  {
    slug: "moss-stone-villa",
    featured: true,
    pricePerNightAmd: 138000,
    guestCapacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    latitude: 40.7462,
    longitude: 44.869,
    images: [
      "/images/houses/2.webp",
      "/images/houses/5.jpg",
      "/images/houses/1.webp",
    ],
    amenities: ["forest-view", "hot-tub", "wifi", "parking", "breakfast"],
    translations: {
      en: {
        name: "Moss & Stone Villa",
        shortDescription:
          "A panoramic hillside house balancing mountain drama with quieter hospitality.",
        description:
          "Moss & Stone Villa opens wide toward the Dilijan slopes with generous glazing, a broad family table, and layered natural textures. It is intended for longer stays where privacy, premium surface quality, and a grounded mountain mood matter as much as square footage.",
        locationLabel: "Old Dilijan hillside",
        nearbyLabel:
          "Wide valley views and an elevated perch that still keeps cafés and the historic center within easy reach.",
      },
      hy: {
        name: "Քար և Մամուռ Վիլլա",
        shortDescription:
          "Բարձրադիր տուն՝ լեռնային տեսարանով և ավելի հանգիստ հյուրընկալությամբ։",
        description:
          "«Քար և Մամուռ Վիլլան» լայն բացվում է դեպի Դիլիջանի լանջերը՝ մեծ ապակիներով, մեծ սեղանով և բնական շերտավոր նյութերով։ Այն նախատեսված է ավելի երկար մնալու համար, երբ կարևոր են և՛ առանձնացվածությունը, և՛ միջավայրի որակը, և՛ լեռնային տրամադրությունը։",
        locationLabel: "Հին Դիլիջանի բարձունք",
        nearbyLabel:
          "Լայն տեսարան դեպի հովիտ և բարձրադիր դիրք, բայց նաև արագ հասանելիություն դեպի կենտրոն և սրճարաններ։",
      },
      ru: {
        name: "Вилла Камень и Мох",
        shortDescription:
          "Панорамный дом на склоне, где драматичный пейзаж сочетается с тихой заботой о госте.",
        description:
          "«Вилла Камень и Мох» раскрывается к склонам Дилижана через большие окна, просторный стол для компании и фактурные натуральные материалы. Она рассчитана на более длинные остановки, где важны приватность, качество среды и спокойное горное настроение.",
        locationLabel: "Склон Старого Дилижана",
        nearbyLabel:
          "Широкие виды на долину и высокая точка, при этом центр и кафе остаются рядом.",
      },
    },
  },
  {
    slug: "amber-ridge-cabin",
    featured: true,
    pricePerNightAmd: 112000,
    guestCapacity: 5,
    bedrooms: 2,
    bathrooms: 2,
    latitude: 40.7412,
    longitude: 44.8575,
    images: [
      "/images/houses/3.webp",
      "/images/houses/6.jpeg",
      "/images/houses/1.webp",
    ],
    amenities: ["fireplace", "wifi", "pet-friendly", "parking", "kitchen"],
    translations: {
      en: {
        name: "Amber Ridge Cabin",
        shortDescription:
          "A ridge-set house for guests who want evening glow, silence, and clean air.",
        description:
          "Amber Ridge Cabin feels slightly more secluded, with a luminous timber shell, a more intimate living room, and the kind of quiet that suits reading, hiking, and slow dinners. It is ideal for couples or smaller groups who want mountain calm without giving up comfort.",
        locationLabel: "Quiet ridge above Dilijan",
        nearbyLabel:
          "Higher up on a calmer line with open sky, thinner sound, and a stronger sense of retreat.",
      },
      hy: {
        name: "Սաթե Լանջ Տնակ",
        shortDescription:
          "Լանջի վրա գտնվող տուն՝ երեկոյան ջերմ լույսի, լռության և մաքուր օդի համար։",
        description:
          "«Սաթե Լանջ Տնակը» ավելի մեկուսի բնավորություն ունի՝ փայտե լուսավոր կառուցվածքով, ավելի ինտիմ հյուրասենյակով և այնպիսի լռությամբ, որը հարմար է ընթերցանության, քայլքի և դանդաղ ընթրիքների համար։ Այն ճիշտ է զույգերի կամ փոքր խմբերի համար, ովքեր ուզում են լեռնային հանգիստ՝ առանց հարմարավետությունից հրաժարվելու։",
        locationLabel: "Հանգիստ լանջ Դիլիջանի վերևում",
        nearbyLabel:
          "Ավելի բարձր դիրք՝ բաց երկնքով, ավելի քիչ աղմուկով և ավելի ուժեղ հանգստավայրի զգացողությամբ։",
      },
      ru: {
        name: "Домик Янтарный Хребет",
        shortDescription:
          "Дом на гребне для тех, кто ищет теплый вечерний свет, тишину и чистый воздух.",
        description:
          "«Янтарный Хребет» ощущается чуть более уединенным: светлый деревянный объем, более камерная общая зона и тишина, подходящая для чтения, прогулок и медленных ужинов. Это хороший вариант для пары или небольшой компании, которые хотят горного спокойствия без потери комфорта.",
        locationLabel: "Тихий хребет над Дилижаном",
        nearbyLabel:
          "Более высокая точка с открытым небом, меньшим шумом и более сильным ощущением ретрита.",
      },
    },
  },
  {
    slug: "cedar-cliff-house",
    featured: false,
    pricePerNightAmd: 124000,
    guestCapacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    latitude: 40.7481,
    longitude: 44.8711,
    images: [
      "/images/houses/4.jpg",
      "/images/houses/5.jpg",
      "/images/houses/2.webp",
    ],
    amenities: ["forest-view", "fireplace", "wifi", "parking", "breakfast"],
    translations: {
      en: {
        name: "Cedar Cliff House",
        shortDescription:
          "Stone, timber, and a dramatic forest wall framing a larger family stay.",
        description:
          "Cedar Cliff House leans into the lodge mood with deeper tones, a more dramatic façade, and a setting that feels protected by the surrounding hills. The plan is generous enough for families or friend groups who want a stronger architectural identity with their mountain base.",
        locationLabel: "Cliffside forest line",
        nearbyLabel:
          "Backed by a dense green ridge and suited to guests who want Dilijan to feel cinematic and secluded.",
      },
      hy: {
        name: "Մայրու Ժայռ Տուն",
        shortDescription:
          "Քար, փայտ և խիտ անտառային պատ՝ ավելի մեծ ընտանեկան հանգստի համար։",
        description:
          "«Մայրու Ժայռ Տունը» ավելի լոջային բնավորություն ունի՝ ավելի խոր գույներով, արտահայտիչ ճակատով և միջավայրով, որը կարծես պաշտպանված է շրջակա բլուրներով։ Հատակագիծը բավական ընդարձակ է ընտանիքների կամ ընկերական խմբերի համար, ովքեր ուզում են ավելի ճարտարապետական բնավորությամբ լեռնային տուն։",
        locationLabel: "Ժայռեզր անտառային գոտի",
        nearbyLabel:
          "Հենված է խիտ կանաչ լանջին և հարմար է նրանց համար, ովքեր ուզում են Դիլիջանը զգալ ավելի կինեմատոգրաֆիկ ու մեկուսացված։",
      },
      ru: {
        name: "Кедровый Дом у Скалы",
        shortDescription:
          "Камень, дерево и плотная стена леса для более крупного семейного отдыха.",
        description:
          "«Кедровый Дом у Скалы» тяготеет к настроению лоджа: более глубокие тона, выразительный фасад и ощущение защищенности холмами вокруг. Планировка подходит для семьи или компании друзей, которым важен более сильный архитектурный характер дома.",
        locationLabel: "Лесная линия у скалы",
        nearbyLabel:
          "За спиной плотный зеленый склон, а весь Дилижан ощущается более кинематографично и уединенно.",
      },
    },
  },
  {
    slug: "parz-lake-forest-lodge",
    featured: false,
    pricePerNightAmd: 119000,
    guestCapacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    latitude: 40.753,
    longitude: 44.8924,
    images: [
      "/images/houses/5.jpg",
      "/images/houses/4.jpg",
      "/images/houses/3.webp",
    ],
    amenities: ["forest-view", "hot-tub", "wifi", "parking", "pet-friendly"],
    translations: {
      en: {
        name: "Parz Lake Forest Lodge",
        shortDescription:
          "A quieter lake-direction stay with deep green surroundings and softer arrival energy.",
        description:
          "Parz Lake Forest Lodge is intended for guests who want Dilijan to feel cooler, greener, and further removed from routine. The house mixes privacy with a slower, more restorative mood and works especially well for couples or small groups planning nature-first days.",
        locationLabel: "Parz Lake direction",
        nearbyLabel:
          "A greener pocket with easy access to lake walks, forest routes, and the sensation of being drawn deeper into Dilijan’s natural calm.",
      },
      hy: {
        name: "Պարզ Լճի Անտառային Լոջ",
        shortDescription:
          "Ավելի խաղաղ ուղղություն դեպի լիճ՝ խիտ կանաչ միջավայրով և մեղմ ժամանման զգացողությամբ։",
        description:
          "«Պարզ Լճի Անտառային Լոջը» նախատեսված է նրանց համար, ովքեր ուզում են Դիլիջանը զգալ ավելի զով, ավելի կանաչ և առօրյայից ավելի հեռու։ Տունը համադրում է առանձնացվածությունն ու դանդաղ վերականգնող տրամադրությունը և հատկապես լավ է զույգերի կամ փոքր խմբերի համար։",
        locationLabel: "Պարզ լճի ուղղություն",
        nearbyLabel:
          "Կանաչ միջավայր՝ հեշտ հասանելիությամբ դեպի լճի քայլուղիներ, անտառային երթուղիներ և Դիլիջանի ավելի խոր հանգստություն։",
      },
      ru: {
        name: "Лесной Лодж Парз Лейк",
        shortDescription:
          "Более спокойное направление к озеру с глубоким зеленым окружением и мягким ощущением приезда.",
        description:
          "«Лесной Лодж Парз Лейк» подойдет тем, кто хочет почувствовать Дилижан более прохладным, зеленым и далеким от рутины. Дом соединяет приватность с более восстановительным ритмом и особенно хорош для пары или небольшой компании, планирующей nature-first отдых.",
        locationLabel: "В направлении Парз Лейк",
        nearbyLabel:
          "Более зеленый карман с быстрым доступом к озеру, лесным маршрутам и более глубокой тишине Дилижана.",
      },
    },
  },
  {
    slug: "old-dilijan-timber-residence",
    featured: false,
    pricePerNightAmd: 145000,
    guestCapacity: 7,
    bedrooms: 3,
    bathrooms: 2,
    latitude: 40.7425,
    longitude: 44.8619,
    images: [
      "/images/houses/6.jpeg",
      "/images/houses/3.webp",
      "/images/houses/5.jpg",
    ],
    amenities: [
      "forest-view",
      "fireplace",
      "wifi",
      "parking",
      "kitchen",
      "breakfast",
    ],
    translations: {
      en: {
        name: "Old Dilijan Timber Residence",
        shortDescription:
          "A larger timber stay with warmer light and a more social shared rhythm.",
        description:
          "Old Dilijan Timber Residence is the broadest of the current Aygoot houses: a premium timber home with room for longer table conversations, larger gatherings, and guests who want atmosphere without sacrificing practicality. It balances cabin warmth with a more substantial footprint.",
        locationLabel: "Near Old Dilijan quarter",
        nearbyLabel:
          "Well placed for guests who want both the forest mood and a smoother connection to the cultural center of town.",
      },
      hy: {
        name: "Հին Դիլիջան Փայտե Ռեզիդենցիա",
        shortDescription:
          "Ավելի մեծ փայտե տուն՝ ջերմ լույսով և ավելի սոցիալական ընդհանուր ռիթմով։",
        description:
          "«Հին Դիլիջան Փայտե Ռեզիդենցիան» Aygoot-ի ընթացիկ տներից ամենաընդարձակն է․ պրեմիում փայտե տուն՝ մեծ սեղանի շուրջ երկար զրույցների, ավելի մեծ խմբերի և այն հյուրերի համար, ովքեր ուզում են մթնոլորտ՝ առանց գործնականությունից հրաժարվելու։ Այն համադրում է տնակային ջերմությունն ու ավելի լիարժեք տարածքը։",
        locationLabel: "Հին Դիլիջանի թաղամասի մոտ",
        nearbyLabel:
          "Լավ դիրք նրանց համար, ովքեր ուզում են և՛ անտառային տրամադրություն, և՛ ավելի հեշտ կապ քաղաքի մշակութային կենտրոնի հետ։",
      },
      ru: {
        name: "Тимбер Резиденс Старый Дилижан",
        shortDescription:
          "Более просторный деревянный дом с теплым светом и более социальным общим ритмом.",
        description:
          "«Тимбер Резиденс Старый Дилижан» — самый широкий из текущих домов Aygoot: премиальный деревянный дом для длинных разговоров за столом, более крупных компаний и гостей, которым нужна атмосфера без потери практичности. Он соединяет тепло кабины с более серьезным масштабом.",
        locationLabel: "Рядом с кварталом Старый Дилижан",
        nearbyLabel:
          "Хороший вариант для тех, кто хочет сохранить лесное настроение и при этом быть ближе к культурному центру города.",
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
    (await prisma.amenity.findMany()).map((amenity) => [
      amenity.slug,
      amenity.id,
    ]),
  );

  for (const [index, house] of houseSeeds.entries()) {
    const translations = Object.entries(house.translations).map(
      ([locale, value]) => ({
        locale,
        name: value.name,
        shortDescription: value.shortDescription,
        description: value.description,
        locationLabel: value.locationLabel,
        nearbyLabel: value.nearbyLabel,
      }),
    );

    const images = house.images.map((url, position) => ({
      url,
      alt: `${house.translations.en.name} image ${position + 1}`,
      position: position + 1,
      isCover: position === 0,
    }));

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
          create: translations,
        },
        images: {
          deleteMany: {},
          create: images,
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
          create: translations,
        },
        images: {
          create: images,
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
