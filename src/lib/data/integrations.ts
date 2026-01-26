export interface Integration {
  id: string;
  name: string;
  logo: string;
  category: 'listing' | 'infrastructure' | 'tools' | 'future';
  url?: string;
}

export const integrations: Integration[] = [
  {
    id: "airbnb",
    name: "Airbnb",
    logo: "/logos/airbnb.svg",
    category: "listing",
    url: "https://airbnb.com"
  },
  {
    id: "vrbo",
    name: "Vrbo",
    logo: "/logos/vrbo.svg",
    category: "listing",
    url: "https://vrbo.com"
  },
  {
    id: "booking",
    name: "Booking.com",
    logo: "/logos/booking.svg",
    category: "listing",
    url: "https://booking.com"
  },
  {
    id: "google-maps",
    name: "Google Maps",
    logo: "/logos/google-maps.svg",
    category: "infrastructure",
    url: "https://maps.google.com"
  },
  {
    id: "supabase",
    name: "Supabase",
    logo: "/logos/supabase.svg",
    category: "infrastructure",
    url: "https://supabase.com"
  },
  {
    id: "qr-code",
    name: "QR Code",
    logo: "/logos/qr-code.svg",
    category: "infrastructure"
  },
  {
    id: "guesty",
    name: "Guesty",
    logo: "/logos/guesty.svg",
    category: "future",
    url: "https://guesty.com"
  },
  {
    id: "hostfully",
    name: "Hostfully",
    logo: "/logos/hostfully.svg",
    category: "future",
    url: "https://hostfully.com"
  },
  {
    id: "pricelabs",
    name: "PriceLabs",
    logo: "/logos/pricelabs.svg",
    category: "future",
    url: "https://pricelabs.co"
  },
  {
    id: "smartbnb",
    name: "smartbnb",
    logo: "/logos/smartbnb.svg",
    category: "future",
    url: "https://smartbnb.io"
  }
];

export const integrationsByCategory = {
  listing: integrations.filter(i => i.category === 'listing'),
  infrastructure: integrations.filter(i => i.category === 'infrastructure'),
  tools: integrations.filter(i => i.category === 'tools'),
  future: integrations.filter(i => i.category === 'future')
};
