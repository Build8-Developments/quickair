"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { STRAPI_CONFIG } from "@/config/api";

export default function BlogDetailContent({ post, relatedPosts = [], locale }) {
  const isRTL = locale === "ar";
  const [readProgress, setReadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const articleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrolled = Math.max(0, -top);
      const total = height - window.innerHeight;
      setReadProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageUrl = (coverImage) => {
    const url = coverImage?.url || coverImage?.data?.attributes?.url;
    if (!url) return "/img/pageHeader/1.jpg";
    if (url.startsWith("http")) return url;
    return `${STRAPI_CONFIG.url}${url}`;
  };

  const estimateReadTime = (content) => {
    if (!content) return null;
    // blocks content is a JSON array — extract all text nodes for word count
    try {
      const blocks = Array.isArray(content) ? content : JSON.parse(content);
      const text = JSON.stringify(blocks);
      const words = text.replace(/"type":"[^"]+"/g, "").split(/\s+/).length;
      return Math.max(1, Math.round(words / 200));
    } catch {
      return null;
    }
  };

  const readTime = post.readTime || estimateReadTime(post.content);

  const handleShare = (platform) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = encodeURIComponent(post.title || "");
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${title}%20${encodeURIComponent(url)}`,
    };
    if (links[platform]) window.open(links[platform], "_blank", "noopener");
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isRTL ? "auto" : 0,
          right: isRTL ? 0 : "auto",
          height: "3px",
          width: `${readProgress}%`,
          background: "linear-gradient(90deg, var(--color-accent-1), #ff8c42)",
          zIndex: 9999,
          transition: "width 0.1s linear",
          borderRadius: "0 2px 2px 0",
        }}
      />

      {/* Cinematic Hero */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "70vh",
          minHeight: "480px",
          maxHeight: "700px",
          overflow: "hidden",
          marginTop: "80px",
        }}
      >
        <Image
          src={getImageUrl(post.coverImage)}
          alt={post.title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,10,20,0.92) 0%, rgba(10,10,20,0.55) 45%, transparent 100%)",
          }}
        />

        {/* content pinned to bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 0 48px",
          }}
        >
          <div className="container">
            <div className="row justify-center">
              <div className="col-lg-9">
                <nav
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "18px",
                    fontSize: "13px",
                    justifyContent: isRTL ? "flex-end" : "flex-start",
                    direction: isRTL ? "rtl" : "ltr",
                  }}
                >
                  <Link
                    href={`/${locale}/blog`}
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      textDecoration: "none",
                    }}
                  >
                    {isRTL ? "المدونة" : "Blog"}
                  </Link>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>
                    {isRTL ? "مقال" : "Article"}
                  </span>
                </nav>

                <h1
                  style={{
                    fontSize: "clamp(26px, 4vw, 46px)",
                    fontWeight: "800",
                    color: "#fff",
                    lineHeight: "1.25",
                    marginBottom: "24px",
                    textAlign: isRTL ? "right" : "left",
                    direction: isRTL ? "rtl" : "ltr",
                    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                    letterSpacing: isRTL ? "0" : "-0.02em",
                  }}
                >
                  {post.title}
                </h1>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                    justifyContent: isRTL ? "flex-end" : "flex-start",
                    direction: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {post.author && (
                    <MetaChip
                      icon={
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      }
                      label={post.author}
                    />
                  )}
                  <MetaChip
                    icon={
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    }
                    label={formatDate(post.publishedAt || post.createdAt)}
                  />
                  {readTime && (
                    <MetaChip
                      icon={
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      }
                      label={
                        isRTL
                          ? `${readTime} دقائق قراءة`
                          : `${readTime} min read`
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section ref={articleRef} style={{ padding: "60px 0 80px" }}>
        <div className="container">
          <div className="row justify-center">
            <div
              className="col-lg-8"
              style={{
                direction: isRTL ? "rtl" : "ltr",
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {post.excerpt && (
                <p
                  style={{
                    fontSize: "20px",
                    lineHeight: "1.8",
                    color: "#555",
                    marginBottom: "40px",
                    fontStyle: "italic",
                    borderLeft: isRTL
                      ? "none"
                      : "3px solid var(--color-accent-1)",
                    borderRight: isRTL
                      ? "3px solid var(--color-accent-1)"
                      : "none",
                    paddingLeft: isRTL ? "0" : "20px",
                    paddingRight: isRTL ? "20px" : "0",
                  }}
                >
                  {post.excerpt}
                </p>
              )}

              <div className="blog-md-content">
                {post.content && (
                  <BlocksRenderer
                    content={post.content}
                    blocks={{
                      paragraph: ({ children }) => (
                        <p
                          style={{
                            marginBottom: "26px",
                            color: "#4a4a4a",
                            lineHeight: "1.95",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      heading: ({ children, level }) => {
                        const sizes = {
                          1: "32px",
                          2: "26px",
                          3: "21px",
                          4: "18px",
                          5: "16px",
                          6: "15px",
                        };
                        const Tag = `h${level}`;
                        return (
                          <Tag
                            style={{
                              fontSize: sizes[level] || "20px",
                              fontWeight: level <= 2 ? "800" : "700",
                              marginTop: level <= 2 ? "48px" : "36px",
                              marginBottom: "16px",
                              color: "var(--color-dark-1)",
                              lineHeight: "1.25",
                              letterSpacing: level <= 2 ? "-0.02em" : "0",
                              paddingBottom: level === 2 ? "10px" : "0",
                              borderBottom:
                                level === 2 ? "2px solid #f0f0f0" : "none",
                            }}
                          >
                            {children}
                          </Tag>
                        );
                      },
                      list: ({ children, format }) =>
                        format === "ordered" ? (
                          <ol
                            style={{
                              marginBottom: "26px",
                              paddingInlineStart: "28px",
                            }}
                          >
                            {children}
                          </ol>
                        ) : (
                          <ul
                            style={{
                              marginBottom: "26px",
                              paddingInlineStart: "28px",
                            }}
                          >
                            {children}
                          </ul>
                        ),
                      "list-item": ({ children }) => (
                        <li
                          style={{
                            marginBottom: "10px",
                            color: "#4a4a4a",
                            lineHeight: "1.8",
                          }}
                        >
                          {children}
                        </li>
                      ),
                      quote: ({ children }) => (
                        <blockquote
                          style={{
                            borderInlineStart:
                              "4px solid var(--color-accent-1)",
                            padding: "20px 24px",
                            margin: "36px 0",
                            background:
                              "linear-gradient(135deg, #fff8f0, #fff)",
                            borderRadius: "0 12px 12px 0",
                            fontStyle: "italic",
                            fontSize: "18px",
                            color: "#555",
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                      code: ({ plainText }) => (
                        <pre
                          style={{
                            background: "#1a1d27",
                            borderRadius: "12px",
                            padding: "24px",
                            margin: "32px 0",
                            overflowX: "auto",
                          }}
                        >
                          <code
                            style={{
                              color: "#e2e8f0",
                              fontFamily: "'Fira Code', monospace",
                              fontSize: "14px",
                            }}
                          >
                            {plainText}
                          </code>
                        </pre>
                      ),
                      image: ({ image }) => {
                        const src = image.url?.startsWith("http")
                          ? image.url
                          : `${STRAPI_CONFIG.url}${image.url}`;
                        return (
                          <span style={{ display: "block", margin: "32px 0" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt={image.alternativeText || ""}
                              style={{
                                maxWidth: "100%",
                                height: "auto",
                                borderRadius: "12px",
                                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                              }}
                            />
                            {image.alternativeText && (
                              <span
                                style={{
                                  display: "block",
                                  textAlign: "center",
                                  fontSize: "13px",
                                  color: "#999",
                                  marginTop: "10px",
                                  fontStyle: "italic",
                                }}
                              >
                                {image.alternativeText}
                              </span>
                            )}
                          </span>
                        );
                      },
                    }}
                    modifiers={{
                      bold: ({ children }) => (
                        <strong
                          style={{
                            fontWeight: "700",
                            color: "var(--color-dark-1)",
                          }}
                        >
                          {children}
                        </strong>
                      ),
                      italic: ({ children }) => (
                        <em style={{ fontStyle: "italic", color: "#555" }}>
                          {children}
                        </em>
                      ),
                      underline: ({ children }) => <u>{children}</u>,
                      strikethrough: ({ children }) => <s>{children}</s>,
                      code: ({ children }) => (
                        <code
                          style={{
                            fontFamily: "'Fira Code', monospace",
                            fontSize: "0.88em",
                            background: "#f0f4f8",
                            padding: "2px 7px",
                            borderRadius: "5px",
                            color: "#c7254e",
                          }}
                        >
                          {children}
                        </code>
                      ),
                      link: ({ children, url }) => (
                        <a
                          href={url}
                          target={
                            url?.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            url?.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          style={{
                            color: "var(--color-accent-1)",
                            textDecoration: "underline",
                            fontWeight: "500",
                          }}
                        >
                          {children}
                        </a>
                      ),
                    }}
                  />
                )}
              </div>

              {/* Share Bar */}
              <div
                style={{
                  marginTop: "60px",
                  paddingTop: "32px",
                  borderTop: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  justifyContent: isRTL ? "flex-end" : "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#888",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {isRTL ? "شارك" : "Share"}
                </span>
                {[
                  {
                    key: "twitter",
                    label: "X / Twitter",
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                  {
                    key: "facebook",
                    label: "Facebook",
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    ),
                  },
                  {
                    key: "whatsapp",
                    label: "WhatsApp",
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ),
                  },
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => handleShare(key)}
                    title={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "1px solid #e0e0e0",
                      background: "#fff",
                      cursor: "pointer",
                      color: "#666",
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--color-accent-1)";
                      e.currentTarget.style.borderColor =
                        "var(--color-accent-1)";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = "#e0e0e0";
                      e.currentTarget.style.color = "#666";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {icon}
                  </button>
                ))}

                <button
                  onClick={handleCopy}
                  title={isRTL ? "نسخ الرابط" : "Copy link"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: "1px solid #e0e0e0",
                    background: copied ? "var(--color-accent-1)" : "#fff",
                    color: copied ? "#fff" : "#666",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                >
                  {copied ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  )}
                  {copied
                    ? isRTL
                      ? "تم النسخ!"
                      : "Copied!"
                    : isRTL
                      ? "نسخ الرابط"
                      : "Copy link"}
                </button>
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
            paddingBottom: "80px",
            background: "#f6f8fb",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "50px",
              }}
            >
              <span
                style={{
                  display: "block",
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to right, transparent, #ddd)",
                }}
              />
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "var(--color-dark-1)",
                  whiteSpace: "nowrap",
                  margin: 0,
                }}
              >
                {isRTL ? "مقالات ذات صلة" : "Related Articles"}
              </h2>
              <span
                style={{
                  display: "block",
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to left, transparent, #ddd)",
                }}
              />
            </div>

            <div className="row y-gap-30">
              {relatedPosts.map((rp) => (
                <div
                  key={rp.documentId || rp.id || rp.slug}
                  className="col-lg-4 col-md-6"
                >
                  <Link
                    href={`/${locale}/blog/${rp.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <article
                      style={{
                        background: "#fff",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                        height: "100%",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow =
                          "0 16px 40px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 16px rgba(0,0,0,0.06)";
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "200px",
                        }}
                      >
                        <Image
                          src={getImageUrl(rp.coverImage)}
                          alt={rp.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div
                        style={{
                          padding: "22px",
                          textAlign: isRTL ? "right" : "left",
                          direction: isRTL ? "rtl" : "ltr",
                        }}
                      >
                        <span style={{ fontSize: "12px", color: "#999" }}>
                          {formatDate(rp.publishedAt || rp.createdAt)}
                        </span>
                        <h3
                          style={{
                            fontSize: "17px",
                            fontWeight: "600",
                            color: "var(--color-dark-1)",
                            lineHeight: "1.5",
                            marginTop: "8px",
                            marginBottom: 0,
                          }}
                        >
                          {rp.title}
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
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <Link
              href={`/${locale}/blog`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 36px",
                background: "var(--color-dark-1)",
                borderRadius: "50px",
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                direction: isRTL ? "rtl" : "ltr",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-accent-1)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-dark-1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                style={{
                  transform: isRTL ? "rotate(180deg)" : "none",
                  display: "inline-block",
                }}
              >
                ←
              </span>
              {isRTL ? "العودة إلى المدونة" : "Back to Blog"}
            </Link>
          </div>
        </div>
      </section>

      {/* Markdown Styles */}
      <style jsx global>{`
        .blog-md-content {
          font-size: 17.5px;
          line-height: 1.95;
          color: #3a3a3a;
        }
        .blog-md-content h1 {
          font-size: 32px;
          font-weight: 800;
          margin-top: 56px;
          margin-bottom: 20px;
          color: var(--color-dark-1);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .blog-md-content h2 {
          font-size: 26px;
          font-weight: 700;
          margin-top: 48px;
          margin-bottom: 18px;
          color: var(--color-dark-1);
          letter-spacing: -0.01em;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0f0f0;
        }
        .blog-md-content h3 {
          font-size: 21px;
          font-weight: 700;
          margin-top: 36px;
          margin-bottom: 14px;
          color: var(--color-dark-1);
        }
        .blog-md-content h4 {
          font-size: 18px;
          font-weight: 600;
          margin-top: 28px;
          margin-bottom: 10px;
          color: var(--color-dark-1);
        }
        .blog-md-content p {
          margin-bottom: 26px;
          color: #4a4a4a;
        }
        .blog-md-content strong {
          font-weight: 700;
          color: var(--color-dark-1);
        }
        .blog-md-content em {
          font-style: italic;
          color: #555;
        }
        .blog-md-content ul,
        .blog-md-content ol {
          margin-bottom: 26px;
          padding-inline-start: 28px;
        }
        .blog-md-content li {
          margin-bottom: 10px;
          color: #4a4a4a;
          line-height: 1.8;
        }
        .blog-md-content a {
          color: var(--color-accent-1);
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 500;
        }
        .blog-md-content a:hover {
          text-decoration: none;
        }
        .blog-md-content blockquote {
          border-inline-start: 4px solid var(--color-accent-1);
          padding: 20px 24px;
          margin: 36px 0;
          background: linear-gradient(135deg, #fff8f0, #fff);
          border-radius: 0 12px 12px 0;
          font-style: italic;
          font-size: 18px;
          color: #555;
        }
        .blog-md-content blockquote p {
          margin-bottom: 0;
          color: #555;
        }
        .blog-md-content code {
          font-family: "Fira Code", "Cascadia Code", monospace;
          font-size: 0.88em;
          background: #f0f4f8;
          padding: 2px 7px;
          border-radius: 5px;
          color: #c7254e;
        }
        .blog-md-content pre {
          background: #1a1d27;
          border-radius: 12px;
          padding: 24px;
          margin: 32px 0;
          overflow-x: auto;
        }
        .blog-md-content pre code {
          background: none;
          color: #e2e8f0;
          font-size: 14px;
          padding: 0;
        }
        .blog-md-content hr {
          border: none;
          border-top: 2px solid #f0f0f0;
          margin: 48px 0;
        }
        .blog-md-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 32px 0;
          font-size: 15px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
        }
        .blog-md-content thead tr {
          background: var(--color-accent-1);
          color: #fff;
        }
        .blog-md-content th,
        .blog-md-content td {
          padding: 14px 18px;
          text-align: start;
          border-bottom: 1px solid #f0f0f0;
        }
        .blog-md-content tbody tr:hover {
          background: #fafafa;
        }
        @media (max-width: 768px) {
          .blog-md-content {
            font-size: 16px;
          }
          .blog-md-content h1 {
            font-size: 26px;
          }
          .blog-md-content h2 {
            font-size: 22px;
          }
          .blog-md-content h3 {
            font-size: 19px;
          }
        }
      `}</style>
    </>
  );
}

function MetaChip({ icon, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        color: "rgba(255,255,255,0.85)",
        fontSize: "13.5px",
      }}
    >
      <span style={{ opacity: 0.7, display: "flex" }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
