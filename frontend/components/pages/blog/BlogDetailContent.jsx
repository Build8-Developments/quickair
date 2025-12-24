"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blogData";

// Fallback full content for blog posts
const blogFullContent = {
  1: {
    contentEn: `
      <p>As we step into 2025, the world of travel continues to evolve, offering new and exciting destinations for adventurous souls. Whether you're seeking pristine beaches, cultural immersion, or thrilling adventures, this year promises unforgettable experiences.</p>
      
      <h2>1. Kyoto, Japan</h2>
      <p>Experience the perfect blend of ancient traditions and modern innovation. From serene temples to cherry blossom gardens, Kyoto offers a journey through time that captivates every visitor.</p>
      
      <h2>2. Santorini, Greece</h2>
      <p>The iconic white-washed buildings against the deep blue Aegean Sea make Santorini a photographer's paradise. Enjoy world-class sunsets, delicious Mediterranean cuisine, and rich history.</p>
      
      <h2>3. Marrakech, Morocco</h2>
      <p>Lose yourself in the vibrant souks, stunning palaces, and aromatic gardens. Marrakech is a sensory feast that combines African, Arab, and European influences.</p>
      
      <h2>4. Queenstown, New Zealand</h2>
      <p>For adventure seekers, Queenstown is the ultimate destination. From bungee jumping to skiing, this stunning location offers year-round thrills against breathtaking mountain backdrops.</p>
      
      <h2>5. Lisbon, Portugal</h2>
      <p>Europe's sunniest capital combines historic charm with a modern, creative spirit. Explore colorful neighborhoods, taste authentic pastéis de nata, and ride the iconic yellow trams.</p>
      
      <h2>Planning Your Trip</h2>
      <p>When planning your 2025 adventures, consider booking early for the best deals and availability. Research local customs, pack appropriately, and always have travel insurance for peace of mind.</p>
    `,
    contentAr: `
      <p>مع دخولنا عام 2025، يستمر عالم السفر في التطور، مقدماً وجهات جديدة ومثيرة للأرواح المغامرة. سواء كنت تبحث عن شواطئ نقية، أو انغماس ثقافي، أو مغامرات مثيرة، فإن هذا العام يعد بتجارب لا تُنسى.</p>
      
      <h2>1. كيوتو، اليابان</h2>
      <p>اختبر المزيج المثالي بين التقاليد القديمة والابتكار الحديث. من المعابد الهادئة إلى حدائق أزهار الكرز، تقدم كيوتو رحلة عبر الزمن تأسر كل زائر.</p>
      
      <h2>2. سانتوريني، اليونان</h2>
      <p>المباني البيضاء الأيقونية على خلفية بحر إيجة الأزرق العميق تجعل سانتوريني جنة المصورين. استمتع بغروب الشمس الرائع والمأكولات المتوسطية اللذيذة والتاريخ الغني.</p>
      
      <h2>3. مراكش، المغرب</h2>
      <p>اضع نفسك في الأسواق النابضة بالحياة والقصور المذهلة والحدائق العطرية. مراكش هي وليمة حسية تجمع بين التأثيرات الأفريقية والعربية والأوروبية.</p>
      
      <h2>4. كوينزتاون، نيوزيلندا</h2>
      <p>لعشاق المغامرة، كوينزتاون هي الوجهة المثالية. من القفز بالحبال إلى التزلج، يقدم هذا الموقع المذهل إثارة على مدار العام على خلفية جبال خلابة.</p>
      
      <h2>5. لشبونة، البرتغال</h2>
      <p>أكثر عواصم أوروبا مشمسة تجمع بين السحر التاريخي والروح الإبداعية الحديثة. استكشف الأحياء الملونة، وتذوق الباستيش دي ناتا الأصلية، واركب الترام الأصفر الأيقوني.</p>
      
      <h2>التخطيط لرحلتك</h2>
      <p>عند التخطيط لمغامرات 2025، فكر في الحجز مبكراً للحصول على أفضل العروض والتوافر. ابحث عن العادات المحلية، واحزم أمتعتك بشكل مناسب، واحصل دائماً على تأمين السفر لراحة البال.</p>
    `,
  },
  2: {
    contentEn: `
      <p>Preparing for Hajj requires careful planning and thoughtful packing. This sacred journey demands both spiritual readiness and practical preparation to ensure a smooth and meaningful experience.</p>
      
      <h2>Essential Documents</h2>
      <p>Before anything else, ensure you have your passport (valid for at least 6 months), Hajj visa, vaccination certificates, and copies of all important documents stored separately.</p>
      
      <h2>Ihram Clothing</h2>
      <p>For men, pack at least two sets of Ihram garments - the two white unstitched cloths. Women should bring modest, loose-fitting clothing that covers the body appropriately.</p>
      
      <h2>Comfort Items</h2>
      <p>Comfortable walking shoes are essential as you'll be walking long distances. Pack a small prayer rug, sunscreen, an umbrella for shade, and a money belt for security.</p>
      
      <h2>Health Essentials</h2>
      <p>Bring any prescription medications with documentation, basic first aid supplies, hand sanitizer, and face masks. Stay hydrated with a reusable water bottle.</p>
      
      <h2>Spiritual Preparation</h2>
      <p>Pack a small Quran, prayer beads, and a dua book. Most importantly, prepare your heart and mind for this transformative spiritual journey.</p>
    `,
    contentAr: `
      <p>يتطلب التحضير للحج تخطيطاً دقيقاً وتعبئة مدروسة. تتطلب هذه الرحلة المقدسة استعداداً روحياً وعملياً لضمان تجربة سلسة وذات معنى.</p>
      
      <h2>الوثائق الأساسية</h2>
      <p>قبل أي شيء آخر، تأكد من أن لديك جواز سفرك (صالح لمدة 6 أشهر على الأقل)، وتأشيرة الحج، وشهادات التطعيم، ونسخ من جميع الوثائق المهمة مخزنة بشكل منفصل.</p>
      
      <h2>ملابس الإحرام</h2>
      <p>للرجال، احزم مجموعتين على الأقل من ملابس الإحرام - القطعتين البيضاء غير المخيطة. يجب على النساء إحضار ملابس محتشمة وفضفاضة تغطي الجسم بشكل مناسب.</p>
      
      <h2>عناصر الراحة</h2>
      <p>الأحذية المريحة للمشي ضرورية لأنك ستمشي مسافات طويلة. احزم سجادة صلاة صغيرة، وواقي شمس، ومظلة للظل، وحزام نقود للأمان.</p>
      
      <h2>الأساسيات الصحية</h2>
      <p>أحضر أي أدوية موصوفة مع الوثائق، ومستلزمات الإسعافات الأولية الأساسية، ومعقم اليدين، والكمامات. حافظ على رطوبتك بزجاجة مياه قابلة لإعادة الاستخدام.</p>
      
      <h2>الاستعداد الروحي</h2>
      <p>احزم مصحفاً صغيراً، ومسبحة، وكتاب أدعية. والأهم من ذلك، جهز قلبك وعقلك لهذه الرحلة الروحية التحويلية.</p>
    `,
  },
};

// Default fallback content
const defaultContent = {
  contentEn: `
    <p>This is a comprehensive guide that will help you make the most of your travel experience. Our team of experts has compiled valuable insights and practical tips to ensure your journey is memorable and hassle-free.</p>
    
    <h2>Getting Started</h2>
    <p>Planning is the key to any successful trip. Start by researching your destination, understanding local customs, and creating a flexible itinerary that allows for spontaneous discoveries.</p>
    
    <h2>What to Expect</h2>
    <p>Every destination has its unique charm and challenges. Being prepared mentally and physically will help you embrace new experiences with an open mind and heart.</p>
    
    <h2>Pro Tips</h2>
    <p>Travel light, stay curious, and always have backup plans. The best memories often come from unexpected moments, so leave room for adventure in your schedule.</p>
    
    <h2>Final Thoughts</h2>
    <p>Travel enriches our lives in countless ways. Whether you're exploring new cultures, trying exotic cuisines, or simply relaxing on a beach, every journey adds to your life story.</p>
  `,
  contentAr: `
    <p>هذا دليل شامل سيساعدك على تحقيق أقصى استفادة من تجربة سفرك. قام فريق خبرائنا بتجميع رؤى قيمة ونصائح عملية لضمان أن تكون رحلتك لا تُنسى وخالية من المتاعب.</p>
    
    <h2>البداية</h2>
    <p>التخطيط هو مفتاح أي رحلة ناجحة. ابدأ بالبحث عن وجهتك، وفهم العادات المحلية، وإنشاء جدول زمني مرن يسمح بالاكتشافات العفوية.</p>
    
    <h2>ما يمكن توقعه</h2>
    <p>كل وجهة لها سحرها وتحدياتها الفريدة. الاستعداد الذهني والجسدي سيساعدك على احتضان التجارب الجديدة بعقل وقلب منفتحين.</p>
    
    <h2>نصائح احترافية</h2>
    <p>سافر خفيفاً، وابق فضولياً، ولديك دائماً خطط بديلة. أفضل الذكريات غالباً ما تأتي من اللحظات غير المتوقعة، لذا اترك مجالاً للمغامرة في جدولك.</p>
    
    <h2>أفكار ختامية</h2>
    <p>السفر يثري حياتنا بطرق لا تحصى. سواء كنت تستكشف ثقافات جديدة، أو تجرب مأكولات غريبة، أو ببساطة تسترخي على الشاطئ، كل رحلة تضيف إلى قصة حياتك.</p>
  `,
};

export default function BlogDetailContent({ post, locale }) {
  const isRTL = locale === "ar";
  const content = blogFullContent[post.id] || defaultContent;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      {/* Featured Image - Full Width */}
      <section style={{ paddingTop: "140px", paddingBottom: "50px" }}>
        <div className="container">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "500px",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Image
              src={post.image}
              alt={isRTL ? post.titleAr : post.titleEn}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            {/* Gradient Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Article Header */}
      <section style={{ paddingBottom: "40px" }}>
        <div className="container">
          <div className="row justify-center">
            <div className="col-lg-8" style={{ textAlign: isRTL ? "right" : "left" }}>
              {/* Breadcrumb */}
              <nav
                style={{
                  marginBottom: "25px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px",
                  justifyContent: isRTL ? "flex-end" : "flex-start",
                }}
              >
                {isRTL ? (
                  <>
                    <span style={{ color: "var(--color-light-2)" }}>
                      {post.categoryAr}
                    </span>
                    <span style={{ color: "var(--color-light-2)" }}>/</span>
                    <Link
                      href={`/${locale}/blog`}
                      style={{
                        color: "var(--color-accent-1)",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                    >
                      المدونة
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/${locale}/blog`}
                      style={{
                        color: "var(--color-accent-1)",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                    >
                      Blog
                    </Link>
                    <span style={{ color: "var(--color-light-2)" }}>/</span>
                    <span style={{ color: "var(--color-light-2)" }}>
                      {post.categoryEn}
                    </span>
                  </>
                )}
              </nav>

              {/* Category Badge */}
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "var(--color-accent-1)",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {isRTL ? post.categoryAr : post.categoryEn}
              </span>

              {/* Title */}
              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: "700",
                  color: "var(--color-dark-1)",
                  lineHeight: "1.3",
                  marginBottom: "25px",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {isRTL ? post.titleAr : post.titleEn}
              </h1>

              {/* Meta Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  paddingBottom: "30px",
                  borderBottom: "1px solid #eee",
                  flexWrap: "wrap",
                  justifyContent: isRTL ? "flex-end" : "flex-start",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-light-2)" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span style={{ fontSize: "14px", color: "var(--color-light-2)" }}>
                    {formatDate(post.date)}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-light-2)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span style={{ fontSize: "14px", color: "var(--color-light-2)" }}>
                    {isRTL ? post.readTimeAr : post.readTimeEn}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section style={{ paddingBottom: "60px" }}>
        <div className="container">
          <div className="row justify-center">
            <div className="col-lg-8">
              <article
                className="blog-article-content"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  direction: isRTL ? "rtl" : "ltr",
                }}
                dangerouslySetInnerHTML={{
                  __html: isRTL ? content.contentAr : content.contentEn,
                }}
              />

              {/* Share Section */}
              <div
                style={{
                  marginTop: "50px",
                  paddingTop: "30px",
                  borderTop: "1px solid #eee",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "var(--color-dark-1)",
                    marginBottom: "15px",
                  }}
                >
                  {isRTL ? "شارك هذا المقال" : "Share this article"}
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["facebook", "twitter", "linkedin"].map((social) => (
                    <button
                      key={social}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        border: "1px solid #e0e0e0",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-accent-1)";
                        e.currentTarget.style.borderColor = "var(--color-accent-1)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff";
                        e.currentTarget.style.borderColor = "#e0e0e0";
                        e.currentTarget.style.color = "inherit";
                      }}
                    >
                      <i className={`icon-${social} text-16`}></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section
          style={{
            paddingTop: "60px",
            paddingBottom: "60px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div className="container">
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "var(--color-dark-1)",
                textAlign: "center",
                marginBottom: "40px",
              }}
            >
              {isRTL ? "مقالات ذات صلة" : "Related Articles"}
            </h2>

            <div className="row y-gap-30">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="col-lg-4 col-md-6">
                  <Link href={`/${locale}/blog/${relatedPost.id}`} style={{ textDecoration: "none" }}>
                    <article
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        height: "100%",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.06)";
                      }}
                    >
                      <div style={{ position: "relative", width: "100%", height: "200px" }}>
                        <Image
                          src={relatedPost.image}
                          alt={isRTL ? relatedPost.titleAr : relatedPost.titleEn}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ padding: "24px", textAlign: isRTL ? "right" : "left" }}>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--color-accent-1)",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {isRTL ? relatedPost.categoryAr : relatedPost.categoryEn}
                        </span>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "var(--color-dark-1)",
                            lineHeight: "1.5",
                            marginTop: "10px",
                          }}
                        >
                          {isRTL ? relatedPost.titleAr : relatedPost.titleEn}
                        </h3>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <section style={{ paddingTop: "50px", paddingBottom: "80px" }}>
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <Link
              href={`/${locale}/blog`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 32px",
                backgroundColor: "var(--color-accent-1)",
                borderRadius: "10px",
                textDecoration: "none",
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ transform: isRTL ? "rotate(180deg)" : "none", display: "inline-block" }}>←</span>
              {isRTL ? "العودة إلى المدونة" : "Back to Blog"}
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .blog-article-content {
          font-size: 17px;
          line-height: 1.9;
          color: #444;
        }
        .blog-article-content h2 {
          font-size: 26px;
          font-weight: 700;
          margin-top: 45px;
          margin-bottom: 20px;
          color: var(--color-dark-1);
        }
        .blog-article-content p {
          margin-bottom: 24px;
          color: #555;
        }
        .blog-article-content ul,
        .blog-article-content ol {
          margin-bottom: 24px;
          padding-${isRTL ? "right" : "left"}: 30px;
        }
        .blog-article-content li {
          margin-bottom: 12px;
          color: #555;
        }
        .blog-article-content a {
          color: var(--color-accent-1);
          text-decoration: underline;
        }
        .blog-article-content blockquote {
          border-${isRTL ? "right" : "left"}: 4px solid var(--color-accent-1);
          padding: 20px 25px;
          margin: 30px 0;
          background: #f8f9fa;
          font-style: italic;
          color: #666;
        }
        @media (max-width: 768px) {
          .blog-article-content {
            font-size: 16px;
          }
          .blog-article-content h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}
