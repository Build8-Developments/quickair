// Import all tour data
import ainSokhna from './tours/ain_sokhna.json';
import dahab from './tours/dahab.json';
import hurghada from './tours/hurghada.json';
import sharmElSheikh from './tours/sharm_el_sheikh.json';
import sahlHashish from './tours/sahl_hashish.json';
import istanbul from './tours/Istanbul.json';
import bali from './tours/bali.json';
import beirut from './tours/Beirut.json';

// Domestic destinations (Egypt)
export const DOMESTIC_DESTINATIONS = [
  {
    id: 'ain-sokhna',
    name: 'العين السخنة',
    nameEn: 'Ain Sokhna',
    country: 'مصر',
    countryEn: 'Egypt',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    popular: true,
    data: ainSokhna,
    priceRange: {
      min: 3750,
      max: 13820,
      currency: 'EGP'
    },
    hotelCount: ainSokhna.hotels.length,
    description: 'منتجعات ساحلية قريبة من القاهرة على البحر الأحمر',
    descriptionEn: 'Coastal resorts near Cairo on the Red Sea',
  },
  {
    id: 'sharm-el-sheikh',
    name: 'شرم الشيخ',
    nameEn: 'Sharm El Sheikh',
    country: 'مصر',
    countryEn: 'Egypt',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    popular: true,
    data: sharmElSheikh,
    priceRange: {
      min: 7700,
      max: 16900,
      currency: 'EGP'
    },
    hotelCount: sharmElSheikh.hotels.length,
    description: 'وجهة الغوص والمنتجعات الفاخرة في سيناء',
    descriptionEn: 'Premier diving destination and luxury resorts in Sinai',
  },
  {
    id: 'hurghada',
    name: 'الغردقة',
    nameEn: 'Hurghada',
    country: 'مصر',
    countryEn: 'Egypt',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80',
    popular: true,
    data: hurghada,
    priceRange: {
      min: 4280,
      max: 33810,
      currency: 'EGP'
    },
    hotelCount: hurghada.hotels.length,
    description: 'منتجعات البحر الأحمر مع حدائق مائية ومناظر خلابة',
    descriptionEn: 'Red Sea resorts with water parks and stunning views',
  },
  {
    id: 'dahab',
    name: 'دهب',
    nameEn: 'Dahab',
    country: 'مصر',
    countryEn: 'Egypt',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
    popular: true,
    data: dahab,
    priceRange: {
      min: 4400,
      max: 8850,
      currency: 'EGP'
    },
    hotelCount: dahab.hotels.length,
    description: 'مدينة ساحلية هادئة مثالية للاسترخاء والغوص',
    descriptionEn: 'Peaceful coastal town perfect for relaxation and diving',
  },
  {
    id: 'sahl-hasheesh',
    name: 'سهل حشيش',
    nameEn: 'Sahl Hasheesh',
    country: 'مصر',
    countryEn: 'Egypt',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    popular: false,
    data: sahlHashish,
    priceRange: {
      min: 8700,
      max: 21600,
      currency: 'EGP'
    },
    hotelCount: sahlHashish.hotels.length,
    description: 'منطقة منتجعات فاخرة جنوب الغردقة',
    descriptionEn: 'Luxury resort area south of Hurghada',
  },
];

// International destinations
export const INTERNATIONAL_DESTINATIONS = [
  {
    id: 'istanbul',
    name: 'إسطنبول',
    nameEn: 'Istanbul',
    country: 'تركيا',
    countryEn: 'Turkey',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
    popular: true,
    data: istanbul,
    priceRange: {
      min: 7950,
      max: 20000,
      currency: 'EGP'
    },
    hotelCount: istanbul.hotels.length,
    description: 'المدينة العابرة للقارات بين أوروبا وآسيا',
    descriptionEn: 'The transcontinental city between Europe and Asia',
    requiresVisa: true,
  },
  {
    id: 'bali',
    name: 'بالي',
    nameEn: 'Bali',
    country: 'إندونيسيا',
    countryEn: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    popular: true,
    data: bali,
    priceRange: {
      min: 17500,
      max: 32750,
      currency: 'EGP'
    },
    hotelCount: bali.hotels.length,
    description: 'جزيرة الجنة مع معابد ساحرة وشواطئ استوائية',
    descriptionEn: 'Paradise island with enchanting temples and tropical beaches',
    requiresVisa: true,
  },
  {
    id: 'beirut',
    name: 'بيروت',
    nameEn: 'Beirut',
    country: 'لبنان',
    countryEn: 'Lebanon',
    image: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&q=80',
    popular: true,
    data: beirut,
    priceRange: {
      min: 22500,
      max: 60000,
      currency: 'EGP'
    },
    hotelCount: beirut.hotels.length,
    description: 'باريس الشرق بتاريخها العريق وثقافتها المتنوعة',
    descriptionEn: 'Paris of the East with rich history and diverse culture',
    requiresVisa: true,
  },
];

// Get destination by ID
export const getDestinationById = (id, locationType = 'international') => {
  const destinations = locationType === 'domestic' 
    ? DOMESTIC_DESTINATIONS 
    : INTERNATIONAL_DESTINATIONS;
  
  return destinations.find(dest => dest.id === id);
};

// Get hotels for a destination
export const getHotelsForDestination = (destinationId, locationType = 'international') => {
  const destination = getDestinationById(destinationId, locationType);
  return destination?.data?.hotels || [];
};

// Filter hotels by budget
export const filterHotelsByBudget = (hotels, maxBudget, perPerson = true) => {
  if (!maxBudget) return hotels;
  
  return hotels.filter(hotel => {
    const price = perPerson ? hotel.prices_egp?.double : hotel.price_egp;
    return price && price <= maxBudget;
  });
};

// Filter hotels by stars
export const filterHotelsByStars = (hotels, minStars = 3) => {
  return hotels.filter(hotel => hotel.stars >= minStars);
};

// Get price range for hotels
export const getPriceRange = (hotels) => {
  if (!hotels || hotels.length === 0) return { min: 0, max: 0 };
  
  const prices = hotels
    .map(hotel => hotel.prices_egp?.double || hotel.price_egp)
    .filter(price => price);
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

export default {
  DOMESTIC_DESTINATIONS,
  INTERNATIONAL_DESTINATIONS,
  getDestinationById,
  getHotelsForDestination,
  filterHotelsByBudget,
  filterHotelsByStars,
  getPriceRange,
};
