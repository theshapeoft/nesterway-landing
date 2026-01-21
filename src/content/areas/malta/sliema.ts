import type { Area } from "@/types";

export const sliemaArea: Area = {
  slug: "sliema",
  name: "Sliema",
  countrySlug: "malta",
  countryName: "Malta",
  tagline: "Malta's modern waterfront",
  heroImageUrl: "/images/areas/sliema-hero.jpg",
  vibe: "Relaxed beach town with a modern seafront promenade, great for evening strolls and seaside dining",
  bestFor: ["Beach", "Dining", "Walking", "Shopping"],
  gettingAround: "Easy walking along the promenade. Buses to Valletta run every 15 minutes from the ferry terminal.",
  categories: [
    {
      slug: "food-drink",
      name: "Food & Drink",
      icon: "utensils",
      recommendationCount: 4,
    },
    {
      slug: "things-to-do",
      name: "Things to Do",
      icon: "compass",
      recommendationCount: 3,
    },
    {
      slug: "beaches",
      name: "Beaches",
      icon: "waves",
      recommendationCount: 2,
    },
    {
      slug: "nightlife",
      name: "Nightlife",
      icon: "moon",
      recommendationCount: 2,
    },
  ],
  recommendations: [
    // Food & Drink
    {
      id: "takris",
      name: "Ta' Kris Restaurant",
      category: "food-drink",
      cuisineType: "Maltese Traditional",
      description:
        "Authentic rabbit stew and fresh ftira in a cozy, family-run setting. The best traditional Maltese food in Sliema.",
      priceRange: "€€",
      distance: "5 min walk",
      imageUrl: undefined,
      googleMapsQuery: "Ta' Kris Restaurant, Sliema, Malta",
      badge: "Must Try",
    },
    {
      id: "surfside",
      name: "Surfside",
      category: "food-drink",
      cuisineType: "Mediterranean Seafood",
      description:
        "Fresh seafood with stunning waterfront views. Perfect for a sunset dinner on the terrace.",
      priceRange: "€€€",
      distance: "10 min walk",
      imageUrl: undefined,
      googleMapsQuery: "Surfside Restaurant, Sliema, Malta",
    },
    {
      id: "piccolo-padre",
      name: "Piccolo Padre",
      category: "food-drink",
      cuisineType: "Italian",
      description:
        "Authentic Italian pizzas and pasta in a casual setting. Great for families and quick bites.",
      priceRange: "€€",
      distance: "3 min walk",
      imageUrl: undefined,
      googleMapsQuery: "Piccolo Padre, Sliema, Malta",
    },
    {
      id: "cafe-cuba",
      name: "Café Cuba",
      category: "food-drink",
      cuisineType: "Café & Cocktails",
      description:
        "Popular spot for coffee by day and cocktails by night. Great promenade views and people watching.",
      priceRange: "€€",
      distance: "7 min walk",
      imageUrl: undefined,
      googleMapsQuery: "Cafe Cuba, Sliema, Malta",
    },
    // Things to Do
    {
      id: "promenade-walk",
      name: "Sliema Promenade Walk",
      category: "things-to-do",
      description:
        "The iconic 3km seafront walk from Sliema to St. Julian's. Best at sunset for golden hour views of Valletta.",
      distance: "Starts nearby",
      imageUrl: undefined,
      googleMapsQuery: "Sliema Promenade, Malta",
      badge: "Free",
    },
    {
      id: "ferry-valletta",
      name: "Ferry to Valletta",
      category: "things-to-do",
      description:
        "Quick 5-minute scenic ferry crossing to the capital. Much more enjoyable than the bus with great photo opportunities.",
      priceRange: "€",
      distance: "8 min walk to ferry",
      imageUrl: undefined,
      googleMapsQuery: "Sliema Ferry Terminal, Malta",
    },
    {
      id: "tigne-point",
      name: "Tigné Point Shopping",
      category: "things-to-do",
      description:
        "Modern shopping mall with international brands, cinema, and food court. Good for rainy days.",
      distance: "12 min walk",
      imageUrl: undefined,
      googleMapsQuery: "The Point Shopping Mall, Sliema, Malta",
    },
    // Beaches
    {
      id: "exiles-beach",
      name: "Exiles Beach",
      category: "beaches",
      description:
        "Rocky beach with easy water access and swimming ladders. Popular with locals. Bring water shoes.",
      distance: "2 min walk",
      imageUrl: undefined,
      googleMapsQuery: "Exiles Beach, Sliema, Malta",
      badge: "Closest",
    },
    {
      id: "fond-ghadir",
      name: "Fond Ghadir Beach",
      category: "beaches",
      description:
        "Small sandy beach area, rare in Sliema. Gets busy in summer but great for families with kids.",
      distance: "15 min walk",
      imageUrl: undefined,
      googleMapsQuery: "Fond Ghadir Beach, Sliema, Malta",
    },
    // Nightlife
    {
      id: "havana-club",
      name: "Havana Club",
      category: "nightlife",
      description:
        "Popular bar and club on the promenade. Live music on weekends and a fun, mixed crowd.",
      priceRange: "€€",
      distance: "10 min walk",
      imageUrl: undefined,
      googleMapsQuery: "Havana Club, Sliema, Malta",
    },
    {
      id: "sky-club",
      name: "Sky Club",
      category: "nightlife",
      description:
        "Rooftop bar with panoramic views. Dress code applies. Book ahead for Friday/Saturday nights.",
      priceRange: "€€€",
      distance: "5 min walk",
      imageUrl: undefined,
      googleMapsQuery: "Sky Club Malta, Sliema",
    },
  ],
  localInsights: [
    "The best sunset spot is at Independence Gardens, not the crowded promenade",
    "Skip the tourist restaurants on Tower Road — head one block inland for authentic prices",
    "The ferry to Valletta is €1.50 and way better than sitting in traffic on the bus",
    "Most rocky beaches have swimming ladders. Look for the red and white ones for easy water access",
    "Sundays are family day on the promenade — expect crowds but great atmosphere",
  ],
};
