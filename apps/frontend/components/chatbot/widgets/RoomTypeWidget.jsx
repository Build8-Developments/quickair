"use client";

import styles from "./RoomTypeWidget.module.css";

const ROOM_TYPES = [
  { 
    id: "single", 
    labelAr: "غرفة فردية", 
    labelEn: "Single Room",
    descAr: "سرير واحد",
    descEn: "1 bed",
    icon: "🛏️",
    capacity: 1
  },
  { 
    id: "double", 
    labelAr: "غرفة مزدوجة", 
    labelEn: "Double Room",
    descAr: "سريرين أو سرير كبير",
    descEn: "2 beds or 1 king",
    icon: "🛏️🛏️",
    capacity: 2
  },
  { 
    id: "triple", 
    labelAr: "غرفة ثلاثية", 
    labelEn: "Triple Room",
    descAr: "3 أسرّة",
    descEn: "3 beds",
    icon: "🛏️🛏️🛏️",
    capacity: 3
  },
];

export default function RoomTypeWidget({ language = "ar", onSelect }) {
  const isArabic = language === "ar";

  const handleSelect = (roomType) => {
    onSelect({
      roomType: roomType.id,
      message: isArabic ? roomType.labelAr : roomType.labelEn,
      capacity: roomType.capacity,
    });
  };

  return (
    <div className={styles.widget} dir={isArabic ? "rtl" : "ltr"}>
      <div className={styles.roomGrid}>
        {ROOM_TYPES.map((room) => (
          <button
            key={room.id}
            className={styles.roomCard}
            onClick={() => handleSelect(room)}
          >
            <span className={styles.icon}>{room.icon}</span>
            <div className={styles.content}>
              <div className={styles.label}>
                {isArabic ? room.labelAr : room.labelEn}
              </div>
              <div className={styles.desc}>
                {isArabic ? room.descAr : room.descEn}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
