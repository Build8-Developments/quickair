const socialMediaLinks = [
  { id: 1, class: "icon-facebook", href: "#" },
  { id: 2, class: "icon-twitter", href: "#" },
  { id: 3, class: "icon-instagram", href: "#" },
  { id: 4, class: "icon-linkedin", href: "#" },
];

export default function Socials() {
  const iconStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '18px',
    marginRight: '12px',
    transition: 'color 0.3s ease',
  };

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      {socialMediaLinks.map((elm, i) => (
        <a 
          key={i} 
          href={elm.href} 
          className={elm.class}
          style={iconStyle}
        ></a>
      ))}
    </div>
  );
}
