import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HajOmra() {
  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "120px auto",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {/* First Image */}
        <Link
          style={{
            flex: "1 1 50px",
            maxWidth: "750px",
            minWidth: "300px",
          }}
          href="/"
        >
          <Image
            src="https://placehold.co/750x600/webp?text=haj%20750x650"
            alt="Haj"
            width={750}
            height={600}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Link>

        {/* Second Image */}
        <Link
          href="/"
          style={{
            flex: "1 1 50px",
            maxWidth: "750px",
            minWidth: "300px",
          }}
        >
          <Image
            src="https://placehold.co/750x600/webp?text=omra%20750x650"
            alt="Omra"
            width={750}
            height={600}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Link>
      </div>
    </div>
  );
}
