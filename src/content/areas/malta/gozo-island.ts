import type { Area } from "@/types";

export const gozoIslandArea: Area = {
  slug: "gozo-island",
  name: "Gozo",
  countrySlug: "malta",
  countryName: "Malta",
  tagline: "Malta's tranquil sister island — ancient temples, dramatic cliffs, and timeless charm",
  heroImageUrl: "/images/areas/gozo-hero.jpg",
  vibe: "A slower-paced island escape where 5,000-year-old temples, hidden swimming coves, and authentic village life create a Mediterranean paradise that feels decades behind the mainland",
  bestFor: ["Hiking", "Diving", "Beaches", "History", "Photography", "Relaxation"],
  gettingAround: "Ferry from Ċirkewwa (25 min, runs every 45 min). Rent a car in Mġarr for maximum flexibility — island is small but public transport is limited. Quad bikes and jeep tours popular. Hop-on hop-off bus available.",
  categories: [
    {
      slug: "must-see",
      name: "Must-See Attractions",
      icon: "star",
      recommendationCount: 10,
    },
    {
      slug: "food-drink",
      name: "Food & Drink",
      icon: "utensils",
      recommendationCount: 14,
    },
    {
      slug: "beaches",
      name: "Beaches & Swimming",
      icon: "waves",
      recommendationCount: 12,
    },
    {
      slug: "historical",
      name: "Historical Sites",
      icon: "landmark",
      recommendationCount: 8,
    },
    {
      slug: "hiking",
      name: "Hiking & Walks",
      icon: "footprints",
      recommendationCount: 8,
    },
    {
      slug: "diving",
      name: "Diving & Snorkeling",
      icon: "anchor",
      recommendationCount: 6,
    },
    {
      slug: "hidden-gems",
      name: "Hidden Gems & Secret Spots",
      icon: "gem",
      recommendationCount: 10,
    },
  ],
  recommendations: [
    // ===== MUST-SEE ATTRACTIONS =====
    {
      id: "citadella",
      name: "The Citadella",
      category: "must-see",
      description:
        "Fortified citadel towering over Victoria with 360° views of the entire island. Walk the ramparts, explore the cathedral, and wander atmospheric narrow streets. Best at sunset when the limestone glows golden.",
      distance: "Victoria",
      googleMapsQuery: "Citadella, Victoria, Gozo, Malta",
      badge: "Must Visit",
    },
    {
      id: "dwejra-bay",
      name: "Dwejra Bay & Blue Hole",
      category: "must-see",
      description:
        "Former home of the Azure Window, now famous for the Blue Hole — a natural chimney dropping into the sea. World-class diving site. Also see the Inland Sea and Fungus Rock. Dramatic cliffs.",
      distance: "West coast",
      googleMapsQuery: "Dwejra Bay, Gozo, Malta",
      badge: "Iconic",
    },
    {
      id: "ramla-bay",
      name: "Ramla Bay",
      category: "must-see",
      description:
        "Gozo's most famous beach with distinctive red-orange sand. Calypso's Cave overlooks the bay — allegedly where Odysseus was held captive. Less crowded than mainland Malta beaches.",
      distance: "North coast",
      googleMapsQuery: "Ramla Bay, Gozo, Malta",
      badge: "Red Sand Beach",
    },
    {
      id: "ggantija-temples",
      name: "Ġgantija Temples",
      category: "must-see",
      description:
        "UNESCO World Heritage megalithic temples — older than Stonehenge and the pyramids (3600-3200 BC). Two remarkably preserved temple structures. The visitor center provides excellent context.",
      priceRange: "€",
      distance: "Xagħra",
      googleMapsQuery: "Ggantija Temples, Xaghra, Gozo, Malta",
      badge: "UNESCO",
    },
    {
      id: "xlendi-bay",
      name: "Xlendi Bay",
      category: "must-see",
      description:
        "Picturesque inlet on the south coast — Gozo's main seaside resort. Waterfront restaurants, swimming off rocks, and cliff walks. More relaxed vibe than Malta's tourist areas.",
      distance: "South coast",
      googleMapsQuery: "Xlendi Bay, Gozo, Malta",
    },
    {
      id: "wied-il-ghasri",
      name: "Wied il-Għasri",
      category: "must-see",
      description:
        "Dramatic narrow canyon cutting to the sea — like a natural fjord. Crystal-clear swimming in a 300m protected inlet. Small pebble beach at the bottom. One of the most photogenic spots in Malta.",
      distance: "North coast",
      googleMapsQuery: "Wied il-Għasri, Gozo, Malta",
      badge: "Instagram Famous",
    },
    {
      id: "victoria-rabat",
      name: "Victoria (Rabat)",
      category: "must-see",
      description:
        "Gozo's charming capital — wander the main square (It-Tokk), explore local shops, and experience authentic Gozitan life. Much quieter and more traditional than anywhere on mainland Malta.",
      distance: "Central",
      googleMapsQuery: "Victoria, Gozo, Malta",
    },
    {
      id: "mgarr-harbour",
      name: "Mġarr Harbour",
      category: "must-see",
      description:
        "Where ferries arrive — a colorful fishing harbour with bobbing luzzus and excellent waterfront restaurants. The church of Our Lady of Lourdes perches dramatically above.",
      distance: "East coast",
      googleMapsQuery: "Mgarr Harbour, Gozo, Malta",
    },
    {
      id: "tal-mixta-cave",
      name: "Tal-Mixta Cave",
      category: "must-see",
      description:
        "Natural cave that perfectly frames Ramla Bay below — the most Instagrammed spot in Gozo. Short walk from Nadur. Go at sunset when the bay glows golden through the cave opening.",
      distance: "Nadur",
      googleMapsQuery: "Tal-Mixta Cave, Gozo, Malta",
      badge: "Photo Spot",
    },
    {
      id: "inland-sea",
      name: "Inland Sea",
      category: "must-see",
      description:
        "Small enclosed lagoon connected to the Mediterranean via an 80m tunnel through the cliffs. Take a traditional luzzu boat through the tunnel. Incredible light effects and geology.",
      priceRange: "€",
      distance: "Dwejra",
      googleMapsQuery: "Inland Sea, Gozo, Malta",
    },

    // ===== FOOD & DRINK =====
    {
      id: "ta-frenc",
      name: "Ta' Frenċ",
      category: "food-drink",
      cuisineType: "Fine Dining",
      description:
        "Gozo's award-winning fine dining destination in a restored farmhouse. Michelin-listed with stunning countryside views over Żebbuġ. Choose 3 or 5 courses — every dish is exceptional. Book ahead.",
      priceRange: "€€€€",
      distance: "Xagħra",
      googleMapsQuery: "Ta' Frenċ Restaurant, Xaghra, Gozo, Malta",
      badge: "Michelin Guide",
    },
    {
      id: "ta-tona",
      name: "Ta' Tona",
      category: "food-drink",
      cuisineType: "Seafood",
      description:
        "Family-run gem steps from Mġarr Harbour. Fresh fish and seafood: try the King Prawns, Calamari Fritti, or Linguine Nero di Seppia. Deconstructed cannoli for dessert. Perfect post-ferry meal.",
      priceRange: "€€",
      distance: "Mġarr",
      googleMapsQuery: "Ta' Tona Restaurant, Mgarr, Gozo, Malta",
      badge: "Local Favorite",
    },
    {
      id: "tmun",
      name: "Tmun",
      category: "food-drink",
      cuisineType: "Seafood & Mediterranean",
      description:
        "Nautical-themed restaurant near Mġarr with beautifully executed dishes. The fish soup, prawn tartare, and crispy monkfish are outstanding. Reserve in peak season.",
      priceRange: "€€€",
      distance: "Mġarr",
      googleMapsQuery: "Tmun Restaurant, Mgarr, Gozo, Malta",
    },
    {
      id: "maldonado",
      name: "Maldonado",
      category: "food-drink",
      cuisineType: "Mediterranean Creative",
      description:
        "Hidden gem in Victoria's historic center serving seasonal Mediterranean cuisine with creative flair. Wine tasting events Mon-Fri at 7:30pm with 8-wine degustation menu. Private room available.",
      priceRange: "€€€",
      distance: "Victoria",
      googleMapsQuery: "Maldonado Restaurant, Victoria, Gozo, Malta",
    },
    {
      id: "il-tokk",
      name: "It-Tokk",
      category: "food-drink",
      cuisineType: "Traditional Gozitan",
      description:
        "Traditional Gozitan food on Victoria's main square — rabbit stew, braġjoli, local ravioli. Has a shop selling Gozitan honey, goat cheese, and prickly pear marmalade. Watch local life from the terrace.",
      priceRange: "€€",
      distance: "Victoria",
      googleMapsQuery: "It-Tokk Restaurant, Victoria, Gozo, Malta",
      badge: "Traditional",
    },
    {
      id: "casa-vostra",
      name: "Casa Vostra",
      category: "food-drink",
      cuisineType: "Italian",
      description:
        "Italian heaven in Victoria — possibly the best pizza crust in Malta. Start with burrata and Aperol Spritz, then whatever pizza calls to you. Don't skip the Tres Leches dessert.",
      priceRange: "€€",
      distance: "Victoria",
      googleMapsQuery: "Casa Vostra, Victoria, Gozo, Malta",
    },
    {
      id: "ta-karolina",
      name: "Ta' Karolina",
      category: "food-drink",
      cuisineType: "Seafood",
      description:
        "Fresh-caught fish and seafood with spectacular sunset views over Xlendi Bay. Seafood risotto is legendary. Reserve ahead — especially weekends and summer. Worth the effort.",
      priceRange: "€€€",
      distance: "Xlendi",
      googleMapsQuery: "Ta' Karolina Restaurant, Xlendi, Gozo, Malta",
    },
    {
      id: "boathouse-xlendi",
      name: "The Boathouse",
      category: "food-drink",
      cuisineType: "Seafood",
      description:
        "Famous Xlendi restaurant with waterfront terrace overlooking the bay. Seafood specialties plus traditional dishes like Gozo ravioli and duck. Perfect for lunch watching swimmers and boats.",
      priceRange: "€€€",
      distance: "Xlendi",
      googleMapsQuery: "The Boathouse Restaurant, Xlendi, Gozo, Malta",
    },
    {
      id: "xerri-il-bukkett",
      name: "Xerri il-Bukkett",
      category: "food-drink",
      cuisineType: "Mediterranean",
      description:
        "Stunning views of Comino and Blue Lagoon from your table. Fresh fish, local pork, and homemade pasta. Terrace dining with that magical Mediterranean light. One of Gozo's best viewpoint restaurants.",
      priceRange: "€€",
      distance: "Qala",
      googleMapsQuery: "Xerri il-Bukkett, Qala, Gozo, Malta",
      badge: "Best Views",
    },
    {
      id: "country-terrace",
      name: "Country Terrace",
      category: "food-drink",
      cuisineType: "Mediterranean",
      description:
        "Hillside restaurant overlooking Mġarr Harbour with views to Malta, Comino, and Kemmunett. Great vegetarian options. Lunch with a view doesn't get better than this.",
      priceRange: "€€",
      distance: "Mġarr",
      googleMapsQuery: "Country Terrace, Mgarr, Gozo, Malta",
    },
    {
      id: "maxokk-bakery",
      name: "Maxokk Bakery",
      category: "food-drink",
      cuisineType: "Bakery & Traditional",
      description:
        "Legendary Nadur bakery for traditional ftira (Gozitan pizza). No seating — grab it fresh and take to Ramla Bay for the best beach picnic. Authentic local experience, crazy cheap.",
      priceRange: "€",
      distance: "Nadur",
      googleMapsQuery: "Maxokk Bakery, Nadur, Gozo, Malta",
      badge: "Must Try",
    },
    {
      id: "del-capo",
      name: "Del Capo",
      category: "food-drink",
      cuisineType: "Pizza",
      description:
        "Some say the best pizza in all of Malta — perfect Italian-style pizza in the heart of Nadur. Great for takeaway to eat in the village square. Affordable and consistently excellent.",
      priceRange: "€",
      distance: "Nadur",
      googleMapsQuery: "Del Capo, Nadur, Gozo, Malta",
    },
    {
      id: "il-kartell",
      name: "Il-Kartell",
      category: "food-drink",
      cuisineType: "Seafood",
      description:
        "Family-run since 1973, right on the Marsalforn seafront. Seafood risotto is a legend. Beautiful terrace facing the bay — romantic dinner spot. Book for sunset.",
      priceRange: "€€",
      distance: "Marsalforn",
      googleMapsQuery: "Il-Kartell Restaurant, Marsalforn, Gozo, Malta",
    },
    {
      id: "qbajjar",
      name: "Qbajjar Restaurant",
      category: "food-drink",
      cuisineType: "Mediterranean",
      description:
        "Near the salt pans at Xwejni Bay — fresh pasta, fish, and stunning sea views. The dessert selection is exceptional. Peaceful location away from main tourist areas.",
      priceRange: "€€",
      distance: "Xwejni",
      googleMapsQuery: "Qbajjar Restaurant, Marsalforn, Gozo, Malta",
    },

    // ===== BEACHES & SWIMMING =====
    {
      id: "ramla-beach",
      name: "Ramla Bay Beach",
      category: "beaches",
      description:
        "Gozo's biggest and most famous beach — distinctive red-orange sand in a fertile valley. Calypso's Cave overlooks from above. Sunbeds and snack bars available. Gets busy but still calmer than Malta.",
      distance: "North coast",
      googleMapsQuery: "Ramla Bay, Gozo, Malta",
      badge: "Red Sand",
    },
    {
      id: "san-blas-bay",
      name: "San Blas Bay",
      category: "beaches",
      description:
        "Smaller, quieter version of Ramla with similar red-orange sand. Steep road down keeps crowds away. Scenic terraced valley, good snorkeling around rocks. Small beach bar in summer.",
      distance: "Nadur",
      googleMapsQuery: "San Blas Bay, Gozo, Malta",
      badge: "Hidden Beach",
    },
    {
      id: "hondoq-bay",
      name: "Ħondoq Bay",
      category: "beaches",
      description:
        "Rocky beach with crystal-clear water and views to Comino. Sandy bottom makes for easy swimming. Facilities include shower, toilet, kiosk, and water sports. Family-friendly.",
      distance: "Qala",
      googleMapsQuery: "Hondoq Bay, Gozo, Malta",
    },
    {
      id: "xlendi-swimming",
      name: "Xlendi Bay Swimming",
      category: "beaches",
      description:
        "Swim off the rocks in this picturesque bay surrounded by restaurants and cliffs. Ladders for easy access. Combine with lunch at a waterfront restaurant. Popular but not overwhelming.",
      distance: "Xlendi",
      googleMapsQuery: "Xlendi Bay, Gozo, Malta",
    },
    {
      id: "marsalforn-bay",
      name: "Marsalforn Bay",
      category: "beaches",
      description:
        "Gozo's main resort town — sandy beach, seafront promenade, restaurants, and cafes. Good base for exploring. The salt pans nearby are worth visiting at sunset.",
      distance: "North coast",
      googleMapsQuery: "Marsalforn Bay, Gozo, Malta",
    },
    {
      id: "mgarr-ix-xini-swim",
      name: "Mġarr ix-Xini Bay",
      category: "beaches",
      description:
        "Secluded inlet famous as the filming location for 'By The Sea' (Brangelina movie). Crystal-clear water, dramatic cliffs, peaceful atmosphere. The scenic drive down is part of the experience.",
      distance: "South coast",
      googleMapsQuery: "Mgarr ix-Xini, Gozo, Malta",
      badge: "Film Location",
    },
    {
      id: "ix-xtajta",
      name: "Ix-Xtajta Beach",
      category: "beaches",
      description:
        "Local's secret — truly hidden rocky beach with natural pools and unique circular rock formations. 15-min walk from parking. Even in peak summer, you might have it to yourself. Bring everything.",
      distance: "Near Ramla",
      googleMapsQuery: "Ix-Xtajta Beach, Gozo, Malta",
      badge: "Secret Spot",
    },
    {
      id: "xatt-lahmar",
      name: "Xatt l-Aħmar Bay",
      category: "beaches",
      description:
        "Red-brown terraced fields lead to this peaceful bay. Great for swimming and diving — three ferry wrecks lie 40m below for scuba divers. Clay cliffs, salt pans, fishing boats. No facilities.",
      distance: "Għajnsielem",
      googleMapsQuery: "Xatt l-Ahmar, Gozo, Malta",
      badge: "Off the Beaten Path",
    },
    {
      id: "dahlet-qorrot",
      name: "Daħlet Qorrot",
      category: "beaches",
      description:
        "Small pebble beach in a narrow inlet surrounded by cliffs. Boat houses carved into the rock. Popular with locals, rarely with tourists. Peaceful and photogenic.",
      distance: "Near Nadur",
      googleMapsQuery: "Dahlet Qorrot, Gozo, Malta",
    },
    {
      id: "dwejra-swimming",
      name: "Dwejra Bay Swimming",
      category: "beaches",
      description:
        "Swim in the Blue Hole or from the rocks around Dwejra. Deep, crystal-clear water. More for experienced swimmers — no sandy beach but incredible underwater scenery even while snorkeling.",
      distance: "West coast",
      googleMapsQuery: "Dwejra Bay, Gozo, Malta",
    },
    {
      id: "barbaggan-rocks",
      name: "Barbaggan Rocks",
      category: "beaches",
      description:
        "Tiny sandy beach and excellent snorkeling between Mġarr and Ħondoq. Wild Mediterranean thyme blooms here in June. Views to Comino. Hike from Mġarr or walk from Ħondoq.",
      distance: "Qala coastline",
      googleMapsQuery: "Barbaggan, Gozo, Malta",
      badge: "Snorkeling Paradise",
    },
    {
      id: "ta-bamberin",
      name: "Ta' Bamberin",
      category: "beaches",
      description:
        "Mini fjord with crystal-clear water between Barbaggan and Ħondoq. Rocky beach with swimming ladder. Like a private cove. 300m walk from either neighboring beach.",
      distance: "Qala",
      googleMapsQuery: "Ta Bamberin, Gozo, Malta",
      badge: "Hidden Cove",
    },

    // ===== HISTORICAL SITES =====
    {
      id: "ggantija-historical",
      name: "Ġgantija Temples",
      category: "historical",
      description:
        "UNESCO World Heritage temples from 3600-3200 BC — older than Stonehenge and the Egyptian pyramids. Two temple units with massive megaliths. Excellent modern visitor center with multimedia exhibits.",
      priceRange: "€",
      distance: "Xagħra",
      googleMapsQuery: "Ggantija Temples, Xaghra, Gozo, Malta",
      badge: "UNESCO",
    },
    {
      id: "citadella-historical",
      name: "The Citadella",
      category: "historical",
      description:
        "Bronze Age origins, fortified by Phoenicians, Romans, Arabs, and Knights. Cathedral of the Assumption, old prison, and several small museums. Free to walk the walls and streets.",
      distance: "Victoria",
      googleMapsQuery: "Citadella, Victoria, Gozo, Malta",
    },
    {
      id: "ta-pinu-basilica",
      name: "Ta' Pinu Basilica",
      category: "historical",
      description:
        "Malta's national shrine — stunning neo-Romanesque basilica in the countryside. Built after reported Marian apparitions in 1883. Peaceful setting surrounded by fields. Free entry.",
      distance: "Għarb",
      googleMapsQuery: "Ta' Pinu Basilica, Gozo, Malta",
      badge: "Pilgrimage Site",
    },
    {
      id: "xewkija-rotunda",
      name: "Xewkija Rotunda",
      category: "historical",
      description:
        "One of the world's largest unsupported domes — rivals St. Peter's in Rome. Dominates the Gozo skyline. Climb to the roof terrace for panoramic views. Free entry, donation appreciated.",
      distance: "Xewkija",
      googleMapsQuery: "Xewkija Rotunda, Gozo, Malta",
    },
    {
      id: "calypso-cave",
      name: "Calypso's Cave",
      category: "historical",
      description:
        "Mythological site where the nymph Calypso allegedly held Odysseus for 7 years (per Homer's Odyssey). The cave itself is small, but the viewpoint over Ramla Bay is spectacular.",
      distance: "Above Ramla",
      googleMapsQuery: "Calypso's Cave, Gozo, Malta",
      badge: "Mythology",
    },
    {
      id: "ta-kola-windmill",
      name: "Ta' Kola Windmill",
      category: "historical",
      description:
        "Beautifully preserved 18th-century windmill, one of few surviving in Malta. Now a folk museum showing traditional Gozitan life. Small but charming. Combined ticket with Ġgantija available.",
      priceRange: "€",
      distance: "Xagħra",
      googleMapsQuery: "Ta' Kola Windmill, Xaghra, Gozo, Malta",
    },
    {
      id: "mgarr-ix-xini-tower",
      name: "Mġarr ix-Xini Tower",
      category: "historical",
      description:
        "17th-century watchtower overlooking the dramatic inlet. Part of the Knights' coastal defense network. Photogenic location. Combine with swimming in the bay below.",
      distance: "Mġarr ix-Xini",
      googleMapsQuery: "Mgarr ix-Xini Tower, Gozo, Malta",
    },
    {
      id: "fungus-rock",
      name: "Fungus Rock (Il-Ġebla tal-Ġeneral)",
      category: "historical",
      description:
        "Dramatic 60m limestone islet off Dwejra. Named for the 'Malta fungus' once thought medicinal and guarded by the Knights. No landing allowed but spectacular to photograph.",
      distance: "Dwejra",
      googleMapsQuery: "Fungus Rock, Gozo, Malta",
    },

    // ===== HIKING & WALKS =====
    {
      id: "gozo-coastal-trail",
      name: "Gozo Coastal Trail",
      category: "hiking",
      description:
        "50km trail circumnavigating the entire island — can be done in 3 days or broken into sections. Dramatic cliffs, hidden coves, salt pans, and villages. One of the Mediterranean's great walks.",
      distance: "Entire island",
      googleMapsQuery: "Gozo Coastal Trail, Malta",
      badge: "Epic Trek",
    },
    {
      id: "xwejni-ghasri-walk",
      name: "Xwejni to Wied il-Għasri Walk",
      category: "hiking",
      description:
        "Easy 2km coastal walk passing salt pans and ending at the dramatic Għasri canyon. Beautiful photography opportunities. Can swim at the end. Best in morning or late afternoon light.",
      distance: "North coast",
      googleMapsQuery: "Xwejni Salt Pans, Gozo, Malta",
      badge: "Easy Walk",
    },
    {
      id: "xlendi-sanap-cliffs",
      name: "Xlendi to Sanap Cliffs Walk",
      category: "hiking",
      description:
        "Spectacular cliff walk with dramatic drops and stunning views. Watch for peregrine falcons. One of Gozo's most scenic trails. About 4km round trip. Moderate difficulty.",
      distance: "Xlendi",
      googleMapsQuery: "Sanap Cliffs, Gozo, Malta",
      badge: "Scenic",
    },
    {
      id: "mgarr-hondoq-walk",
      name: "Mġarr Harbour to Ħondoq Walk",
      category: "hiking",
      description:
        "Coastal walk from the ferry terminal to Ħondoq Bay via Barbaggan Rocks. Mediterranean scrubland, cliff views, multiple swimming stops. About 1 hour, easy-moderate.",
      distance: "East coast",
      googleMapsQuery: "Mgarr Harbour, Gozo, Malta",
    },
    {
      id: "dwejra-hike",
      name: "Dwejra Coastal Hike",
      category: "hiking",
      description:
        "Explore the dramatic west coast around Dwejra — Azure Window site, Blue Hole, Inland Sea, and beyond. Moonscape terrain. Can extend to San Lawrenz. Watch footing near cliff edges.",
      distance: "West coast",
      googleMapsQuery: "Dwejra, Gozo, Malta",
    },
    {
      id: "wied-il-mielah",
      name: "Wied il-Mielaħ Window Walk",
      category: "hiking",
      description:
        "Walk to a natural rock window less touristy than the former Azure Window. Stunning coastal scenery. Off-the-beaten-path Gozo at its best. Near Għarb village.",
      distance: "Near Għarb",
      googleMapsQuery: "Wied il-Mielah Window, Gozo, Malta",
      badge: "Hidden Gem",
    },
    {
      id: "ta-cenc-cliffs",
      name: "Ta' Ċenċ Cliffs Walk",
      category: "hiking",
      description:
        "Gozo's highest cliffs (130m) with cart ruts, dolmens, and breathtaking views. Wild and dramatic landscape. Popular at sunset. About 3km from Sannat village.",
      distance: "Sannat",
      googleMapsQuery: "Ta' Cenc Cliffs, Gozo, Malta",
      badge: "Dramatic Views",
    },
    {
      id: "salt-pans-walk",
      name: "Marsalforn Salt Pans",
      category: "hiking",
      description:
        "Walk along 350-year-old salt pans carved into the rock — still harvested today. Best at golden hour when the checkerboard pattern glows. Can combine with Xwejni-Għasri walk.",
      distance: "North coast",
      googleMapsQuery: "Salt Pans, Marsalforn, Gozo, Malta",
      badge: "Unique Landscape",
    },

    // ===== DIVING & SNORKELING =====
    {
      id: "blue-hole-dive",
      name: "Blue Hole",
      category: "diving",
      description:
        "World-famous dive site — 15m vertical chimney dropping through rock into open sea. Jacques Cousteau called it one of Europe's best dives. All levels welcome. Also great for snorkeling.",
      priceRange: "€€",
      distance: "Dwejra",
      googleMapsQuery: "Blue Hole, Dwejra, Gozo, Malta",
      badge: "World Famous",
    },
    {
      id: "inland-sea-dive",
      name: "Inland Sea Tunnel",
      category: "diving",
      description:
        "Swim through an 80m tunnel from the enclosed lagoon to the open Mediterranean. Stunning light effects as you emerge. Suitable for snorkelers in calm conditions too. Magical experience.",
      priceRange: "€€",
      distance: "Dwejra",
      googleMapsQuery: "Inland Sea, Gozo, Malta",
      badge: "Unique Experience",
    },
    {
      id: "double-arch",
      name: "Double Arch Reef",
      category: "diving",
      description:
        "Two natural arches at 20-30m depth near Dwejra. Swim-throughs, abundant marine life. Part of the Dwejra dive complex. For intermediate to advanced divers.",
      priceRange: "€€",
      distance: "Dwejra",
      googleMapsQuery: "Double Arch, Dwejra, Gozo, Malta",
    },
    {
      id: "xlendi-reef",
      name: "Xlendi Reef & Cave",
      category: "diving",
      description:
        "Easy shore dive with reef, cave system, and tunnel. Good for beginners with interesting features for experienced divers. Marine life includes octopus, moray eels, and groupers.",
      priceRange: "€€",
      distance: "Xlendi",
      googleMapsQuery: "Xlendi diving, Gozo, Malta",
    },
    {
      id: "xatt-lahmar-wrecks",
      name: "Xatt l-Aħmar Wrecks",
      category: "diving",
      description:
        "Three former Gozo-Malta ferries scuttled at 40m — MV Xlendi, MV Cominoland, MV Karwela. Impressive wreck diving for advanced divers. Technical diving heaven.",
      priceRange: "€€€",
      distance: "East coast",
      googleMapsQuery: "Xatt l-Ahmar diving, Gozo, Malta",
      badge: "Wreck Diving",
    },
    {
      id: "billinghurst-cave",
      name: "Billinghurst Cave",
      category: "diving",
      description:
        "Dramatic cavern dive with beautiful light effects. Named after a British archaeologist who explored it. 20-30m depth. Part of the Cathedral Cave complex near San Lawrenz.",
      priceRange: "€€",
      distance: "San Lawrenz",
      googleMapsQuery: "Billinghurst Cave diving, Gozo, Malta",
    },

    // ===== HIDDEN GEMS & SECRET SPOTS =====
    {
      id: "wied-il-mielah-window",
      name: "Wied il-Mielaħ Window",
      category: "hidden-gems",
      description:
        "Natural rock arch that's Gozo's answer to the collapsed Azure Window — but far fewer tourists know about it. Stunning photography spot near Għarb. Walk down from the road.",
      distance: "Near Għarb",
      googleMapsQuery: "Wied il-Mielah Window, Gozo, Malta",
      badge: "Secret Window",
    },
    {
      id: "ta-cenc-restaurant",
      name: "Ta' Ċenċ Il-Kantra",
      category: "hidden-gems",
      description:
        "Cliffside restaurant at Mġarr ix-Xini with a private-feeling rocky inlet below for swimming. Fresh Mediterranean food, stunning views. Rents sunbeds in summer. Call ahead for hours.",
      priceRange: "€€",
      distance: "Mġarr ix-Xini",
      googleMapsQuery: "Ta' Ċenċ Il-Kantra, Gozo, Malta",
      badge: "Secret Restaurant",
    },
    {
      id: "xwejni-salt-pans",
      name: "Xwejni Salt Pans",
      category: "hidden-gems",
      description:
        "350-year-old salt pans still used today — families collect sea salt each summer. Geometric checkerboard pattern carved into rock. Spectacular at sunset. Most visitors skip this.",
      distance: "Marsalforn",
      googleMapsQuery: "Xwejni Salt Pans, Gozo, Malta",
      badge: "Living History",
    },
    {
      id: "ix-xtajta-hidden",
      name: "Ix-Xtajta Beach",
      category: "hidden-gems",
      description:
        "Possibly Gozo's best-kept secret — unique rocky beach with natural pools and circular rock formations. Even locals rarely visit. 15-min walk from parking. Bring everything, no facilities.",
      distance: "Near Ramla",
      googleMapsQuery: "Ix-Xtajta Beach, Gozo, Malta",
      badge: "True Secret",
    },
    {
      id: "calypso-viewpoint",
      name: "Calypso Cave Viewpoint",
      category: "hidden-gems",
      description:
        "Skip the small cave — the viewpoint above offers one of Gozo's best panoramas over Ramla Bay. Especially magical at sunset when the red sand glows. Easy access by car.",
      distance: "Above Ramla",
      googleMapsQuery: "Calypso's Cave Viewpoint, Gozo, Malta",
      badge: "Best View",
    },
    {
      id: "gharb-village",
      name: "Għarb Village",
      category: "hidden-gems",
      description:
        "One of Gozo's most traditional and picturesque villages. Baroque church, craft shops, and Ta' Dbiegi Craft Village nearby. Time slows down here. Perfect for a quiet wander.",
      distance: "West Gozo",
      googleMapsQuery: "Gharb, Gozo, Malta",
      badge: "Traditional Village",
    },
    {
      id: "lunzjata-valley",
      name: "Lunzjata Valley",
      category: "hidden-gems",
      description:
        "Fertile valley with ancient washing pools and baroque chapel. Rarely visited — you'll likely have it to yourself. Green oasis in the otherwise arid landscape. Near Victoria.",
      distance: "Near Victoria",
      googleMapsQuery: "Lunzjata Valley, Gozo, Malta",
      badge: "Peaceful Escape",
    },
    {
      id: "mgarr-ix-xini-valley",
      name: "Mġarr ix-Xini Valley Drive",
      category: "hidden-gems",
      description:
        "The winding road down to Mġarr ix-Xini bay is a sightseeing trip itself. Dramatic valley walls, fig trees, and glimpses of the sea. Stop for photos before reaching the bay.",
      distance: "South Gozo",
      googleMapsQuery: "Mgarr ix-Xini Valley, Gozo, Malta",
    },
    {
      id: "zebbug-village",
      name: "Żebbuġ Village",
      category: "hidden-gems",
      description:
        "Quiet hilltop village with one of Gozo's oldest churches. Stunning views, friendly locals, zero tourists. The kind of place where time truly stops. Perfect sunset spot.",
      distance: "Northwest Gozo",
      googleMapsQuery: "Zebbug, Gozo, Malta",
    },
    {
      id: "gozitan-farmhouses",
      name: "Stay in a Gozitan Farmhouse",
      category: "hidden-gems",
      description:
        "Convert farmhouses with private pools are Gozo's best accommodation secret. Experience authentic Gozitan architecture with modern comfort. Book direct for best rates. Many in Għarb and Xagħra.",
      priceRange: "€€€",
      distance: "Various",
      googleMapsQuery: "Gozo farmhouse accommodation",
      badge: "Unique Stay",
    },
  ],
  localInsights: [
    "Gozo is Malta's quieter, greener sister island — the pace is noticeably slower and more relaxed",
    "Rent a car at Mġarr when you arrive. The island is small but public transport is limited and you'll miss the best spots without wheels",
    "The ferry runs every 45 minutes and you pay on the return trip only (€4.65 per person, cars extra). Last ferry around 10pm",
    "Ġgantija temples are older than Stonehenge and the pyramids — book the combined ticket with Ta' Kola Windmill for context",
    "Tal-Mixta Cave is best at sunset — arrive 30 min before for the golden light hitting Ramla Bay",
    "For authentic ftira (Gozitan pizza), skip restaurants and go to Maxokk or Mekren bakery in Nadur. Take it to Ramla Beach",
    "San Blas Bay has similar red sand to Ramla but way fewer people — the steep walk keeps crowds away",
    "The Blue Hole at Dwejra is snorkel-able, not just for divers — but only in calm conditions",
    "Stay overnight if you can. Day-trippers miss the magic of Gozo after the last ferry crowd leaves",
    "Wied il-Għasri is Gozo's most photogenic spot — the water is calm for swimming even when seas are rough elsewhere",
    "The salt pans at Xwejni are still used today — families collect salt each summer just like 350 years ago",
    "Ta' Frenċ is Gozo's best fine dining (Michelin-listed) — worth the splurge and needs advance booking",
    "Gozo farmhouses with private pools are the island's best accommodation — far better than hotels",
    "The Citadella in Victoria is free to walk around. Go at sunset for golden light and 360° views",
    "Ix-Xtajta near Ramla is a true local secret — you might have this incredible beach completely to yourself",
    "Gozo's dive sites (Blue Hole, Inland Sea tunnel) are world-class — even a discover dive is worth it for non-divers",
    "The 50km coastal trail can be walked in 3 days — one of the Mediterranean's great multi-day walks",
    "Village festas (patron saint festivals) in summer are incredible — check dates and experience authentic Gozitan celebration",
  ],
};
