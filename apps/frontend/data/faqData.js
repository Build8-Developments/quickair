/**
 * FAQ Data Structure
 * Organized by categories with questions and answers
 * Supports bilingual content (English and Arabic)
 */

export const faqCategories = {
  en: [
    {
      id: "aviation",
      name: "Aviation",
      icon: "icon-plane",
      questions: [
        {
          id: "aviation-1",
          question: "How can I book a flight on the website?",
          answer:
            'You can easily book a flight by entering your destination, departure and return dates, and the number of passengers, then clicking "Search Flights." Choose the flight that suits you and complete the payment to confirm your booking.',
        },
        {
          id: "aviation-2",
          question: "Do I need to create an account to complete my booking?",
          answer:
            "Not necessarily. You can book as a guest, but creating an account helps you manage your bookings easily and receive special offers.",
        },
        {
          id: "aviation-3",
          question: "What payment methods are available?",
          answer:
            "We accept major credit cards (Visa, MasterCard), e-wallets, and bank transfers.",
        },
        {
          id: "aviation-4",
          question: "How do I know if my booking is confirmed?",
          answer:
            "Once your payment is completed, you will receive a confirmation email with your flight details and booking reference number.",
        },
        {
          id: "aviation-5",
          question: "Can I modify or cancel my booking after it's confirmed?",
          answer:
            'Yes, you can modify or cancel your booking through the "Manage Booking" page. Please note that change or cancellation fees may apply depending on the airline\'s policy.',
        },
        {
          id: "aviation-6",
          question: "I didn't receive a confirmation email. What should I do?",
          answer:
            "Please check your spam or junk mail folder first. If you still haven't received it, contact our customer support team for assistance.",
        },
        {
          id: "aviation-7",
          question: "Are the prices inclusive of taxes and fees?",
          answer:
            "Yes, all displayed prices include taxes and basic fees unless stated otherwise.",
        },
        {
          id: "aviation-8",
          question: "Can I book a multi-destination flight?",
          answer:
            "Yes, you can select the type of trip (one-way, round-trip, or multi-destination) on the search page.",
        },
        {
          id: "aviation-9",
          question: "How can I choose my seat or add extra baggage?",
          answer:
            'You can do this after confirming your booking through the "Manage Booking" page or during online check-in.',
        },
        {
          id: "aviation-10",
          question: "Can I book a ticket for someone else?",
          answer:
            "Yes, you can book a ticket for another person as long as you enter their personal details exactly as shown in their passport.",
        },
      ],
    },
    {
      id: "hajj-umrah",
      name: "Hajj and Umrah",
      icon: "icon-mosque",
      questions: [
        {
          id: "hajj-1",
          question: "How can I book a Hajj or Umrah trip?",
          answer:
            "You can book by selecting the suitable package on our website, entering traveler details, and completing the payment to confirm your reservation.",
        },
        {
          id: "hajj-2",
          question: "What documents are required for booking?",
          answer:
            "A valid passport for at least 6 months, personal photos, flight and hotel bookings.",
        },
        {
          id: "hajj-3",
          question: "Does the package include accommodation and transportation?",
          answer:
            "Yes, our packages usually include accommodation in Mecca and Medina, transportation between holy sites, and additional services depending on the package.",
        },
        {
          id: "hajj-4",
          question: "Do I need a special visa?",
          answer:
            "Yes, Hajj and Umrah trips require an official visa issued by the Kingdom of Saudi Arabia.",
        },
        {
          id: "hajj-5",
          question: "Can I modify or cancel my booking?",
          answer:
            "Bookings can be modified or canceled according to the package's terms. Additional fees may apply if canceled after a certain period.",
        },
        {
          id: "hajj-6",
          question: "Are there tour guides or supervisors during the trip?",
          answer:
            "Yes, all Hajj and Umrah packages include guides and supervisors to assist with rituals and answer questions.",
        },
        {
          id: "hajj-7",
          question: "Does the package include meals?",
          answer:
            "It depends on the selected package. Some include daily meals, while others do not.",
        },
        {
          id: "hajj-8",
          question: "Can I book a group Hajj or Umrah trip?",
          answer:
            "Yes, we provide group packages for families and groups with special booking arrangements.",
        },
        {
          id: "hajj-9",
          question: "What are the health tips during the pilgrimage?",
          answer:
            "Stay hydrated, wear comfortable clothing, avoid overcrowded areas when possible, and follow the supervisors' instructions.",
        },
        {
          id: "hajj-10",
          question: "How do I receive the visa after booking?",
          answer:
            "After completing the booking, you will be contacted to receive your visa electronically or through official embassy procedures.",
        },
      ],
    },
    {
      id: "hotels",
      name: "Hotels",
      icon: "icon-bed",
      questions: [
        {
          id: "hotels-1",
          question: "How can I book a hotel through the website?",
          answer:
            'You can easily book by entering the city or hotel name, check-in and check-out dates, and number of guests, then clicking "Search." Select your preferred hotel and room, and complete the payment to confirm your booking.',
        },
        {
          id: "hotels-2",
          question: "Are taxes and tourist fees included in the room rate?",
          answer:
            "Most rates include taxes and fees, but in some destinations, a local or tourist tax may be charged upon check-in.",
        },
        {
          id: "hotels-3",
          question: "Can I modify or cancel my hotel booking after confirmation?",
          answer:
            'Yes, you can do so through the "Manage Booking" page. Cancellation policies vary depending on the hotel and room type.',
        },
        {
          id: "hotels-4",
          question: "Can I pay at the hotel upon arrival?",
          answer:
            "Some hotels allow payment upon arrival, while others require prepayment to confirm the booking. This will be clearly stated during the booking process.",
        },
        {
          id: "hotels-5",
          question: "Is breakfast included in the room rate?",
          answer:
            "It depends on the room type and rate plan you choose (room only, bed & breakfast, half board, etc.).",
        },
        {
          id: "hotels-6",
          question: "How can I find the exact location of the hotel?",
          answer:
            "You can view the hotel's location on the map shown on the booking page, along with distances from major landmarks and the airport.",
        },
        {
          id: "hotels-7",
          question: "Can I book more than one room at the same time?",
          answer:
            "Yes, you can select the number of rooms you need during the search or booking process.",
        },
        {
          id: "hotels-8",
          question: "Can I book a hotel for someone else?",
          answer:
            "Yes, as long as you enter the guest's name exactly as shown on their ID or passport.",
        },
        {
          id: "hotels-9",
          question: "What should I do if I face a problem during check-in?",
          answer:
            "Please contact our customer support team or the hotel's front desk immediately. We'll assist you in resolving the issue as quickly as possible.",
        },
        {
          id: "hotels-10",
          question: "Can I request an extra bed or special amenities?",
          answer:
            "Yes, you can request an extra bed, baby cot, or special facilities such as an accessible room during booking or by contacting the hotel directly.",
        },
        {
          id: "hotels-11",
          question: "Can I request early check-in or late check-out?",
          answer:
            "This depends on the hotel's policy and room availability. Additional charges may apply in some cases.",
        },
        {
          id: "hotels-12",
          question: "Is Wi-Fi available at the hotel?",
          answer:
            "Most hotels offer free Wi-Fi, but some may charge extra for high-speed internet or access in certain areas.",
        },
        {
          id: "hotels-13",
          question: "Can I book a hotel without a credit card?",
          answer:
            "Some hotels allow bookings without a credit card, but most require a valid card to secure your reservation.",
        },
        {
          id: "hotels-14",
          question: "What happens if I don't show up at the hotel?",
          answer:
            'If you fail to cancel your booking in advance and do not check in, a "no-show" fee may be charged according to the hotel\'s policy.',
        },
        {
          id: "hotels-15",
          question: "Are the hotels family-friendly and safe?",
          answer:
            "Yes, we partner only with verified and secure hotels, and most properties offer family-friendly options and child facilities.",
        },
        {
          id: "hotels-16",
          question: "Can I see photos of the hotel and rooms before booking?",
          answer:
            "Yes, we provide high-quality photos of the hotel, rooms, and facilities so you can review them before booking.",
        },
        {
          id: "hotels-17",
          question: "Does the room rate include airport transfers?",
          answer:
            "Some hotels offer free or paid airport transfer services. You can check this information in the hotel details section.",
        },
        {
          id: "hotels-18",
          question: "Can I book a long-term stay?",
          answer:
            "Yes, you can book a long-term stay, and many hotels offer special rates for extended stays.",
        },
      ],
    },
    {
      id: "visas",
      name: "Visas",
      icon: "icon-passport",
      questions: [
        {
          id: "visas-1",
          question: "How can I obtain a travel visa?",
          answer:
            "You can apply for a visa through our website by selecting the country, entering traveler details, and following the visa instructions.",
        },
        {
          id: "visas-2",
          question: "What documents are required for a visa?",
          answer:
            "A valid passport for at least 6 months, personal photos, visa application form, and sometimes flight and hotel bookings.",
        },
        {
          id: "visas-3",
          question: "Do you provide urgent visas?",
          answer:
            "Yes, some countries offer urgent visa services according to embassy regulations.",
        },
        {
          id: "visas-4",
          question: "How long does visa processing take?",
          answer:
            "Visa processing time varies depending on the country and type of visa, usually from a few days to a few weeks.",
        },
        {
          id: "visas-5",
          question: "Can I apply for a visa on behalf of someone else?",
          answer:
            "Yes, as long as you enter the traveler's correct details and provide the required documents.",
        },
        {
          id: "visas-6",
          question: "Can a visa be extended after arrival?",
          answer:
            "It depends on the laws of the issuing country. You should check with the relevant authorities before traveling.",
        },
        {
          id: "visas-7",
          question: "What types of visas are available?",
          answer: "They include tourist, business, and family visas.",
        },
        {
          id: "visas-8",
          question: "Can a visa be denied?",
          answer:
            "Yes, visa approval or denial is at the discretion of the embassy or consulate. Applicants are usually informed of the reasons.",
        },
        {
          id: "visas-9",
          question: "Are there fees for obtaining a visa?",
          answer:
            "Yes, fees vary depending on the visa type and country, and are usually paid upon application or issuance.",
        },
        {
          id: "visas-10",
          question: "How can I track my visa application status?",
          answer:
            "You can track your application status on the website using the application number or by contacting customer support.",
        },
        {
          id: "visas-11",
          question: "Do I need a visa to travel to certain countries?",
          answer:
            "It depends on your nationality and destination country; some countries allow visa-free entry or visa-on-arrival.",
        },
        {
          id: "visas-12",
          question: "Can I apply for a group visa?",
          answer:
            "Yes, some countries provide group visa services for groups or companies according to their regulations.",
        },
      ],
    },
    {
      id: "meet-assist",
      name: "Meet and Assist",
      icon: "icon-help",
      questions: [
        {
          id: "meet-1",
          question: "How can I book the service?",
          answer:
            "Book via the website by specifying arrival time and flight number.",
        },
        {
          id: "meet-2",
          question: "Is the service suitable for children and elderly passengers?",
          answer:
            "Yes, it's ideal for anyone needing extra assistance.",
        },
        {
          id: "meet-3",
          question: "Are there any special offers or discounts on flights?",
          answer:
            "Yes, we offer seasonal promotions and discounts on both domestic and international flights. Visit our website regularly or subscribe to our newsletter to stay updated on the latest deals.",
        },
        {
          id: "meet-4",
          question: "How can I get the best fares when booking?",
          answer:
            "We recommend booking early and comparing flights across different dates. You can also take advantage of exclusive online deals available on our website.",
        },
        {
          id: "meet-5",
          question: "Are there discounts for children or students?",
          answer:
            "Some airlines offer special discounts for children and students. You can check this option during the booking process or contact our customer support team for more information.",
        },
        {
          id: "meet-6",
          question: "Can I use a promo code during the booking process?",
          answer:
            'Yes, if you have a valid promo code, you can enter it in the "Promo Code" field before completing the payment to apply the discount instantly.',
        },
        {
          id: "meet-7",
          question: "Can I combine more than one offer or discount?",
          answer:
            "In most cases, you cannot combine multiple promotions in a single booking unless stated otherwise in the offer's terms and conditions.",
        },
      ],
    },
    {
      id: "land-transport",
      name: "Land Transportation",
      icon: "icon-bus",
      questions: [
        {
          id: "land-1",
          question: "What land trips are available?",
          answer:
            "We offer land trips to Nuweiba, Aqaba, Jordan, and Saudi Arabia, with multiple vehicle options and passenger capacities.",
        },
        {
          id: "land-2",
          question: "Can land trips be combined with tourism or hotel packages?",
          answer:
            "Yes, bookings can be combined with tourism packages or hotel reservations for convenience.",
        },
        {
          id: "land-3",
          question: "Can I book a trip ticket (TripTik)?",
          answer:
            "Yes, we provide TripTik ticket booking for land trips to Jordan and Saudi Arabia via Nuweiba and Aqaba.",
        },
      ],
    },
    {
      id: "internal-transport",
      name: "Internal Transportation",
      icon: "icon-car",
      questions: [
        {
          id: "internal-1",
          question: "What types of vehicles are available for internal transportation?",
          answer:
            "Our company provides minibuses, Hiace vans, and buses to suit all individual and group travel needs.",
        },
        {
          id: "internal-2",
          question: "Can I book transportation in advance?",
          answer:
            "Yes, transportation can be booked in advance through the website or customer support to confirm the reservation.",
        },
        {
          id: "internal-3",
          question: "Does transportation cover short intercity trips or governorates?",
          answer:
            "Yes, internal transportation covers trips between nearby cities and governorates upon passenger request.",
        },
        {
          id: "internal-4",
          question: "Can I choose the vehicle type based on the number of passengers?",
          answer:
            "Yes, you can choose a minibus for small groups, a Hiace van for medium groups, or a bus for large groups.",
        },
        {
          id: "internal-5",
          question: "Are all drivers professional?",
          answer:
            "Yes, all drivers are licensed and have extensive experience in safe and comfortable transportation.",
        },
        {
          id: "internal-6",
          question: "Can internal transportation be combined with tourism or hotel packages?",
          answer:
            "Yes, internal transportation can be combined with tourism and hotel packages to facilitate travel and mobility.",
        },
      ],
    },
  ],
  ar: [
    {
      id: "aviation",
      name: "قسم الطيران",
      icon: "icon-plane",
      questions: [
        {
          id: "aviation-1",
          question: "1. كيف يمكنني حجز تذكرة طيران عبر الموقع؟",
          answer:
            'يمكنك الحجز بسهولة عن طريق إدخال وجهة السفر، وتاريخ المغادرة والعودة، وعدد المسافرين، ثم الضغط على زر "بحث عن الرحلات". بعد ذلك اختر الرحلة المناسبة وأكمل الدفع لتأكيد الحجز.',
        },
        {
          id: "aviation-2",
          question: "2. هل أحتاج إلى إنشاء حساب لإتمام الحجز؟",
          answer:
            "ليس بالضرورة، يمكنك الحجز كضيف. لكن إنشاء حساب يساعدك على إدارة الحجوزات بسهولة والحصول على عروض خاصة.",
        },
        {
          id: "aviation-3",
          question: "3. ما هي طرق الدفع المتاحة؟",
          answer:
            "نقبل بطاقات الائتمان (Visa، MasterCard)، المحافظ الإلكترونية، والتحويل البنكي.",
        },
        {
          id: "aviation-4",
          question: "4. كيف أتأكد أن الحجز تم بنجاح؟",
          answer:
            "بعد إتمام الدفع، ستصلك رسالة تأكيد عبر البريد الإلكتروني تحتوي على تفاصيل الرحلة ورقم الحجز.",
        },
        {
          id: "aviation-5",
          question: "5. هل يمكنني تعديل أو إلغاء الحجز بعد تأكيده؟",
          answer:
            'نعم، يمكنك تعديل أو إلغاء الحجز من خلال صفحة "إدارة الحجز". قد يتم تطبيق رسوم حسب سياسة شركة الطيران.',
        },
        {
          id: "aviation-6",
          question: "6. لم أستلم رسالة تأكيد الحجز، ماذا أفعل؟",
          answer:
            "تحقق أولاً من مجلد البريد غير المرغوب فيه (Spam). إذا لم تجد الرسالة، يُرجى التواصل مع خدمة العملاء.",
        },
        {
          id: "aviation-7",
          question: "7. هل الأسعار تشمل الضرائب والرسوم؟",
          answer:
            "نعم، جميع الأسعار المعروضة تشمل الضرائب والرسوم الأساسية ما لم يُذكر غير ذلك.",
        },
        {
          id: "aviation-8",
          question: "8. هل يمكنني حجز رحلة متعددة الوجهات؟",
          answer:
            "نعم، يمكنك اختيار نوع الرحلة (ذهاب فقط - ذهاب وعودة - وجهات متعددة) من صفحة البحث.",
        },
        {
          id: "aviation-9",
          question: "9. كيف يمكنني اختيار المقعد أو إضافة أمتعة إضافية؟",
          answer:
            'يمكنك ذلك بعد تأكيد الحجز من خلال صفحة "إدارة الحجز" أو أثناء تسجيل الوصول الإلكتروني.',
        },
        {
          id: "aviation-10",
          question: "10. هل يمكنني حجز تذكرة لشخص آخر؟",
          answer:
            "نعم، يمكنك حجز تذكرة لأي شخص بشرط إدخال بياناته الشخصية كما هي في جواز السفر.",
        },
      ],
    },
    {
      id: "hajj-umrah",
      name: "قسم الحج والعمرة",
      icon: "icon-mosque",
      questions: [
        {
          id: "hajj-1",
          question: "1. كيف أحجز رحلة حج أو عمرة؟",
          answer:
            "يمكنك الحجز عن طريق اختيار البرنامج المناسب على موقعنا، ثم إدخال بيانات المسافر وإتمام الدفع لتأكيد الحجز.",
        },
        {
          id: "hajj-2",
          question: "2. ما المستندات المطلوبة للحجز؟",
          answer:
            "جواز سفر صالح لمدة لا تقل عن 6 أشهر، صور شخصية، وحجز الطيران والفنادق.",
        },
        {
          id: "hajj-3",
          question: "3. هل البرنامج يشمل الإقامة والنقل؟",
          answer:
            "نعم، برامجنا غالبًا تشمل الإقامة في مكة والمدينة والتنقلات بين الأماكن المقدسة، مع بعض الخدمات الإضافية حسب البرنامج.",
        },
        {
          id: "hajj-4",
          question: "4. هل أحتاج لتأشيرة خاصة؟",
          answer:
            "نعم، رحلات الحج والعمرة تتطلب تأشيرة رسمية تصدرها المملكة العربية السعودية.",
        },
        {
          id: "hajj-5",
          question: "5. هل يمكن تعديل أو إلغاء الحجز؟",
          answer:
            "يمكن تعديل أو إلغاء الحجز حسب شروط البرنامج، وقد تُطبق رسوم إضافية إذا تم الإلغاء بعد فترة محددة.",
        },
        {
          id: "hajj-6",
          question: "6. هل هناك مرشدين سياحيين أو مشرفين خلال الرحلة؟",
          answer:
            "نعم، كل برامج الحج والعمرة تشمل مرشدين ومشرفين لتسهيل أداء المناسك والإجابة على الاستفسارات.",
        },
        {
          id: "hajj-7",
          question: "7. هل يشمل البرنامج وجبات الطعام؟",
          answer:
            "يعتمد ذلك على البرنامج المختار، بعض البرامج تشمل الوجبات اليومية وبعضها لا.",
        },
        {
          id: "hajj-8",
          question: "8. هل يمكن حجز رحلة جماعية؟",
          answer:
            "نعم، نوفر برامج جماعية خاصة للمجموعات والعائلات مع تسهيلات للحجز الجماعي.",
        },
        {
          id: "hajj-9",
          question: "9. ما هي النصائح الصحية أثناء أداء المناسك؟",
          answer:
            "شرب الماء باستمرار، ارتداء ملابس مريحة، وتجنب الازدحام قدر الإمكان، واتباع تعليمات المشرفين.",
        },
        {
          id: "hajj-10",
          question: "10. كيف أستلم التأشيرة بعد الحجز؟",
          answer:
            "بعد إتمام الحجز، سيتم التواصل معك لإرسال التأشيرة إلكترونيًا أو تسليمها حسب الإجراءات الرسمية للسفارة.",
        },
      ],
    },
    {
      id: "hotels",
      name: "قسم الفنادق",
      icon: "icon-bed",
      questions: [
        {
          id: "hotels-1",
          question: "1. كيف يمكنني حجز فندق عبر الموقع؟",
          answer:
            'يمكنك الحجز بسهولة عن طريق إدخال اسم المدينة أو الفندق، وتواريخ الوصول والمغادرة، وعدد النزلاء، ثم الضغط على "بحث". بعد ذلك اختر الفندق والغرفة المناسبة وأكمل عملية الدفع لتأكيد الحجز.',
        },
        {
          id: "hotels-2",
          question: "2. هل تشمل الأسعار الضرائب والرسوم السياحية؟",
          answer:
            "تتضمن معظم الأسعار الضرائب والرسوم، لكن في بعض الوجهات قد تُضاف رسوم سياحية أو خدمية عند تسجيل الوصول.",
        },
        {
          id: "hotels-3",
          question: "3. هل يمكنني تعديل أو إلغاء حجز الفندق بعد تأكيده؟",
          answer:
            'نعم، يمكنك ذلك من خلال صفحة "إدارة الحجز". قد تختلف سياسة الإلغاء حسب الفندق ونوع الغرفة.',
        },
        {
          id: "hotels-4",
          question: "4. هل يمكنني الدفع عند الوصول إلى الفندق؟",
          answer:
            "بعض الفنادق تتيح الدفع عند الوصول، بينما تتطلب أخرى الدفع المسبق لتأكيد الحجز.",
        },
        {
          id: "hotels-5",
          question: "5. هل الإفطار مشمول في سعر الغرفة؟",
          answer:
            "يعتمد ذلك على نوع الغرفة والخطة التي تختارها (إقامة فقط، إقامة مع إفطار، نصف إقامة...).",
        },
        {
          id: "hotels-6",
          question: "6. كيف يمكنني معرفة موقع الفندق بالتحديد؟",
          answer:
            "يمكنك الاطلاع على موقع الفندق على الخريطة في صفحة تفاصيل الحجز، مع المسافة من المعالم السياحية والمطار.",
        },
        {
          id: "hotels-7",
          question: "7. هل يمكنني حجز أكثر من غرفة في نفس الوقت؟",
          answer:
            "نعم، يمكنك اختيار عدد الغرف المطلوبة أثناء عملية البحث أو الحجز.",
        },
        {
          id: "hotels-8",
          question: "8. هل يمكنني حجز فندق لشخص آخر؟",
          answer:
            "نعم، بشرط إدخال اسم النزيل كما هو في بطاقة الهوية أو جواز السفر.",
        },
        {
          id: "hotels-9",
          question: "9. ماذا أفعل إذا واجهت مشكلة عند تسجيل الوصول؟",
          answer:
            "يرجى التواصل فورًا مع فريق خدمة العملاء أو مكتب الاستقبال بالفندق، وسنساعدك في حل المشكلة في أسرع وقت.",
        },
        {
          id: "hotels-10",
          question: "10. هل يمكنني طلب سرير إضافي أو تجهيزات خاصة؟",
          answer:
            "نعم، يمكنك طلب سرير إضافي أو تجهيزات خاصة مثل سرير أطفال أو غرفة لذوي الاحتياجات الخاصة أثناء الحجز أو بالتواصل مع الفندق مباشرة.",
        },
        {
          id: "hotels-11",
          question: "11. هل يمكنني تسجيل الوصول المبكر أو المغادرة المتأخرة؟",
          answer:
            "ذلك يعتمد على سياسة الفندق وتوفر الغرف. قد يتم فرض رسوم إضافية في بعض الحالات.",
        },
        {
          id: "hotels-12",
          question: "12. هل يوجد واي فاي مجاني في الفندق؟",
          answer:
            "توفر معظم الفنادق خدمة الواي فاي المجانية، لكن بعض الفنادق تفرض رسومًا إضافية على الإنترنت السريع أو في بعض المناطق.",
        },
        {
          id: "hotels-13",
          question: "13. هل يمكنني الحجز بدون بطاقة ائتمان؟",
          answer:
            "بعض الفنادق تسمح بالحجز بدون بطاقة ائتمان، لكن معظمها يتطلب بطاقة صالحة لضمان الحجز.",
        },
        {
          id: "hotels-14",
          question: "14. ماذا يحدث إذا لم أصل إلى الفندق (عدم الحضور)؟",
          answer:
            'إذا لم تقم بإلغاء الحجز مسبقًا ولم تصل إلى الفندق، فقد يتم تطبيق رسوم "عدم الحضور" وفقًا لسياسة الفندق.',
        },
        {
          id: "hotels-15",
          question: "15. هل الفنادق آمنة ومناسبة للعائلات؟",
          answer:
            "نعم، نعمل فقط مع فنادق معتمدة وآمنة، وتتوفر خيارات مناسبة للعائلات والأطفال في أغلب الوجهات.",
        },
        {
          id: "hotels-16",
          question: "16. هل يمكنني رؤية صور الفندق والغرف قبل الحجز؟",
          answer:
            "نعم، نوفر صورًا عالية الجودة للفندق والغرف والمرافق حتى تتمكن من معرفة التفاصيل قبل الحجز.",
        },
        {
          id: "hotels-17",
          question: "17. هل يشمل السعر المواصلات من وإلى المطار؟",
          answer:
            "بعض الفنادق تقدم خدمة النقل من وإلى المطار مجانًا أو مقابل رسوم إضافية. يمكنك التأكد من ذلك في تفاصيل الفندق.",
        },
        {
          id: "hotels-18",
          question: "18. هل يمكنني حجز إقامة طويلة؟",
          answer:
            "نعم، يمكنك حجز إقامة طويلة المدة، وغالبًا ما تقدم الفنادق أسعارًا خاصة للإقامات الطويلة.",
        },
      ],
    },
    {
      id: "visas",
      name: "قسم التأشيرات",
      icon: "icon-passport",
      questions: [
        {
          id: "visas-1",
          question: "1. كيف أستخرج تأشيرة سفر؟",
          answer:
            "يمكنك تقديم طلب التأشيرة عن طريق الموقع باختيار الدولة، إدخال بيانات المسافر، واتباع التعليمات الخاصة بالتأشيرة.",
        },
        {
          id: "visas-2",
          question: "2. ما المستندات المطلوبة للحصول على التأشيرة؟",
          answer:
            "جواز سفر صالح لمدة لا تقل عن 6 أشهر، صور شخصية، تعبئة استمارة التأشيرة، وأحيانًا حجز الطيران والفندق.",
        },
        {
          id: "visas-3",
          question: "3. هل توفرون تأشيرات عاجلة؟",
          answer:
            "نعم، بعض الدول تقدم خدمة التأشيرة العاجلة حسب شروط السفارة.",
        },
        {
          id: "visas-4",
          question: "4. كم تستغرق معالجة التأشيرة؟",
          answer:
            "مدة معالجة التأشيرة تختلف حسب الدولة ونوع التأشيرة، عادة من عدة أيام إلى عدة أسابيع.",
        },
        {
          id: "visas-5",
          question: "5. هل يمكن تقديم طلب التأشيرة لشخص آخر؟",
          answer:
            "نعم، بشرط إدخال بيانات المسافر الصحيحة وتوفير المستندات المطلوبة.",
        },
        {
          id: "visas-6",
          question: "6. هل يمكن تمديد التأشيرة بعد الوصول؟",
          answer:
            "يعتمد ذلك على قوانين الدولة المصدرة للتأشيرة، ويجب مراجعة السلطات المختصة قبل السفر.",
        },
        {
          id: "visas-7",
          question: "7. ما هي أنواع التأشيرات المتاحة؟",
          answer: "تتضمن التأشيرات السياحية، التجارية، والعائلية.",
        },
        {
          id: "visas-8",
          question: "8. هل يمكن رفض التأشيرة؟",
          answer:
            "نعم، قرار منح أو رفض التأشيرة يعود للسفارة أو القنصلية، وغالبًا يتم إعلام المتقدم بالأسباب.",
        },
        {
          id: "visas-9",
          question: "9. هل هناك رسوم للحصول على التأشيرة؟",
          answer:
            "نعم، تختلف الرسوم حسب نوع التأشيرة والدولة، وتُدفع عادة عند تقديم الطلب أو عند الاستلام.",
        },
        {
          id: "visas-10",
          question: "10. كيف أتابع حالة طلب التأشيرة؟",
          answer:
            "يمكنك متابعة حالة طلبك عبر الموقع باستخدام رقم الطلب أو التواصل مع خدمة العملاء.",
        },
        {
          id: "visas-11",
          question: "11. هل أحتاج لتأشيرة عند السفر لبعض الدول؟",
          answer:
            "يعتمد ذلك على جنسيتك والدولة التي تسافر إليها، بعض الدول تمنح دخولاً بدون تأشيرة أو عند الوصول.",
        },
        {
          id: "visas-12",
          question: "12. هل يمكن تقديم طلب تأشيرة جماعية؟",
          answer:
            "نعم، بعض الدول تقدم خدمات التأشيرات الجماعية للمجموعات أو الشركات حسب الشروط.",
        },
      ],
    },
    {
      id: "meet-assist",
      name: "خدمة Meet & Assist",
      icon: "icon-help",
      questions: [
        {
          id: "meet-1",
          question: "1. كيف يمكن حجز الخدمة؟",
          answer: "الحجز عبر الموقع مع تحديد موعد الوصول ورقم الرحلة.",
        },
        {
          id: "meet-2",
          question: "2. هل الخدمة مناسبة للأطفال وكبار السن؟",
          answer: "نعم، مثالية لكل من يحتاج مساعدة إضافية.",
        },
        {
          id: "meet-3",
          question: "3. هل توجد عروض أو خصومات على الرحلات الجوية؟",
          answer:
            "نعم، نقدم عروضًا وخصومات موسمية على الرحلات المحلية والدولية. تابع موقعنا بانتظام أو اشترك في النشرة البريدية لتصلك أحدث العروض.",
        },
        {
          id: "meet-4",
          question: "4. كيف يمكنني الحصول على أفضل الأسعار عند الحجز؟",
          answer:
            "ننصحك بالحجز المبكر ومقارنة الرحلات في تواريخ مختلفة، كما يمكنك الاستفادة من العروض الحصرية المتاحة عبر موقعنا الإلكتروني.",
        },
        {
          id: "meet-5",
          question: "5. هل هناك خصومات للأطفال أو الطلاب؟",
          answer:
            "بعض شركات الطيران تقدم خصومات خاصة للأطفال والطلاب. يمكنك التحقق من ذلك أثناء عملية الحجز أو التواصل مع خدمة العملاء.",
        },
        {
          id: "meet-6",
          question: "6. هل يمكنني استخدام كود خصم أثناء الحجز؟",
          answer:
            'نعم، إذا كان لديك كود خصم صالح، يمكنك إدخاله في خانة "كود الخصم" قبل إتمام الدفع لتطبيق التخفيض مباشرة.',
        },
        {
          id: "meet-7",
          question: "7. هل يمكن الجمع بين أكثر من عرض أو خصم؟",
          answer:
            "عادةً لا يمكن الجمع بين أكثر من عرض ترويجي في نفس الحجز، إلا إذا تم ذكر ذلك صراحة في شروط العرض.",
        },
      ],
    },
    {
      id: "land-transport",
      name: "قسم النقل البري",
      icon: "icon-bus",
      questions: [
        {
          id: "land-1",
          question: "1. ما هي الرحلات البرية المتاحة؟",
          answer:
            "نقدم رحلات برية إلى النويبع، العقبة، الأردن، والسعودية مع خيارات متعددة للمركبات وعدد الركاب.",
        },
        {
          id: "land-2",
          question: "2. هل يمكن دمج الرحلات البرية مع باقات سياحية أو حجز فنادق؟",
          answer:
            "نعم، يمكن دمج الحجز مع باقات سياحية أو حجز الفنادق لتسهيل الرحلة.",
        },
        {
          id: "land-3",
          question: "3. هل يمكن حجز تذاكر تربتك؟",
          answer:
            "نعم، نوفر خدمة حجز تذاكر تربتك للرحلات البرية إلى الأردن والسعودية عبر نويبع والعقبة.",
        },
      ],
    },
    {
      id: "internal-transport",
      name: "قسم النقل",
      icon: "icon-car",
      questions: [
        {
          id: "internal-1",
          question: "1. ما أنواع المركبات المتاحة للنقل الداخلي؟",
          answer:
            "توفر شركتنا ميكروباصات، هاي إيس، وأتوبيسات لتناسب جميع احتياجات السفر الفردية والجماعية.",
        },
        {
          id: "internal-2",
          question: "2. هل يمكن حجز النقل مسبقًا؟",
          answer:
            "نعم، يمكن حجز النقل مسبقًا عبر الموقع الإلكتروني أو خدمة العملاء لتأكيد الحجز.",
        },
        {
          id: "internal-3",
          question: "3. هل النقل يشمل الانتقال بين المدن القريبة أو المحافظات؟",
          answer:
            "نعم، النقل الداخلي يشمل الرحلات بين المدن القريبة والمحافظات حسب طلب المسافر.",
        },
        {
          id: "internal-4",
          question: "4. هل يمكن اختيار نوع المركبة حسب عدد الركاب؟",
          answer:
            "نعم، يمكنك اختيار الميكروباص للمجموعات الصغيرة، هاي إيس للرحلات المتوسطة، أو الأتوبيس للمجموعات الكبيرة.",
        },
        {
          id: "internal-5",
          question: "5. هل جميع السائقين محترفون؟",
          answer:
            "نعم، جميع السائقين حاصلون على تراخيص رسمية ولديهم خبرة طويلة في النقل الآمن والمريح.",
        },
        {
          id: "internal-6",
          question: "6. هل يمكن دمج النقل الداخلي مع برامج السياحة أو الفنادق؟",
          answer:
            "نعم، يمكن دمج حجز النقل مع برامج السياحة والفنادق لتسهيل السفر والتنقل.",
        },
      ],
    },
  ],
};

/**
 * Get FAQ data by language
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Array} FAQ categories for the specified language
 */
export function getFaqData(language = "en") {
  return faqCategories[language] || faqCategories.en;
}

/**
 * Get a specific category by ID
 * @param {string} categoryId - Category ID
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Object|null} Category object or null
 */
export function getCategoryById(categoryId, language = "en") {
  const categories = getFaqData(language);
  return categories.find((cat) => cat.id === categoryId) || null;
}
