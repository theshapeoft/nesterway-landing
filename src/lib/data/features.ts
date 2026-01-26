export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: 'core' | 'content' | 'management';
}

export const features: Feature[] = [
  {
    id: "qr-access",
    title: "Instant QR Access",
    description: "Guests scan and get WiFi, rules, guides instantly. No app downloads, no passwords to remember.",
    icon: "qrcode",
    category: "core"
  },
  {
    id: "wifi-share",
    title: "WiFi Auto-Share",
    description: "Password appears on first tap. No typing on tiny keyboards. Works with any device.",
    icon: "wifi",
    category: "core"
  },
  {
    id: "local-recommendations",
    title: "Local Recommendations",
    description: "Curated restaurants, cafes, and activities with Google Maps integration and directions.",
    icon: "map-pin",
    category: "content"
  },
  {
    id: "offline-access",
    title: "Offline Access",
    description: "Works without internet. Perfect for remote properties or areas with spotty coverage.",
    icon: "download",
    category: "core"
  },
  {
    id: "house-rules",
    title: "House Rules",
    description: "Clear expectations reduce misunderstandings. Guests know what to expect before arrival.",
    icon: "clipboard-list",
    category: "content"
  },
  {
    id: "emergency-contacts",
    title: "Emergency Contacts",
    description: "Host contact, local services, hospital info. One tap to call in emergencies.",
    icon: "phone",
    category: "content"
  },
  {
    id: "checkout-instructions",
    title: "Check-out Instructions",
    description: "Automated reminders reduce cleaning issues. Guests know exactly what to do before leaving.",
    icon: "log-out",
    category: "content"
  },
  {
    id: "appliance-guides",
    title: "Appliance Guides",
    description: "Photos and instructions for every device. No more confused guests and support calls.",
    icon: "tool",
    category: "content"
  },
  {
    id: "custom-sections",
    title: "Custom Sections",
    description: "Add anything: parking info, hiking trails, pet rules, pool hours. Fully flexible.",
    icon: "plus-circle",
    category: "content"
  },
  {
    id: "mobile-optimized",
    title: "Mobile-Optimized",
    description: "Perfect on any phone. Responsive design looks great on all screen sizes.",
    icon: "smartphone",
    category: "core"
  },
  {
    id: "multi-property",
    title: "Multi-Property Dashboard",
    description: "Manage unlimited properties from one place. Duplicate guides to save time.",
    icon: "layout-grid",
    category: "management"
  },
  {
    id: "branded-qr",
    title: "Beautiful QR Codes",
    description: "Print-ready codes with your branding. Professional presentation that elevates your property.",
    icon: "image",
    category: "management"
  }
];

export const featureCategories = {
  core: {
    title: "Core Features",
    description: "Everything you need for a great guest experience"
  },
  content: {
    title: "Content & Communication",
    description: "Share information that matters to your guests"
  },
  management: {
    title: "Management Tools",
    description: "Powerful tools to scale your hosting business"
  }
};
