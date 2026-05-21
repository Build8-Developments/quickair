"use client";
import React, { useState } from "react";

/**
 * RitualsGuideSection — Detailed religious/ritual guide for Hajj or Umrah.
 * Shows expandable cards with spiritual significance, steps, and duas.
 *
 * @param {"haj"|"umrah"} props.type
 * @param {boolean} props.isRTL
 */

/* -------------------------------------------------------------------------- */
/* SVG Icons                                                                  */
/* -------------------------------------------------------------------------- */

const RITUAL_ICONS = {
  ihram: (
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  ),
  tawaf: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  ),
  "tawaf-qudum": (
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
  ),
  sai: (
    <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3A7.3 7.3 0 0 0 19.49 13v-2c-1.9 0-3.5-.8-4.6-2l-1-1.3c-.4-.5-1-.8-1.7-.8-.3 0-.5.1-.8.1L6.49 9v5h2V10.1l1.8-.7-1.6 8.1-4.7-1-.4 2 6.3 1.4z" />
  ),
  arafat: (
    <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z" />
  ),
  muzdalifah: (
    <path d="M12.01 12c0-3.57 2.2-6.62 5.31-7.87.89-.36.75-1.69-.19-1.9-1.1-.24-2.27-.18-3.37.25-3.83 1.5-6.16 5.45-5.63 9.54.4 3.08 2.53 5.63 5.31 6.79.89.37 1.82.56 2.76.56 1.97 0 3.81-.82 5.14-2.13.71-.7.07-1.86-.88-1.61-3.38.88-6.45-1.4-6.45-4.63z" />
  ),
  rami: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-11h2v2h-2zm0 4h2v4h-2z" />
  ),
  nahr: (
    <path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2A5.37 5.37 0 0 0 5.4 6.62C2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12a5.386 5.386 0 0 0 3.82 1.57c2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z" />
  ),
  "tawaf-ifadah": (
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
  ),
  halq: (
    <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z" />
  ),
};

function RitualIcon({ id }) {
  const path = RITUAL_ICONS[id] || RITUAL_ICONS.ihram;
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: 26, height: 26, fill: "var(--color-accent-1)" }}
      aria-hidden
    >
      {path}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

const HAJ_RITUALS = {
  ar: [
    { id: "ihram", title: "الإحرام", subtitle: "بداية الرحلة المقدسة", description: "الإحرام هو نية الدخول في النسك، ويكون عند الميقات المحدد. يرتدي الرجل إزاراً ورداءً أبيضين، وتلبس المرأة ملابسها العادية الساترة.", steps: ["الاغتسال والتطيب قبل الإحرام", "لبس ملابس الإحرام عند الميقات", "عقد النية والتلبية: لبيك اللهم حجاً", "التلبية المستمرة حتى رمي جمرة العقبة"], dua: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ", significance: "الإحرام يرمز إلى المساواة بين جميع المسلمين أمام الله، فلا فرق بين غني وفقير، ولا بين عربي وأعجمي." },
    { id: "tawaf-qudum", title: "طواف القدوم", subtitle: "تحية البيت الحرام", description: "طواف القدوم هو أول ما يفعله الحاج عند وصوله إلى مكة المكرمة، وهو تحية للمسجد الحرام والكعبة المشرفة.", steps: ["البدء من الحجر الأسود مع التكبير", "الطواف سبعة أشواط حول الكعبة", "الاضطباع والرمل في الأشواط الثلاثة الأولى للرجال", "صلاة ركعتين خلف مقام إبراهيم"], dua: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", significance: "الطواف يرمز إلى وحدة المسلمين ودورانهم حول محور واحد هو بيت الله الحرام، كما تدور الملائكة حول العرش." },
    { id: "sai", title: "السعي", subtitle: "بين الصفا والمروة", description: "السعي بين الصفا والمروة سبعة أشواط، إحياءً لذكرى سعي السيدة هاجر عليها السلام بحثاً عن الماء لابنها إسماعيل.", steps: ["البدء من الصفا والصعود عليه", "التوجه إلى المروة (شوط واحد)", "الإسراع بين العلمين الأخضرين للرجال", "إتمام سبعة أشواط (الانتهاء عند المروة)"], dua: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ", significance: "السعي يذكّرنا بتوكل السيدة هاجر على الله وسعيها لطلب الرزق، وأن الله لا يضيع أجر من أحسن عملاً." },
    { id: "arafat", title: "الوقوف بعرفة", subtitle: "ركن الحج الأعظم", description: "الوقوف بعرفة هو ركن الحج الأعظم، يكون في اليوم التاسع من ذي الحجة. قال النبي ﷺ: 'الحج عرفة'.", steps: ["التوجه إلى عرفة صباح يوم التاسع من ذي الحجة", "الوقوف بعرفة من الزوال إلى غروب الشمس", "الإكثار من الدعاء والذكر والاستغفار", "الجمع بين الظهر والعصر قصراً وجمع تقديم"], dua: "خَيْرُ الدُّعَاءِ دُعَاءُ يَوْمِ عَرَفَةَ، وَخَيْرُ مَا قُلْتُ أَنَا وَالنَّبِيُّونَ مِنْ قَبْلِي: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", significance: "يوم عرفة هو أفضل أيام الدنيا، يباهي الله بأهل عرفة أهل السماء، ويعتق فيه رقاباً من النار أكثر من أي يوم آخر." },
    { id: "muzdalifah", title: "المبيت بمزدلفة", subtitle: "ليلة العاشر من ذي الحجة", description: "بعد غروب شمس يوم عرفة، ينفر الحجاج إلى مزدلفة للمبيت بها وجمع الحصى لرمي الجمرات.", steps: ["الانطلاق من عرفة بعد الغروب بسكينة", "صلاة المغرب والعشاء جمع تأخير عند الوصول", "المبيت بمزدلفة حتى الفجر", "جمع حصى الجمرات (49 أو 70 حصاة)"], dua: "اللَّهُمَّ إِنِّي أَسْأَلُكَ أَنْ تَرْزُقَنِي جَوَامِعَ الْخَيْرِ، وَتُجِيرَنِي مِنَ النَّارِ", significance: "المبيت بمزدلفة واجب من واجبات الحج، وهو وقت للراحة والتأمل والاستعداد ليوم النحر." },
    { id: "rami", title: "رمي الجمرات", subtitle: "رمز رفض الشيطان", description: "رمي الجمرات في منى يرمز إلى رفض وساوس الشيطان، اقتداءً بسيدنا إبراهيم عليه السلام حين رمى الشيطان بالحصى.", steps: ["رمي جمرة العقبة الكبرى يوم النحر (7 حصيات)", "رمي الجمرات الثلاث أيام التشريق (11، 12، 13 ذي الحجة)", "الترتيب: الصغرى ثم الوسطى ثم الكبرى", "التكبير مع كل حصاة"], dua: "بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ، رَغْمًا لِلشَّيْطَانِ وَحِزْبِهِ", significance: "رمي الجمرات يعلّمنا مقاومة الشيطان ووساوسه، والثبات على طاعة الله مهما كانت التحديات." },
    { id: "nahr", title: "الهدي (الذبح)", subtitle: "يوم النحر", description: "ذبح الهدي يوم النحر (العاشر من ذي الحجة) اقتداءً بسيدنا إبراهيم عليه السلام حين فدى الله ابنه إسماعيل بذبح عظيم.", steps: ["ذبح الهدي بعد رمي جمرة العقبة", "يجوز التوكيل في الذبح", "الحلق أو التقصير بعد الذبح", "التحلل الأول (خلع الإحرام)"], dua: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ هَذَا مِنْكَ وَلَكَ", significance: "الهدي يرمز إلى التضحية والفداء في سبيل الله، ويذكّرنا بقصة سيدنا إبراهيم وابنه إسماعيل عليهما السلام." },
    { id: "tawaf-ifadah", title: "طواف الإفاضة", subtitle: "ركن من أركان الحج", description: "طواف الإفاضة ركن من أركان الحج لا يصح الحج بدونه. يؤدى بعد التحلل الأول يوم النحر أو بعده.", steps: ["التوجه إلى المسجد الحرام", "الطواف سبعة أشواط حول الكعبة", "صلاة ركعتين خلف مقام إبراهيم", "السعي بين الصفا والمروة (لمن لم يسعَ بعد طواف القدوم)"], dua: "اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا، وَسَعْيًا مَشْكُورًا، وَذَنْبًا مَغْفُورًا", significance: "طواف الإفاضة يمثل التحلل الكامل من الإحرام والعودة إلى الحياة الطبيعية بعد إتمام أعظم أركان الحج." },
  ],
  en: [
    { id: "ihram", title: "Ihram", subtitle: "Beginning the Sacred Journey", description: "Ihram is the state of ritual purity entered at the designated Miqat. Men wear two white unstitched cloths, while women wear their regular modest clothing.", steps: ["Perform Ghusl (ritual bath) and apply fragrance before Ihram", "Wear Ihram garments at the Miqat", "Make the intention and recite Talbiyah", "Continue reciting Talbiyah until stoning Jamrat al-Aqabah"], dua: "Labbayk Allahumma labbayk, labbayk la shareeka laka labbayk. Innal-hamda wan-ni'mata laka wal-mulk, la shareeka lak.", significance: "Ihram symbolizes equality before Allah — no distinction between rich and poor, Arab and non-Arab. All stand equal before their Creator." },
    { id: "tawaf-qudum", title: "Tawaf al-Qudum", subtitle: "Greeting the Sacred House", description: "Tawaf al-Qudum is the first act upon arriving in Makkah — a greeting to the Sacred Mosque and the Holy Kaaba.", steps: ["Begin at the Black Stone with Takbeer", "Circle the Kaaba seven times counter-clockwise", "Men perform Idtiba and Raml in the first three rounds", "Pray two Rak'ahs behind Maqam Ibrahim"], dua: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhab an-nar.", significance: "Tawaf represents the unity of Muslims revolving around one center — the House of Allah — just as angels circle the Throne." },
    { id: "sai", title: "Sa'i", subtitle: "Between Safa and Marwah", description: "Sa'i is walking seven times between the hills of Safa and Marwah, commemorating Hajar's search for water for her son Ismail.", steps: ["Start at Safa and ascend it", "Walk towards Marwah (one lap)", "Men jog between the green markers", "Complete seven laps (ending at Marwah)"], dua: "Indeed, Safa and Marwah are among the symbols of Allah.", significance: "Sa'i reminds us of Hajar's trust in Allah and her effort to seek provision — Allah never wastes the reward of those who do good." },
    { id: "arafat", title: "Standing at Arafat", subtitle: "The Greatest Pillar of Hajj", description: "Standing at Arafat on the 9th of Dhul Hijjah is the greatest pillar of Hajj. The Prophet ﷺ said: 'Hajj is Arafat.'", steps: ["Travel to Arafat on the morning of the 9th Dhul Hijjah", "Stand at Arafat from noon until sunset", "Engage in abundant supplication and remembrance", "Combine Dhuhr and Asr prayers (shortened)"], dua: "The best supplication is on the Day of Arafat: La ilaha illallahu wahdahu la shareeka lah.", significance: "The Day of Arafat is the best day of the year. Allah boasts to the angels about the people of Arafat and frees more souls from the Fire than any other day." },
    { id: "muzdalifah", title: "Night at Muzdalifah", subtitle: "The Night of the 10th Dhul Hijjah", description: "After sunset on the Day of Arafat, pilgrims proceed to Muzdalifah to spend the night and collect pebbles for stoning.", steps: ["Depart from Arafat after sunset with tranquility", "Pray Maghrib and Isha combined upon arrival", "Spend the night at Muzdalifah until Fajr", "Collect pebbles for stoning (49 or 70 pebbles)"], dua: "O Allah, I ask You to grant me comprehensive goodness and to protect me from the Fire.", significance: "Staying at Muzdalifah is an obligation of Hajj — a time for rest, reflection, and preparation for the Day of Sacrifice." },
    { id: "rami", title: "Stoning the Jamarat", subtitle: "Rejecting the Devil", description: "Stoning the Jamarat in Mina symbolizes rejecting Satan's whispers, following Prophet Ibrahim who pelted the devil with stones.", steps: ["Stone Jamrat al-Aqabah on the Day of Sacrifice (7 pebbles)", "Stone all three Jamarat on the Days of Tashreeq (11th, 12th, 13th)", "Order: smallest, then middle, then largest", "Say Takbeer with each pebble"], dua: "Bismillah, Allahu Akbar — in defiance of Shaytan and his party.", significance: "Stoning teaches us to resist Satan and his whispers, and to remain steadfast in obedience to Allah despite all challenges." },
    { id: "nahr", title: "Sacrifice (Hady)", subtitle: "Day of Sacrifice", description: "Offering a sacrifice on the 10th of Dhul Hijjah follows Prophet Ibrahim's example when Allah ransomed his son Ismail with a great sacrifice.", steps: ["Offer the sacrifice after stoning Jamrat al-Aqabah", "Delegation for slaughter is permissible", "Shave or trim hair after the sacrifice", "First release from Ihram (partial)"], dua: "Bismillah, Allahu Akbar. O Allah, this is from You and for You.", significance: "The sacrifice symbolizes devotion and redemption for Allah's sake, reminding us of Ibrahim and Ismail's story of ultimate submission." },
    { id: "tawaf-ifadah", title: "Tawaf al-Ifadah", subtitle: "A Pillar of Hajj", description: "Tawaf al-Ifadah is an essential pillar of Hajj — without it, Hajj is incomplete. It is performed after the first release from Ihram on the Day of Sacrifice or after.", steps: ["Proceed to the Sacred Mosque", "Circle the Kaaba seven times", "Pray two Rak'ahs behind Maqam Ibrahim", "Perform Sa'i if not done after Tawaf al-Qudum"], dua: "O Allah, make it an accepted Hajj, a rewarded effort, and a forgiven sin.", significance: "Tawaf al-Ifadah represents the complete release from Ihram and the return to normal life after completing the greatest pillar of Hajj." },
  ],
};

const UMRAH_RITUALS = {
  ar: [
    { id: "ihram", title: "الإحرام", subtitle: "الدخول في النسك", description: "الإحرام هو نية الدخول في العمرة عند الميقات. يغتسل المعتمر ويتطيب ثم يلبس ملابس الإحرام ويعقد النية.", steps: ["الاغتسال والتطيب", "لبس ملابس الإحرام (إزار ورداء أبيضان للرجال)", "عقد النية: لبيك اللهم عمرة", "التلبية المستمرة حتى بدء الطواف"], dua: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً، لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ", significance: "الإحرام يطهّر النفس من التعلق بالدنيا ويذكّر المسلم بيوم الحشر حين يقف الجميع سواسية أمام الله." },
    { id: "tawaf", title: "الطواف", subtitle: "سبعة أشواط حول الكعبة", description: "الطواف حول الكعبة المشرفة سبعة أشواط، بدءاً من الحجر الأسود وانتهاءً به، في اتجاه عكس عقارب الساعة.", steps: ["استقبال الحجر الأسود والتكبير", "الطواف سبعة أشواط (الكعبة عن يسارك)", "الدعاء والذكر أثناء الطواف", "صلاة ركعتين خلف مقام إبراهيم"], dua: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ", significance: "الطواف عبادة قلبية وبدنية، يدور فيها المسلم حول بيت الله معبّراً عن خضوعه وتعظيمه لله وحده." },
    { id: "sai", title: "السعي", subtitle: "بين الصفا والمروة", description: "السعي بين الصفا والمروة سبعة أشواط، بدءاً من الصفا وانتهاءً بالمروة، إحياءً لسنة السيدة هاجر عليها السلام.", steps: ["الصعود على الصفا والدعاء", "المشي إلى المروة (شوط واحد)", "الهرولة بين العلمين الأخضرين (للرجال)", "إتمام سبعة أشواط (الانتهاء عند المروة)"], dua: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ", significance: "السعي يعلّمنا الأخذ بالأسباب مع التوكل على الله، فالسيدة هاجر سعت ولم تجلس تنتظر، فأكرمها الله بماء زمزم." },
    { id: "halq", title: "الحلق أو التقصير", subtitle: "التحلل من الإحرام", description: "الحلق (حلق الرأس بالكامل) أو التقصير (قص جزء من الشعر) هو آخر مناسك العمرة، وبه يتحلل المعتمر من إحرامه.", steps: ["الحلق أفضل للرجال (حلق الرأس كاملاً)", "التقصير جائز (قص أطراف الشعر)", "المرأة تقصّر من أطراف شعرها قدر أنملة", "التحلل الكامل من الإحرام بعد ذلك"], dua: "اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ وَالْمُقَصِّرِينَ", significance: "الحلق أو التقصير يرمز إلى التجديد والتخلص من الذنوب، كأن المعتمر يولد من جديد بعد إتمام العمرة." },
  ],
  en: [
    { id: "ihram", title: "Ihram", subtitle: "Entering the Sacred State", description: "Ihram is the intention to enter the state of Umrah at the Miqat. The pilgrim bathes, applies fragrance, wears Ihram garments, and makes the intention.", steps: ["Perform Ghusl and apply fragrance", "Wear Ihram garments (two white cloths for men)", "Make intention: Labbayk Allahumma Umrah", "Continue reciting Talbiyah until beginning Tawaf"], dua: "Labbayk Allahumma Umratan, Labbayk Allahumma labbayk.", significance: "Ihram purifies the soul from worldly attachments and reminds Muslims of the Day of Resurrection when all stand equal before Allah." },
    { id: "tawaf", title: "Tawaf", subtitle: "Seven Circuits Around the Kaaba", description: "Tawaf is circling the Holy Kaaba seven times, starting and ending at the Black Stone, moving counter-clockwise.", steps: ["Face the Black Stone and say Takbeer", "Circle seven times (Kaaba on your left)", "Make dua and dhikr during Tawaf", "Pray two Rak'ahs behind Maqam Ibrahim"], dua: "SubhanAllah, Alhamdulillah, La ilaha illallah, Allahu Akbar.", significance: "Tawaf is an act of worship combining heart and body — the Muslim revolves around Allah's House expressing submission and glorification of Allah alone." },
    { id: "sai", title: "Sa'i", subtitle: "Between Safa and Marwah", description: "Sa'i is walking seven laps between Safa and Marwah, starting at Safa and ending at Marwah, commemorating Hajar's legacy.", steps: ["Ascend Safa and make supplication", "Walk to Marwah (one lap)", "Jog between the green markers (for men)", "Complete seven laps (ending at Marwah)"], dua: "Indeed, Safa and Marwah are among the symbols of Allah. I begin with what Allah began with.", significance: "Sa'i teaches us to take action while trusting in Allah — Hajar strived and did not sit idle, so Allah honored her with the water of Zamzam." },
    { id: "halq", title: "Shaving or Trimming", subtitle: "Release from Ihram", description: "Shaving the head (Halq) or trimming the hair (Taqseer) is the final rite of Umrah, after which the pilgrim is fully released from Ihram.", steps: ["Shaving is preferred for men (complete head shave)", "Trimming is permissible (cutting hair ends)", "Women trim a fingertip's length from their hair", "Full release from Ihram after this step"], dua: "O Allah, forgive those who shave and those who trim.", significance: "Shaving or trimming symbolizes renewal and shedding of sins — as if the pilgrim is reborn after completing Umrah." },
  ],
};

const SECTION_HEADERS = {
  haj: {
    ar: { kicker: "الركن الخامس", title: "مناسك الحج بالتفصيل", subtitle: "دليلك الشامل لأداء مناسك الحج خطوة بخطوة مع الأدعية والأذكار" },
    en: { kicker: "The Fifth Pillar", title: "Hajj Rituals in Detail", subtitle: "Your comprehensive guide to performing Hajj step by step with supplications" },
  },
  umrah: {
    ar: { kicker: "سنة مؤكدة", title: "مناسك العمرة بالتفصيل", subtitle: "دليلك الكامل لأداء مناسك العمرة مع الأدعية المأثورة والحكمة من كل منسك" },
    en: { kicker: "A Confirmed Sunnah", title: "Umrah Rituals in Detail", subtitle: "Your complete guide to performing Umrah with authentic supplications and the wisdom behind each rite" },
  },
};

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function RitualsGuideSection({ type = "haj", isRTL = true }) {
  const locale = isRTL ? "ar" : "en";
  const rituals = type === "haj" ? HAJ_RITUALS[locale] : UMRAH_RITUALS[locale];
  const header = SECTION_HEADERS[type][locale];

  return (
    <section
      className="pilgrimage-rituals-guide layout-pt-lg layout-pb-lg"
      style={{
        backgroundColor: "#ffffff",
        direction: isRTL ? "rtl" : "ltr",
        padding: "80px 0",
      }}
    >
      <div className="container" style={{ padding: "0 30px" }}>
        <div className="row justify-center text-center mb-50">
          <div className="col-lg-8">
            <span
              className="text-accent-1 text-14 fw-600 mb-10 d-block"
              style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              data-aos="fade-up"
            >
              {header.kicker}
            </span>
            <h2
              className="text-30 md:text-24 fw-700 text-dark-1 mb-15"
              style={{ lineHeight: 1.6, fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {header.title}
            </h2>
            <p
              className="text-15 text-light-2 lh-18"
              style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {header.subtitle}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {rituals.map((ritual, idx) => (
            <RitualCard key={ritual.id} ritual={ritual} index={idx} isRTL={isRTL} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Ritual Card                                                                */
/* -------------------------------------------------------------------------- */

function RitualCard({ ritual, index, isRTL }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={index * 60}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid rgba(1, 159, 177, 0.15)",
        overflow: "hidden",
        boxShadow: expanded
          ? "0 12px 40px rgba(1, 159, 177, 0.12)"
          : "0 4px 16px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "20px 24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: isRTL ? "right" : "left",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            backgroundColor: "rgba(1, 159, 177, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <RitualIcon id={ritual.id} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--color-accent-1)",
              marginBottom: "2px",
              fontFamily: "'Noto Kufi Arabic', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {isRTL ? `الخطوة ${index + 1}` : `Step ${index + 1}`} · {ritual.subtitle}
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1a1a2e",
              margin: 0,
              fontFamily: "'Noto Kufi Arabic', sans-serif",
            }}
          >
            {ritual.title}
          </h3>
        </div>
        <ChevronIcon expanded={expanded} />
      </button>

      {/* Expandable content */}
      {expanded && (
        <div
          style={{
            padding: "0 24px 24px",
            borderTop: "1px solid rgba(1, 159, 177, 0.1)",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.9,
              color: "#374151",
              marginTop: "16px",
              marginBottom: "20px",
              fontFamily: "'Noto Kufi Arabic', sans-serif",
            }}
          >
            {ritual.description}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <InfoBlock
              title={isRTL ? "الخطوات" : "Steps"}
              iconType="steps"
              isRTL={isRTL}
            >
              <ol
                style={{
                  margin: 0,
                  paddingInlineStart: "20px",
                  fontSize: "14px",
                  lineHeight: 2,
                  color: "#374151",
                  fontFamily: "'Noto Kufi Arabic', sans-serif",
                }}
              >
                {ritual.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </InfoBlock>

            <InfoBlock
              title={isRTL ? "الحكمة والمعنى" : "Spiritual Significance"}
              iconType="significance"
              isRTL={isRTL}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: 1.9,
                  color: "#374151",
                  fontFamily: "'Noto Kufi Arabic', sans-serif",
                }}
              >
                {ritual.significance}
              </p>
            </InfoBlock>
          </div>

          {/* Dua */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(1,159,177,0.06) 0%, rgba(16,185,129,0.06) 100%)",
              borderRadius: "12px",
              padding: "16px 20px",
              borderInlineStart: "4px solid var(--color-accent-1)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--color-accent-1)",
                marginBottom: "8px",
                fontFamily: "'Noto Kufi Arabic', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <DuaIcon />
              {isRTL ? "الدعاء المأثور" : "Recommended Supplication"}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 2,
                color: "#1a1a2e",
                fontWeight: 600,
                fontFamily: "'Noto Kufi Arabic', 'Amiri', serif",
              }}
            >
              {ritual.dua}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function InfoBlock({ title, iconType, children }) {
  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        borderRadius: "12px",
        padding: "16px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#1a1a2e",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "'Noto Kufi Arabic', sans-serif",
        }}
      >
        <InfoBlockIcon type={iconType} /> {title}
      </div>
      {children}
    </div>
  );
}

function InfoBlockIcon({ type }) {
  const sz = { width: 16, height: 16, fill: "var(--color-accent-1)" };
  if (type === "steps") {
    return (
      <svg viewBox="0 0 24 24" style={sz} aria-hidden>
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" style={sz} aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  );
}

function DuaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: 16, height: 16, fill: "var(--color-accent-1)" }}
      aria-hidden
    >
      <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7.01 2 18h6.99l-3.72-3.72C6.75 12.89 9.49 12 12.5 12s5.75.89 7.23 2.28L16.01 18H23V7.01l-3.6 3.6C17.55 8.99 15.15 8 12.5 8z" />
    </svg>
  );
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{
        width: 24,
        height: 24,
        fill: "var(--color-accent-1)",
        transition: "transform 0.3s ease",
        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        flexShrink: 0,
      }}
      aria-hidden
    >
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    </svg>
  );
}
