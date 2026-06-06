#!/usr/bin/env node

/**
 * Seed Haj & Umrah single-type pages (structured components) from translation files.
 * Usage (from strapi/): npm run build && npm run seed:pilgrimage
 */

const path = require("path");
const fs = require("fs");

const SERVICE_ENTRIES = [
  { key: "comfort", icon: "star" },
  { key: "vipLounge", icon: "plane" },
  { key: "adminSupervision", icon: "users" },
  { key: "haramainTrain", icon: "train" },
  { key: "religiousSupervision", icon: "book" },
  { key: "multiplePrograms", icon: "list" },
];

const HAJ_STEP_KEYS = ["ihram", "tawaf", "sai", "arafat", "muzdalifah", "rami"];
const UMRAH_STEP_KEYS = ["ihram", "tawaf", "sai", "halq"];

const DEFAULT_HAJ_RITUALS = {
  ar: [
    {
      id: "ihram",
      title: "الإحرام",
      subtitle: "بداية الرحلة المقدسة",
      description: "الإحرام هو نية الدخول في النسك، ويكون عند الميقات المحدد. يرتدي الرجل إزاراً ورداءً أبيضين، وتلبس المرأة ملابسها العادية الساترة.",
      steps: ["الاغتسال والتطيب قبل الإحرام", "لبس ملابس الإحرام عند الميقات", "عقد النية والتلبية: لبيك اللهم حجاً", "التلبية المستمرة حتى رمي جمرة العقبة"],
      dua: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
      significance: "الإحرام يرمز إلى المساواة بين جميع المسلمين أمام الله، فلا فرق بين غني وفقير، ولا بين عربي وأعجمي."
    },
    {
      id: "tawaf-qudum",
      title: "طواف القدوم",
      subtitle: "تحية البيت الحرام",
      description: "طواف القدوم هو أول ما يفعله الحاج عند وصوله إلى مكة المكرمة، وهو تحية للمسجد الحرام والكعبة المشرفة.",
      steps: ["البدء من الحجر الأسود مع التكبير", "الطواف سبعة أشواط حول الكعبة", "الاضطباع والرمل في الأشواط الثلاثة الأولى للرجال", "صلاة ركعتين خلف مقام إبراهيم"],
      dua: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      significance: "الطواف يرمز إلى وحدة المسلمين ودورانهم حول محور واحد هو بيت الله الحرام، كما تدور الملائكة حول العرش."
    },
    {
      id: "sai",
      title: "السعي",
      subtitle: "بين الصفا والمروة",
      description: "السعي بين الصفا والمروة سبعة أشواط، إحياءً لذكرى سعي السيدة هاجر عليها السلام بحثاً عن الماء لابنها إسماعيل.",
      steps: ["البدء من الصفا والصعود عليه", "التوجه إلى المروة (شوط واحد)", "الإسراع بين العلمين الأخضرين للرجال", "إتمام سبعة أشواط (الانتهاء عند المروة)"],
      dua: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ",
      significance: "السعي يذكّرنا بتوكل السيدة هاجر على الله وسعيها لطلب الرزق، وأن الله لا يضيع أجر من أحسن عملاً."
    },
    {
      id: "arafat",
      title: "الوقوف بعرفة",
      subtitle: "ركن الحج الأعظم",
      description: "الوقوف بعرفة هو ركن الحج الأعظم، يكون في اليوم التاسع من ذي الحجة. قال النبي ﷺ: 'الحج عرفة'.",
      steps: ["التوجه إلى عرفة صباح يوم التاسع من ذي الحجة", "الوقوف بعرفة من الزوال إلى غروب الشمس", "الإكثار من الدعاء والذكر والاستغفار", "الجمع بين الظهر والعصر قصراً وجمع تقديم"],
      dua: "خَيْرُ الدُّعَاءِ دُعَاءُ يَوْمِ عَرَفَةَ، وَخَيْرُ مَا قُلْتُ أَنَا وَالنَّبِيُّونَ مِنْ قَبْلِي: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      significance: "يوم عرفة هو أفضل أيام الدنيا، يباهي الله بأهل عرفة أهل السماء، ويعتق فيه رقاباً من النار أكثر من أي يوم آخر."
    },
    {
      id: "muzdalifah",
      title: "المبيت بمزدلفة",
      subtitle: "ليلة العاشر من ذي الحجة",
      description: "بعد غروب شمس يوم عرفة، ينفر الحجاج إلى مزدلفة للمبيت بها وجمع الحصى لرمي الجمرات.",
      steps: ["الانطلاق من عرفة بعد الغروب بسكينة", "صلاة المغرب والعشاء جمع تأخير عند الوصول", "المبيت بمزدلفة حتى الفجر", "جمع حصى الجمرات (49 أو 70 حصاة)"],
      dua: "اللَّهُمَّ إِنِّي أَسْأَلُكَ أَنْ تَرْزُقَنِي جَوَامِعَ الْخَيْرِ، وَتُجِيرَنِي مِنَ النَّارِ",
      significance: "المبيت بمزدلفة واجب من واجبات الحج، وهو وقت للراحة والتأمل والاستعداد ليوم النحر."
    },
    {
      id: "rami",
      title: "رمي الجمرات",
      subtitle: "رمز رفض الشيطان",
      description: "رمي الجمرات في منى يرمز إلى رفض وساوس الشيطان، اقتداءً بسيدنا إبراهيم عليه السلام حين رمى الشيطان بالحصى.",
      steps: ["رمي جمرة العقبة الكبرى يوم النحر (7 حصيات)", "رمي الجمرات الثلاث أيام التشريق (11، 12، 13 ذي الحجة)", "الترتيب: الصغرى ثم الوسطى ثم الكبرى", "التكبير مع كل حصاة"],
      dua: "بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ، رَغْمًا لِلشَّيْطَانِ وَحِزْبِهِ",
      significance: "رمي الجمرات يعلّمنا مقاومة الشيطان ووساوسه، والثبات على طاعة الله مهما كانت التحديات."
    },
    {
      id: "nahr",
      title: "الهدي (الذبح)",
      subtitle: "يوم النحر",
      description: "ذبح الهدي يوم النحر (العاشر من ذي الحجة) اقتداءً بسيدنا إبراهيم عليه السلام حين فدى الله ابنه إسماعيل بذبح عظيم.",
      steps: ["ذبح الهدي بعد رمي جمرة العقبة", "يجوز التوكيل في الذبح", "الحلق أو التقصير بعد الذبح", "التحلل الأول (خلع الإحرام)"],
      dua: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ هَذَا مِنْكَ وَلَكَ",
      significance: "الهدي يرمز إلى التضحية والفداء في سبيل الله، ويذكّرنا بقصة سيدنا إبراهيم وابنه إسماعيل عليهما السلام."
    },
    {
      id: "tawaf-ifadah",
      title: "طواف الإفاضة",
      subtitle: "ركن من أركان الحج",
      description: "طواف الإفاضة ركن من أركان الحج لا يصح الحج بدونه. يؤدى بعد التحلل الأول يوم النحر أو بعده.",
      steps: ["التوجه إلى المسجد الحرام", "الطواف سبعة أشواط حول الكعبة", "صلاة ركعتين خلف مقام إبراهيم", "السعي بين الصفا والمروة (لمن لم يسعَ بعد طواف القدوم)"],
      dua: "اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا، وَسَعْيًا مَشْكُورًا، وَذَنْبًا مَغْفُورًا",
      significance: "طواف الإفاضة يمثل التحلل الكامل من الإحرام والعودة إلى الحياة الطبيعية بعد إتمام أعظم أركان الحج."
    }
  ],
  en: [
    {
      id: "ihram",
      title: "Ihram",
      subtitle: "Beginning the Sacred Journey",
      description: "Ihram is the state of ritual purity entered at the designated Miqat. Men wear two white unstitched cloths, while women wear their regular modest clothing.",
      steps: ["Perform Ghusl (ritual bath) and apply fragrance before Ihram", "Wear Ihram garments at the Miqat", "Make the intention and recite Talbiyah", "Continue reciting Talbiyah until stoning Jamrat al-Aqabah"],
      dua: "Labbayk Allahumma labbayk, labbayk la shareeka laka labbayk. Innal-hamda wan-ni'mata laka wal-mulk, la shareeka lak.",
      significance: "Ihram symbolizes equality before Allah — no distinction between rich and poor, Arab and non-Arab. All stand equal before their Creator."
    },
    {
      id: "tawaf-qudum",
      title: "Tawaf al-Qudum",
      subtitle: "Greeting the Sacred House",
      description: "Tawaf al-Qudum is the first act upon arriving in Makkah — a greeting to the Sacred Mosque and the Holy Kaaba.",
      steps: ["Begin at the Black Stone with Takbeer", "Circle the Kaaba seven times counter-clockwise", "Men perform Idtiba and Raml in the first three rounds", "Pray two Rak'ahs behind Maqam Ibrahim"],
      dua: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhab an-nar.",
      significance: "Tawaf represents the unity of Muslims revolving around one center — the House of Allah — just as angels circle the Throne."
    },
    {
      id: "sai",
      title: "Sa'i",
      subtitle: "Between Safa and Marwah",
      description: "Sa'i is walking seven times between the hills of Safa and Marwah, commemorating Hajar's search for water for her son Ismail.",
      steps: ["Start at Safa and ascend it", "Walk towards Marwah (one lap)", "Men jog between the green markers", "Complete seven laps (ending at Marwah)"],
      dua: "Indeed, Safa and Marwah are among the symbols of Allah.",
      significance: "Sa'i reminds us of Hajar's trust in Allah and her effort to seek provision — Allah never wastes the reward of those who do good."
    },
    {
      id: "arafat",
      title: "Standing at Arafat",
      subtitle: "The Greatest Pillar of Hajj",
      description: "Standing at Arafat on the 9th of Dhul Hijjah is the greatest pillar of Hajj. The Prophet ﷺ said: 'Hajj is Arafat.'",
      steps: ["Travel to Arafat on the morning of the 9th Dhul Hijjah", "Stand at Arafat from noon until sunset", "Engage in abundant supplication and remembrance", "Combine Dhuhr and Asr prayers (shortened)"],
      dua: "The best supplication is on the Day of Arafat: La ilaha illallahu wahdahu la shareeka lah.",
      significance: "The Day of Arafat is the best day of the year. Allah boasts to the angels about the people of Arafat and frees more souls from the Fire than any other day."
    },
    {
      id: "muzdalifah",
      title: "Night at Muzdalifah",
      subtitle: "The Night of the 10th Dhul Hijjah",
      description: "After sunset on the Day of Arafat, pilgrims proceed to Muzdalifah to spend the night and collect pebbles for stoning.",
      steps: ["Depart from Arafat after sunset with tranquility", "Pray Maghrib and Isha combined upon arrival", "Spend the night at Muzdalifah until Fajr", "Collect pebbles for stoning (49 or 70 pebbles)"],
      dua: "O Allah, I ask You to grant me comprehensive goodness and to protect me from the Fire.",
      significance: "Staying at Muzdalifah is an obligation of Hajj — a time for rest, reflection, and preparation for the Day of Sacrifice."
    },
    {
      id: "rami",
      title: "Stoning the Jamarat",
      subtitle: "Rejecting the Devil",
      description: "Stoning the Jamarat in Mina symbolizes rejecting Satan's whispers, following Prophet Ibrahim who pelted the devil with stones.",
      steps: ["Stone Jamrat al-Aqabah on the Day of Sacrifice (7 pebbles)", "Stone all three Jamarat on the Days of Tashreeq (11th, 12th, 13th)", "Order: smallest, then middle, then largest", "Say Takbeer with each pebble"],
      dua: "Bismillah, Allahu Akbar — in defiance of Shaytan and his party.",
      significance: "Stoning teaches us to resist Satan and his whispers, and to remain steadfast in obedience to Allah despite all challenges."
    },
    {
      id: "nahr",
      title: "Sacrifice (Hady)",
      subtitle: "Day of Sacrifice",
      description: "Offering a sacrifice on the 10th of Dhul Hijjah follows Prophet Ibrahim's example when Allah ransomed his son Ismail with a great sacrifice.",
      steps: ["Offer the sacrifice after stoning Jamrat al-Aqabah", "Delegation for slaughter is permissible", "Shave or trim hair after the sacrifice", "First release from Ihram (partial)"],
      dua: "Bismillah, Allahu Akbar. O Allah, this is from You and for You.",
      significance: "The sacrifice symbolizes devotion and redemption for Allah's sake, reminding us of Ibrahim and Ismail's story of ultimate submission."
    },
    {
      id: "tawaf-ifadah",
      title: "Tawaf al-Ifadah",
      subtitle: "A Pillar of Hajj",
      description: "Tawaf al-Ifadah is an essential pillar of Hajj — without it, Hajj is incomplete. It is performed after the first release from Ihram on the Day of Sacrifice or after.",
      steps: ["Proceed to the Sacred Mosque", "Circle the Kaaba seven times", "Pray two Rak'ahs behind Maqam Ibrahim", "Perform Sa'i if not done after Tawaf al-Qudum"],
      dua: "O Allah, make it an accepted Hajj, a rewarded effort, and a forgiven sin.",
      significance: "Tawaf al-Ifadah represents the complete release from Ihram and the return to normal life after completing the greatest pillar of Hajj."
    }
  ]
};

const DEFAULT_UMRAH_RITUALS = {
  ar: [
    {
      id: "ihram",
      title: "الإحرام",
      subtitle: "الدخول في النسك",
      description: "الإحرام هو نية الدخول في العمرة عند الميقات. يغتسل المعتمر ويتطيب ثم يلبس ملابس الإحرام ويعقد النية.",
      steps: ["الاغتسال والتطيب", "لبس ملابس الإحرام (إزار ورداء أبيضان للرجال)", "عقد النية: لبيك اللهم عمرة", "التلبية المستمرة حتى بدء الطواف"],
      dua: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً، لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ",
      significance: "الإحرام يطهّر النفس من التعلق بالدنيا ويذكّر المسلم بيوم الحشر حين يقف الجميع سواسية أمام الله."
    },
    {
      id: "tawaf",
      title: "الطواف",
      subtitle: "سبعة أشواط حول الكعبة",
      description: "الطواف حول الكعبة المشرفة سبعة أشواط، بدءاً من الحجر الأسود وانتهاءً به، في اتجاه عكس عقارب الساعة.",
      steps: ["استقبال الحجر الأسود والتكبير", "الطواف سبعة أشواط (الكعبة عن يسارك)", "الدعاء والذكر أثناء الطواف", "صلاة ركعتين خلف مقام إبراهيم"],
      dua: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
      significance: "الطواف عبادة قلبية وبدنية، يدور فيها المسلم حول بيت الله معبّراً عن خضوعه وتعظيمه لله وحده."
    },
    {
      id: "sai",
      title: "السعي",
      subtitle: "بين الصفا والمروة",
      description: "السعي بين الصفا والمروة سبعة أشواط، بدءاً من الصفا وانتهاءً بالمروة، إحياءً لسنة السيدة هاجر عليها السلام.",
      steps: ["الصعود على الصفا والدعاء", "المشي إلى المروة (شوط واحد)", "الهرولة بين العلمين الأخضرين (للرجال)", "إتمام سبعة أشواط (الانتهاء عند المروة)"],
      dua: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ",
      significance: "السعي يعلّمنا الأخذ بالأسباب مع التوكل على الله، فالسيدة هاجر سعت ولم تجلس تنتظر، فأكرمها الله بماء زمزم."
    },
    {
      id: "halq",
      title: "الحلق أو التقصير",
      subtitle: "التحلل من الإحرام",
      description: "الحلق (حلق الرأس بالكامل) أو التقصير (قص جزء من الشعر) هو آخر مناسك العمرة، وبه يتحلل المعتمر من إحرامه.",
      steps: ["الحلق أفضل للرجال (حلق الرأس كاملاً)", "التقصير جائز (قص أطراف الشعر)", "المرأة تقصّر من أطراف شعرها قدر أنملة", "التحلل الكامل من الإحرام بعد ذلك"],
      dua: "اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ وَالْمُقَصِّرِينَ",
      significance: "الحلق أو التقصير يرمز إلى التجديد والتخلص من الذنوب، كأن المعتمر يولد من جديد بعد إتمام العمرة."
    }
  ],
  en: [
    {
      id: "ihram",
      title: "Ihram",
      subtitle: "Entering the Sacred State",
      description: "Ihram is the intention to enter the state of Umrah at the Miqat. The pilgrim bathes, applies fragrance, wears Ihram garments, and makes the intention.",
      steps: ["Perform Ghusl and apply fragrance", "Wear Ihram garments (two white cloths for men)", "Make intention: Labbayk Allahumma Umrah", "Continue reciting Talbiyah until beginning Tawaf"],
      dua: "Labbayk Allahumma Umratan, Labbayk Allahumma labbayk.",
      significance: "Ihram purifies the soul from worldly attachments and reminds Muslims of the Day of Resurrection when all stand equal before Allah."
    },
    {
      id: "tawaf",
      title: "Tawaf",
      subtitle: "Seven Circuits Around the Kaaba",
      description: "Tawaf is circling the Holy Kaaba seven times, starting and ending at the Black Stone, moving counter-clockwise.",
      steps: ["Face the Black Stone and say Takbeer", "Circle seven times (Kaaba on your left)", "Make dua and dhikr during Tawaf", "Pray two Rak'ahs behind Maqam Ibrahim"],
      dua: "SubhanAllah, Alhamdulillah, La ilaha illallah, Allahu Akbar.",
      significance: "Tawaf is an act of worship combining heart and body — the Muslim revolves around Allah's House expressing submission and glorification of Allah alone."
    },
    {
      id: "sai",
      title: "Sa'i",
      subtitle: "Between Safa and Marwah",
      description: "Sa'i is walking seven laps between Safa and Marwah, starting at Safa and ending at Marwah, commemorating Hajar's legacy.",
      steps: ["Ascend Safa and make supplication", "Walk to Marwah (one lap)", "Jog between the green markers (for men)", "Complete seven laps (ending at Marwah)"],
      dua: "Indeed, Safa and Marwah are among the symbols of Allah. I begin with what Allah began with.",
      significance: "Sa'i teaches us to take action while trusting in Allah — Hajar strived and did not sit idle, so Allah honored her with the water of Zamzam."
    },
    {
      id: "halq",
      title: "Shaving or Trimming",
      subtitle: "Release from Ihram",
      description: "Shaving the head (Halq) or trimming the hair (Taqseer) is the final rite of Umrah, after which the pilgrim is fully released from Ihram.",
      steps: ["Shaving is preferred for men (complete head shave)", "Trimming is permissible (cutting hair ends)", "Women trim a fingertip's length from their hair", "Full release from Ihram after this step"],
      dua: "O Allah, forgive those who shave and those who trim.",
      significance: "Shaving or trimming symbolizes renewal and shedding of sins — as if the pilgrim is reborn after completing Umrah."
    }
  ]
};

function mapRitualsToStrapi(rituals) {
  return (rituals || []).map((r) => ({
    title: r.title,
    subtitle: r.subtitle,
    description: r.description,
    icon: r.id,
    steps: (r.steps || []).map(text => ({ text })),
    dua: r.dua,
    significance: r.significance,
  }));
}

function bulletsFromStrings(strings) {
  return (strings || []).filter(Boolean).map((text) => ({ text }));
}

async function buildHajPage(strapi, haj, locale) {
  const s = haj.services || {};
  const hotels = haj.hotels || {};
  const pricing = haj.pricing || {};

  const hotelCards = await Promise.all(
    [hotels.madinah, hotels.makkah].filter(Boolean).map(async (h) => {
      const hotelSlug = resolveHajHotelSlug(h.name);
      const hotelId =
        (await findHotelDocumentId(strapi, h.name, locale)) ||
        (hotelSlug
          ? await findHotelDocumentIdBySlug(strapi, hotelSlug, locale)
          : null);
      return {
        location: h.location,
        name: h.name,
        feature1: h.feature1,
        feature2: h.feature2,
        nightsDates: h.nights,
        hotelSlug,
        hotel: hotelId || null,
      };
    }),
  );

  const buildPackage = (pkg, pricingKey, isVip) => {
    const p = haj.pricing?.[pricingKey] || {};
    const features = pkg.features
      ? Object.values(pkg.features).filter(Boolean)
      : [];

    return {
      badge: pkg.badge,
      title: pkg.title,
      notePrimary: isVip ? pkg.lotteryNote : pkg.ministryNote,
      noteSecondary: isVip ? pkg.lotteryDisclaimer : pkg.priceDisclaimer,
      featuresTitle: pkg.featuresTitle,
      features: bulletsFromStrings(features),
      hotelsTitle: pkg.hotelsTitle,
      hotels: hotelCards,
      pricingTitle: pkg.pricingTitle,
      pricing: {
        doubleRoom: p.double,
        tripleRoom: p.triple,
        quadRoom: p.quad,
        reservationAmount: p.reservation,
        note: isVip ? undefined : pkg.priceWithoutAirfare,
      },
      ritualsTitle: pkg.ritualsTitle,
      showRituals: true,
      rituals: mapRitualsToStrapi(DEFAULT_HAJ_RITUALS[locale]),
      footerNote: isVip ? pkg.directVisaNote : undefined,
    };
  };

  return {
    hero: {
      title: haj.hero?.title,
      subtitle: haj.hero?.subtitle,
      dateOrSeason: haj.hero?.date,
    },
    servicesSection: {
      header: {
        eyebrow: s.sectionTitle,
        title: s.sectionSubtitle,
        description: s.intro,
      },
      services: SERVICE_ENTRIES.map(({ key, icon }) => ({
        icon,
        title: s[key]?.title,
        description: s[key]?.description,
      })).filter((item) => item.title),
    },
    vipPackage: buildPackage(haj.vipPackage || {}, "vip", true),
    distinguishedPackage: buildPackage(
      haj.distinguishedPackage || {},
      "distinguished",
      false,
    ),
    pricingLabels: {
      doubleRoom: pricing.doubleRoom,
      tripleRoom: pricing.tripleRoom,
      quadRoom: pricing.quadRoom,
      doubleRoomDesc: pricing.doubleRoomDesc,
      tripleRoomDesc: pricing.tripleRoomDesc,
      quadRoomDesc: pricing.quadRoomDesc,
      reservationAmount: haj.vipPackage?.reservationAmount,
    },
    stepsSection: {
      header: {
        eyebrow: haj.steps?.title,
        title: haj.steps?.subtitle,
        description: haj.steps?.description,
      },
      steps: HAJ_STEP_KEYS.map((key) => ({
        title: haj.steps?.[key]?.title,
        description: haj.steps?.[key]?.description,
      })).filter((step) => step.title),
    },
  };
}

function formatUmrahPrice(value) {
  if (value == null) return null;
  return String(value);
}

function buildUmrahPackageCard(pkg) {
  if (!pkg) return null;
  const prices = pkg.prices || {};
  return {
    makkahHotel: pkg.makkahHotel,
    makkahNights: pkg.makkahNights,
    makkahMeals: pkg.makkahMeals,
    madinahHotel: pkg.madinahHotel,
    madinahNights: pkg.madinahNights,
    madinahMeals: pkg.madinahMeals,
    priceDouble: formatUmrahPrice(prices.double),
    priceTriple: formatUmrahPrice(prices.triple),
    priceQuad: formatUmrahPrice(prices.quad),
    isFeatured: Boolean(pkg.isFeatured),
  };
}

async function buildUmrahPage(strapi, omra, locale) {
  const policies = omra.policies || {};
  const pricing = omra.pricing || {};
  const tableLabels = omra.tableLabels || {};
  const programsSection = omra.programsSection || {};
  const programs = Array.isArray(omra.programs) ? omra.programs : [];

  const builtPrograms = [];
  for (const prog of programs) {
    const built = await buildUmrahProgram(strapi, prog, locale);
    if (built) builtPrograms.push(built);
  }

  return {
    hero: {
      title: omra.hero?.title,
      subtitle: omra.hero?.subtitle,
      dateOrSeason: omra.hero?.season,
    },
    stepsSection: {
      header: {
        eyebrow: omra.steps?.title,
        title: omra.steps?.subtitle,
        description: omra.steps?.description,
      },
      steps: UMRAH_STEP_KEYS.map((key) => ({
        title: omra.steps?.[key]?.title,
        description: omra.steps?.[key]?.description,
      })).filter((step) => step.title),
    },
    programsSectionTitle: programsSection.title,
    programsSectionSubtitle: programsSection.subtitle,
    programs: builtPrograms,
    premiumSection: {
      badge: omra.premium?.badge,
      title: omra.premium?.title,
      duration: omra.premium?.duration,
      haramainTrain: omra.premium?.haramainTrain,
      packages: (omra.premium?.packages || [])
        .map(buildUmrahPackageCard)
        .filter(Boolean),
    },
    economySection: {
      badge: omra.economy?.badge,
      title: omra.economy?.title,
      duration: omra.economy?.duration,
      route: omra.economy?.route,
      travelDates: bulletsFromStrings(omra.economy?.travelDates),
      fridayPrayers: bulletsFromStrings(omra.economy?.fridayPrayers),
      package: buildUmrahPackageCard(omra.economy?.package),
    },
    policies: {
      title: policies.title,
      inclusions: {
        title: policies.inclusions?.title,
        items: bulletsFromStrings(policies.inclusions?.items),
      },
      exclusions: {
        title: policies.exclusions?.title,
        items: bulletsFromStrings(policies.exclusions?.items),
      },
      exchangeRateTitle: policies.exchangeRate?.title,
      exchangeRate: policies.exchangeRate?.rate,
      exchangeRateNote: policies.exchangeRate?.note,
      roomPolicyTitle: policies.roomPolicy?.title,
      roomPolicyDescription: policies.roomPolicy?.description,
      paymentPolicyTitle: policies.paymentPolicy?.title,
      initialPayment: policies.paymentPolicy?.initialPayment,
      finalPayment: policies.paymentPolicy?.finalPayment,
      paymentNote: policies.paymentPolicy?.note,
      cancellationTitle: policies.cancellation?.title,
      cancellationRules: (policies.cancellation?.rules || []).map((rule) => ({
        period: rule.period,
        penaltyPercent: rule.penalty,
      })),
      documentsTitle: policies.documents?.title,
      documents: {
        title: policies.documents?.title,
        items: bulletsFromStrings(policies.documents?.items),
      },
      cancellationPenaltyText: policies.cancellation?.penaltyText,
    },
    pricingLabels: {
      doubleRoom: pricing.doubleRoom,
      tripleRoom: pricing.tripleRoom,
      quadRoom: pricing.quadRoom,
      perPerson: pricing.perPerson,
      currency: pricing.currency,
      makkah: pricing.makkah,
      madinah: pricing.madinah,
      nights: pricing.nights,
    },
    tableLabels: {
      tripDatesLabel: tableLabels.tripDatesLabel,
      routeLabel: tableLabels.routeLabel,
      duration: tableLabels.duration,
      madinahHeader: tableLabels.madinahHeader,
      makkahHeader: tableLabels.makkahHeader,
      perPersonHeader: tableLabels.perPersonHeader,
      doubleColumn: tableLabels.doubleColumn,
      tripleColumn: tableLabels.tripleColumn,
      quadColumn: tableLabels.quadColumn,
      currency: tableLabels.currency,
      issueDateLabel: tableLabels.issueDateLabel,
      logoTagline: tableLabels.logoTagline,
    },
  };
}

async function findHotelDocumentId(strapi, name, locale) {
  if (!name) return null;
  const trimmed = String(name).trim();
  if (!trimmed) return null;
  const tryLocales = [locale, "en", "ar"].filter(
    (l, i, arr) => l && arr.indexOf(l) === i,
  );
  for (const tryLocale of tryLocales) {
    const matches = await strapi.documents("api::hotel.hotel").findMany({
      locale: tryLocale,
      filters: { name: { $eqi: trimmed } },
      fields: ["documentId", "name"],
      limit: 1,
    });
    if (matches?.length) return matches[0].documentId;
  }
  return null;
}

function normalizeHotelName(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim();
}

function resolveHajHotelSlug(name) {
  const normalized = normalizeHotelName(name);
  const known = [
    ["movenpick anwar al madinah", "movenpick-anwar-madinah"],
    ["موفنبيك انوار المدينة", "movenpick-anwar-madinah"],
    ["movenpick hajar swiss", "movenpick-hajar-makkah"],
    ["موفنبيك هاجر سويس", "movenpick-hajar-makkah"],
    ["fairmont clock tower", "fairmont-makkah"],
    ["فيرمونت برج الساعة", "fairmont-makkah"],
  ];
  return known.find(([needle]) => normalized.includes(needle))?.[1] || null;
}

async function findHotelDocumentIdBySlug(strapi, slug, locale) {
  if (!slug) return null;
  const tryLocales = [locale, "en", "ar"].filter(
    (l, i, arr) => l && arr.indexOf(l) === i,
  );
  for (const tryLocale of tryLocales) {
    const matches = await strapi.documents("api::hotel.hotel").findMany({
      locale: tryLocale,
      filters: { slug: { $eq: slug } },
      fields: ["documentId", "slug"],
      limit: 1,
    });
    if (matches?.length) return matches[0].documentId;
  }
  return null;
}

async function buildUmrahProgram(strapi, prog, locale) {
  if (!prog) return null;
  const hotels = await Promise.all(
    (prog.hotels || []).map(async (h) => {
      const [madinahId, makkahId] = await Promise.all([
        findHotelDocumentId(strapi, h.madinahHotel, locale),
        findHotelDocumentId(strapi, h.makkahHotel, locale),
      ]);
      return {
        madinahHotel: madinahId || null,
        madinahHotelLabel: h.madinahHotel || null,
        madinahNights: h.madinahNights,
        madinahMeals: h.madinahMeals,
        makkahHotel: makkahId || null,
        makkahHotelLabel: h.makkahHotel || null,
        makkahNights: h.makkahNights,
        makkahMeals: h.makkahMeals,
        priceQuad: h.priceQuad,
        priceTriple: h.priceTriple,
        priceDouble: h.priceDouble,
      };
    }),
  );

  return {
    badge: prog.badge,
    releaseDate: prog.releaseDate,
    title: prog.title,
    season: prog.season,
    route: prog.route,
    travelDates: prog.travelDates,
    duration: prog.duration,
    headerNote: prog.headerNote,
    priceDisclaimer: prog.priceDisclaimer,
    logoVariant: prog.logoVariant || "default",
    accentColor: prog.accentColor || "default",
    hotels,
    programIncludesTitle: prog.programIncludesTitle,
    programIncludes: bulletsFromStrings(prog.programIncludes),
    programExcludesTitle: prog.programExcludesTitle,
    programExcludes: bulletsFromStrings(prog.programExcludes),
    notesTitle: prog.notesTitle,
    notes: bulletsFromStrings(prog.notes),
    documentsTitle: prog.documentsTitle,
    requiredDocuments: bulletsFromStrings(prog.requiredDocuments),
    ritualsTitle: prog.ritualsTitle,
    showRituals: true,
    rituals: mapRitualsToStrapi(DEFAULT_UMRAH_RITUALS[locale]),
  };
}

async function upsertBaseLocale(strapi, uid, locale, data) {
  const existing = await strapi.documents(uid).findMany({ locale });
  if (existing?.length > 0) {
    const updated = await strapi.documents(uid).update({
      documentId: existing[0].documentId,
      locale,
      data,
      status: "published",
    });
    return updated.documentId;
  }
  const created = await strapi.documents(uid).create({
    data,
    locale,
    status: "published",
  });
  return created.documentId;
}

async function upsertLinkedLocale(strapi, uid, documentId, locale, data) {
  const result = await strapi.documents(uid).update({
    documentId,
    locale,
    data,
    status: "published",
  });
  return result.documentId;
}

async function seedLocalizedSingleType(strapi, uid, enData, arData, label) {
  console.log(`Seeding structured ${label} page (en, ar)...`);
  const documentId = await upsertBaseLocale(strapi, uid, "en", enData);
  await upsertLinkedLocale(strapi, uid, documentId, "ar", arData);
  return documentId;
}

async function main() {
  const arPath = path.join(__dirname, "../../frontend/locales/ar/translation.json");
  const enPath = path.join(__dirname, "../../frontend/locales/en/translation.json");
  if (!fs.existsSync(arPath) || !fs.existsSync(enPath)) {
    console.error("Translation files not found.");
    process.exit(1);
  }
  const distDir = path.join(__dirname, "..", "dist");
  if (!fs.existsSync(distDir)) {
    console.error('Run "npm run build" in strapi/ first.');
    process.exit(1);
  }
  const ar = JSON.parse(fs.readFileSync(arPath, "utf8"));
  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  console.log("Loading Strapi...");
  const { createStrapi } = require("@strapi/strapi");
  const app = await createStrapi({ distDir: "./dist" }).load();
  console.log("Strapi loaded.\n");

  try {
    await seedLocalizedSingleType(
      app,
      "api::haj-page.haj-page",
      await buildHajPage(app, en.haj, "en"),
      await buildHajPage(app, ar.haj, "ar"),
      "Haj"
    );
    await seedLocalizedSingleType(
      app,
      "api::umrah-page.umrah-page",
      await buildUmrahPage(app, en.omra, "en"),
      await buildUmrahPage(app, ar.omra, "ar"),
      "Umrah"
    );
    console.log("\nDone. Haj & Umrah pages seeded with structured components.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
