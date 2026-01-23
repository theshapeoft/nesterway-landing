// Location Types (Google Places)
export interface PropertyLocation {
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

// Property Types
export interface WiFiNetwork {
  name: string;
  password: string;
  type: "WPA" | "WEP" | "nopass";
  description?: string;
  isPrimary?: boolean;
}

export interface EmergencyContact {
  name: string;
  phone?: string;
  email?: string;
}

export interface PropertyRule {
  text: string;
  severity: "critical" | "normal";
}

export interface Appliance {
  name: string;
  location?: string;
  instructions: string;
}

export interface PropertySection {
  id: string;
  title: string;
  icon: string;
  content: PropertyRule[] | Appliance[] | string[];
}

// Access mode for guest access control
export type PropertyAccessMode = "public" | "invite_only";

export interface Property {
  id: string;
  slug: string;
  name: string;
  areaSlug: string;
  areaName: string;
  countrySlug: string;
  countryName: string;
  welcomeMessage?: string;
  hostName?: string;
  hostPhotoUrl?: string;
  heroImageUrl?: string;
  checkoutTime: string;
  accessMode: PropertyAccessMode;
  requireGuestRegistration: boolean;
  activeMapId?: string;
  wifi: {
    networks: WiFiNetwork[];
  };
  emergencyContact: EmergencyContact;
  sections: PropertySection[];
}

// Guest registration for forced registration feature
export interface GuestRegistration {
  id: string;
  propertyId: string;
  fullName: string;
  email: string;
  additionalGuests: number;
  registeredAt: string;
}

// Guest invite status for time-limited access
export type GuestInviteStatus = "pending" | "active" | "expired" | "revoked";

// Guest invite for invite-only property access
export interface GuestInvite {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  leadTimeDays: number;
  postCheckoutDays: number;
  accessCode: string;
  customMessage?: string;
  status: GuestInviteStatus;
  emailSentAt?: string;
  emailResendCount: number;
  lastResendAt?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Interactive Maps Types
export type MapCategoryColor = "blue" | "red" | "yellow" | "green" | "purple" | "orange";

export interface MapCategory {
  id: string;
  mapId: string;
  title: string;
  color: MapCategoryColor;
  orderIndex: number;
  createdAt: string;
}

export interface MapPin {
  id: string;
  categoryId: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  address?: string;
  createdAt: string;
}

export interface PropertyMap {
  id: string;
  userId: string;
  title: string;
  showPropertyAddress: boolean;
  createdAt: string;
  updatedAt: string;
  categories?: MapCategory[];
  pinCount?: number;
}

// Area Types
export interface Recommendation {
  id: string;
  name: string;
  category: string;
  cuisineType?: string;
  description: string;
  priceRange?: "€" | "€€" | "€€€" | "€€€€";
  distance?: string;
  imageUrl?: string;
  googleMapsQuery: string;
  badge?: string;
}

export interface AreaCategory {
  slug: string;
  name: string;
  icon: string;
  recommendationCount: number;
}

export interface Area {
  slug: string;
  name: string;
  countrySlug: string;
  countryName: string;
  tagline: string;
  heroImageUrl?: string;
  vibe: string;
  bestFor: string[];
  gettingAround: string;
  categories: AreaCategory[];
  recommendations: Recommendation[];
  localInsights: string[];
}

// Country Types
export interface CountryTip {
  icon: string;
  title: string;
  content: string;
}

export interface AreaSummary {
  slug: string;
  name: string;
  tagline: string;
  imageUrl?: string;
}

export interface Country {
  slug: string;
  name: string;
  flag: string;
  tagline: string;
  heroImageUrl?: string;
  areas: AreaSummary[];
  tips: CountryTip[];
}
