import type { Country } from "@/types";

export const maltaCountry: Country = {
  slug: "malta",
  name: "Malta",
  flag: "🇲🇹",
  tagline: "Sun-soaked Mediterranean islands rich in history",
  heroImageUrl: undefined, // Add hero image URL when available
  areas: [
    {
      slug: "sliema",
      name: "Sliema",
      tagline: "Modern waterfront with great dining and beaches",
      imageUrl: undefined, // Add image URL when available
    },
  ],
  tips: [
    {
      icon: "languages",
      title: "Language",
      content:
        "Maltese and English are both official languages. Most locals speak excellent English, making communication easy.",
    },
    {
      icon: "credit-card",
      title: "Currency",
      content:
        "Malta uses the Euro (€). Cards are widely accepted, but carry some cash for smaller shops and markets.",
    },
    {
      icon: "plug",
      title: "Power",
      content:
        "Malta uses UK-style 3-pin plugs (Type G). Voltage is 230V. Bring an adapter if coming from outside the UK.",
    },
    {
      icon: "sun",
      title: "Weather",
      content:
        "Mediterranean climate with hot summers (30°C+) and mild winters (15°C). Best visited April-October.",
    },
    {
      icon: "car",
      title: "Getting Around",
      content:
        "Drive on the left. Public buses connect most areas. Ferries link Malta to Gozo. Bolt/eCabs for taxis.",
    },
    {
      icon: "phone",
      title: "Emergency",
      content:
        "Dial 112 for emergencies. Malta has excellent healthcare. EU citizens can use EHIC cards.",
    },
  ],
};
