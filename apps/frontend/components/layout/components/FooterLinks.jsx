const sections = [
  {
    title: "Company",
    links: [
      { id: 1, text: "About Us", href: "/about" },
      { id: 3, text: "Contact Us", href: "/contact" },
      { id: 5, text: "Data Policy", href: "/data-policy" },
      { id: 6, text: "Cookie Policy", href: "/cookie-policy" },
      { id: 7, text: "Legal", href: "/legal" },
    ],
  },
  {
    title: "Support",
    links: [
      { id: 9, text: "Get in Touch", href: "/contact" },
      { id: 11, text: "Live chat", href: "https://wa.me/+201007004828" },
    ],
  },
];

export default function FooterLinks() {
  return (
    <>
      {sections.map((elm, i) => (
        <div key={i} className="col-lg-auto col-6">
          <h4 className="text-20 fw-500">{elm.title}</h4>

          <div className="y-gap-10 mt-20">
            {elm.links.map((elm2, i2) =>
              elm2.href.startsWith("https://") ? (
                <a
                  key={i2}
                  target="_blank"
                  className="d-block fw-500"
                  href={elm2.href}
                >
                  {elm2.text}
                </a>
              ) : (
                <a key={i2} className="d-block fw-500" href={elm2.href}>
                  {elm2.text}
                </a>
              )
            )}
          </div>
        </div>
      ))}
    </>
  );
}
