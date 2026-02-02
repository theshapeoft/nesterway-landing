import type { Area } from "@/types";

export const maltaIslandArea: Area = {
  slug: "malta-island",
  name: "Malta",
  countrySlug: "malta",
  countryName: "Malta",
  tagline: "7,000 years of history meets Mediterranean charm",
  heroImageUrl: "/images/areas/malta-hero.jpg",
  vibe: "A sun-drenched island where ancient temples, golden limestone cities, and turquoise waters create an unforgettable Mediterranean escape",
  bestFor: ["History", "Beaches", "Diving", "Food", "Photography", "Walking"],
  gettingAround: "Buses connect all major towns (€2 single, €21 weekly pass). Ferries to Gozo from Ċirkewwa (30 min). Grab/Bolt available. Rent a car for hidden gems — drive on the left!",
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
      recommendationCount: 18,
    },
    {
      slug: "beaches",
      name: "Beaches & Swimming",
      icon: "waves",
      recommendationCount: 14,
    },
    {
      slug: "historical",
      name: "Historical Sites",
      icon: "landmark",
      recommendationCount: 8,
    },
    {
      slug: "day-trips",
      name: "Day Trips & Excursions",
      icon: "compass",
      recommendationCount: 6,
    },
    {
      slug: "nightlife",
      name: "Nightlife",
      icon: "moon",
      recommendationCount: 6,
    },
    {
      slug: "hidden-gems",
      name: "Hidden Gems & Secret Spots",
      icon: "gem",
      recommendationCount: 15,
    },
    {
      slug: "diving",
      name: "Diving & Snorkeling",
      icon: "anchor",
      recommendationCount: 6,
    },
  ],
  recommendations: [
    // ===== MUST-SEE ATTRACTIONS =====
    {
      id: "valletta-city",
      name: "Valletta Old Town",
      category: "must-see",
      description:
        "Europe's smallest capital and a UNESCO World Heritage Site. Wander honey-colored Baroque streets, grand palaces, and stop for pastizzi at every corner. Start at City Gate and work your way to Fort St Elmo.",
      distance: "Central",
      googleMapsQuery: "City Gate, Valletta, Malta",
      badge: "UNESCO",
    },
    {
      id: "upper-barrakka",
      name: "Upper Barrakka Gardens",
      category: "must-see",
      description:
        "The best viewpoint in Malta. Watch the ceremonial cannon firing at noon and 4pm, with panoramic views across Grand Harbour to the Three Cities. Free entry, stunning at sunset.",
      distance: "Valletta",
      googleMapsQuery: "Upper Barrakka Gardens, Valletta, Malta",
      badge: "Free",
    },
    {
      id: "mdina",
      name: "Mdina - The Silent City",
      category: "must-see",
      description:
        "Malta's ancient walled capital, virtually car-free and hauntingly beautiful. Best visited early morning or evening when the tour groups leave. Don't miss the cathedral and the view from Bastion Square.",
      distance: "20 min from Valletta",
      googleMapsQuery: "Mdina Gate, Mdina, Malta",
      badge: "Must Visit",
    },
    {
      id: "blue-lagoon",
      name: "Blue Lagoon, Comino",
      category: "must-see",
      description:
        "Crystal-clear turquoise waters so vivid they look photoshopped. Gets crowded by 11am in summer — take the first ferry at 9am or visit in shoulder season. Bring snorkel gear!",
      distance: "Ferry from Ċirkewwa",
      googleMapsQuery: "Blue Lagoon, Comino, Malta",
      badge: "Iconic",
    },
    {
      id: "three-cities",
      name: "The Three Cities",
      category: "must-see",
      description:
        "Vittoriosa, Senglea, and Cospicua — older than Valletta and less touristy. Explore by foot or electric buggy (Rolling Geeks). Fort St Angelo has incredible harbour views.",
      distance: "Ferry from Valletta (5 min)",
      googleMapsQuery: "Vittoriosa, Malta",
    },
    {
      id: "blue-grotto",
      name: "Blue Grotto",
      category: "must-see",
      description:
        "Seven sea caves with impossibly blue water reflections. Take a 30-minute luzzu (traditional boat) tour from Wied iż-Żurrieq. Best in morning light. Cash only for boat tickets.",
      priceRange: "€",
      distance: "30 min from Valletta",
      googleMapsQuery: "Blue Grotto, Malta",
    },
    {
      id: "popeye-village",
      name: "Popeye Village",
      category: "must-see",
      description:
        "The colorful film set from the 1980 Robin Williams movie, now a quirky theme park. Fun for families, great photo ops. Includes beach access, boat rides, and entertainment.",
      priceRange: "€€",
      distance: "Anchor Bay, Mellieħa",
      googleMapsQuery: "Popeye Village, Malta",
    },
    {
      id: "hagar-qim",
      name: "Ħaġar Qim & Mnajdra Temples",
      category: "must-see",
      description:
        "UNESCO megalithic temples older than Stonehenge and the Egyptian pyramids (3600-2500 BC). The coastal setting is stunning. Combined ticket includes both sites and a small museum.",
      priceRange: "€",
      distance: "25 min from Valletta",
      googleMapsQuery: "Ħaġar Qim, Malta",
      badge: "UNESCO",
    },
    {
      id: "st-johns-cathedral",
      name: "St. John's Co-Cathedral",
      category: "must-see",
      description:
        "Plain exterior hides one of Europe's most ornate Baroque interiors. Includes Caravaggio's largest painting. Book tickets online to skip queues. No shorts or bare shoulders.",
      priceRange: "€",
      distance: "Valletta",
      googleMapsQuery: "St. John's Co-Cathedral, Valletta, Malta",
    },
    {
      id: "gozo-island",
      name: "Gozo Island",
      category: "must-see",
      description:
        "Malta's quieter, greener sister island. See the Citadella, Dwejra's Inland Sea, and Ramla Bay's red sand. Worth a full day or overnight stay. Ferries run every 45 min.",
      distance: "25 min ferry from Ċirkewwa",
      googleMapsQuery: "Victoria, Gozo, Malta",
      badge: "Day Trip",
    },

    // ===== FOOD & DRINK =====
    {
      id: "lapira",
      name: "La Pira Maltese Kitchen",
      category: "food-drink",
      cuisineType: "Maltese Traditional",
      description:
        "Michelin Bib Gourmand winner serving authentic Maltese cuisine in Valletta. Try the rabbit (fenek), octopus, and braġjoli. Family-run, book ahead. One of Malta's best.",
      priceRange: "€€",
      distance: "Valletta",
      googleMapsQuery: "La Pira Maltese Kitchen, Valletta, Malta",
      badge: "Bib Gourmand",
    },
    {
      id: "ta-kris",
      name: "Ta' Kris Restaurant",
      category: "food-drink",
      cuisineType: "Maltese Traditional",
      description:
        "No-frills, family-run spot in Sliema serving the best rabbit stew in Malta. Cash only, no reservations — just queue like the locals. The ftira bread is incredible.",
      priceRange: "€€",
      distance: "Sliema",
      googleMapsQuery: "Ta' Kris Restaurant, Sliema, Malta",
      badge: "Local Favorite",
    },
    {
      id: "noni",
      name: "Noni Restaurant",
      category: "food-drink",
      cuisineType: "Modern Maltese",
      description:
        "Chef Jonathan Brincat's Michelin-starred restaurant in Valletta. Modern Maltese tasting menus with wine pairings. Book well in advance — Malta's finest dining experience.",
      priceRange: "€€€€",
      distance: "Valletta",
      googleMapsQuery: "Noni Restaurant, Valletta, Malta",
      badge: "Michelin Star",
    },
    {
      id: "ta-detta",
      name: "Ta' Detta",
      category: "food-drink",
      cuisineType: "Maltese Traditional",
      description:
        "Charming restaurant named after the owners' late sister. Traditional recipes with a modern touch. The stuffed vegetables and fish of the day are exceptional.",
      priceRange: "€€",
      distance: "Valletta",
      googleMapsQuery: "Ta' Detta Restaurant, Valletta, Malta",
    },
    {
      id: "pastizzi-crystal",
      name: "Crystal Palace (Is-Serkin)",
      category: "food-drink",
      cuisineType: "Pastizzi",
      description:
        "Malta's most famous pastizzi shop, open since 1956. Try ricotta (tal-irkotta) and pea (tal-piżelli) versions. Just €0.50 each — eat standing at the counter like everyone else.",
      priceRange: "€",
      distance: "Rabat",
      googleMapsQuery: "Crystal Palace, Rabat, Malta",
      badge: "Must Try",
    },
    {
      id: "fontanella",
      name: "Fontanella Tea Garden",
      category: "food-drink",
      cuisineType: "Café",
      description:
        "Famous for having the best chocolate cake in Malta, with jaw-dropping views from Mdina's walls. Perfect afternoon stop. The views alone are worth the visit.",
      priceRange: "€€",
      distance: "Mdina",
      googleMapsQuery: "Fontanella Tea Garden, Mdina, Malta",
    },
    {
      id: "giuseppi",
      name: "Giuseppi's Bar & Bistro",
      category: "food-drink",
      cuisineType: "Seafood & Mediterranean",
      description:
        "Waterfront dining in Marsaxlokk fishing village. Fresh fish chosen from the display, grilled simply. Sunday is market day — combine lunch with browsing the stalls.",
      priceRange: "€€",
      distance: "Marsaxlokk",
      googleMapsQuery: "Giuseppi's Restaurant, Marsaxlokk, Malta",
    },
    {
      id: "cafe-cordina",
      name: "Caffè Cordina",
      category: "food-drink",
      cuisineType: "Café & Pastries",
      description:
        "Valletta's grand dame café, open since 1837. Sit in Republic Square for people-watching, try the signature kwarezimal (almond Lenten biscuits) and excellent espresso.",
      priceRange: "€€",
      distance: "Valletta",
      googleMapsQuery: "Caffè Cordina, Valletta, Malta",
    },
    {
      id: "trabuxu",
      name: "Trabuxu Wine Bar",
      category: "food-drink",
      cuisineType: "Wine Bar",
      description:
        "Atmospheric wine bar in a converted well shaft (trabuxu means corkscrew). Excellent Maltese wine selection, cheese platters, and live jazz some evenings.",
      priceRange: "€€",
      distance: "Valletta",
      googleMapsQuery: "Trabuxu Wine Bar, Valletta, Malta",
    },
    {
      id: "bridge-bar",
      name: "Bridge Bar",
      category: "food-drink",
      cuisineType: "Bar & Jazz",
      description:
        "Friday night live jazz on Valletta's famous steps. Grab a drink, sit on the colorful cushions outside, and enjoy the atmosphere. Music from 8:30pm.",
      priceRange: "€€",
      distance: "Valletta",
      googleMapsQuery: "Bridge Bar, Valletta, Malta",
    },
    {
      id: "cisk-lager",
      name: "Try Cisk Lager",
      category: "food-drink",
      cuisineType: "Local Beer",
      description:
        "Malta's beloved local beer since 1929. Try the original Cisk Lager or Cisk Excel (low-carb). Best enjoyed ice-cold at any waterfront bar watching the sunset.",
      priceRange: "€",
      distance: "Everywhere",
      googleMapsQuery: "Farsons Brewery, Malta",
    },
    {
      id: "kinnie",
      name: "Kinnie - Malta's National Drink",
      category: "food-drink",
      cuisineType: "Soft Drink",
      description:
        "Bitter orange soft drink unique to Malta — an acquired taste but beloved locally. Try it with vodka (Kinnie & Vodka) at any bar. The diet version is called Kinnie Zest.",
      priceRange: "€",
      distance: "Everywhere",
      googleMapsQuery: "Malta",
    },
    {
      id: "root-81",
      name: "Root 81",
      category: "food-drink",
      cuisineType: "Modern Maltese",
      description:
        "Michelin-listed restaurant in a beautifully restored Rabat farmhouse. Chef Robert Cassar's tasting menus showcase local ingredients with creative flair. Book the Balcony Experience for special occasions.",
      priceRange: "€€€€",
      distance: "Rabat",
      googleMapsQuery: "Root 81 Restaurant, Rabat, Malta",
      badge: "Michelin Guide",
    },
    {
      id: "harbour-club",
      name: "The Harbour Club",
      category: "food-drink",
      cuisineType: "Mediterranean",
      description:
        "Michelin-listed harbourside restaurant with creative dishes and stunning Grand Harbour views. Book an outside table in summer. Consistently excellent food and wine selection.",
      priceRange: "€€€",
      distance: "Valletta",
      googleMapsQuery: "The Harbour Club, Valletta, Malta",
      badge: "Michelin Guide",
    },
    {
      id: "aki-valletta",
      name: "Aki",
      category: "food-drink",
      cuisineType: "Japanese",
      description:
        "Valletta's top spot for contemporary Japanese. Excellent sushi, sashimi platters, and creative rolls. The Kawaii cocktail is a showstopper. Michelin-listed for good reason.",
      priceRange: "€€€",
      distance: "Valletta (Strait Street)",
      googleMapsQuery: "Aki Restaurant, Valletta, Malta",
      badge: "Michelin Guide",
    },
    {
      id: "amami",
      name: "Amami",
      category: "food-drink",
      cuisineType: "Japanese",
      description:
        "Rare find: authentic Japanese cuisine done right in Malta. Seaside location at Għadira Bay, high-quality dishes. If you're craving Asian food, this is the place.",
      priceRange: "€€€",
      distance: "Mellieħa",
      googleMapsQuery: "Amami Restaurant, Mellieħa, Malta",
    },
    {
      id: "ion-harbour",
      name: "ION Harbour",
      category: "food-drink",
      cuisineType: "Fine Dining",
      description:
        "Malta's pinnacle of fine dining. Set in the Iniala Harbour House 5-star hotel with stunning Grand Harbour views. Mediterranean-European fusion, impeccable service, sommelier-curated wines.",
      priceRange: "€€€€",
      distance: "Valletta",
      googleMapsQuery: "ION Harbour, Valletta, Malta",
      badge: "Michelin Star",
    },

    // ===== BEACHES & SWIMMING =====
    {
      id: "golden-bay",
      name: "Golden Bay",
      category: "beaches",
      description:
        "One of Malta's few sandy beaches with lifeguards, sunbeds, and water sports. Gets busy but worth it. Amazing sunset spot — the Radisson hotel terrace has great sundowner views.",
      distance: "30 min from Valletta",
      googleMapsQuery: "Golden Bay, Malta",
      badge: "Sandy Beach",
    },
    {
      id: "mellieha-bay",
      name: "Mellieħa Bay (Għadira)",
      category: "beaches",
      description:
        "Malta's largest sandy beach — shallow water makes it perfect for families with kids. Beach bars, water sports, and good facilities. Can feel crowded in peak summer.",
      distance: "35 min from Valletta",
      googleMapsQuery: "Mellieħa Bay, Malta",
    },
    {
      id: "ramla-bay",
      name: "Ramla Bay (Gozo)",
      category: "beaches",
      description:
        "Gozo's most famous beach with distinctive red-orange sand. Calypso's Cave overlooks the bay (allegedly where Odysseus was held captive). Less crowded than mainland beaches.",
      distance: "Gozo",
      googleMapsQuery: "Ramla Bay, Gozo, Malta",
      badge: "Red Sand",
    },
    {
      id: "st-peters-pool",
      name: "St. Peter's Pool",
      category: "beaches",
      description:
        "Natural swimming pool carved into limestone cliffs — Instagram famous for good reason. No sand, just flat rocks for sunbathing. Jump off the cliffs if you dare. No facilities.",
      distance: "Marsaxlokk area",
      googleMapsQuery: "St. Peter's Pool, Malta",
      badge: "Hidden Gem",
    },
    {
      id: "paradise-bay",
      name: "Paradise Bay",
      category: "beaches",
      description:
        "Small sandy cove near the Gozo ferry terminal. Great for a swim before or after your Gozo trip. Beach bar, sunbeds available. Gets crowded but manageable.",
      distance: "Ċirkewwa",
      googleMapsQuery: "Paradise Bay, Malta",
    },
    {
      id: "riviera-bay",
      name: "Riviera Bay (Għajn Tuffieħa)",
      category: "beaches",
      description:
        "Golden Bay's quieter neighbor — 200 steps down but worth it. More natural setting, less developed. Popular with locals. The climb back up is a workout!",
      distance: "30 min from Valletta",
      googleMapsQuery: "Għajn Tuffieħa Bay, Malta",
    },
    {
      id: "sliema-rocky",
      name: "Sliema Rocky Beach & Promenade",
      category: "beaches",
      description:
        "Not a sandy beach, but locals swim off the rocks using ladders. The 3km promenade walk to St. Julian's is iconic. Great for sunset, waterfront dining, and people-watching.",
      distance: "Sliema",
      googleMapsQuery: "Sliema Promenade, Malta",
      badge: "Local Spot",
    },
    {
      id: "wied-il-ghasri",
      name: "Wied il-Għasri",
      category: "beaches",
      description:
        "Dramatic narrow inlet on Gozo's north coast — like swimming in a natural fjord. Crystal clear water, perfect for snorkeling. Rocky access, bring water shoes. Rarely crowded.",
      distance: "Gozo",
      googleMapsQuery: "Wied il-Għasri, Gozo, Malta",
      badge: "Secret Spot",
    },
    {
      id: "kalanka",
      name: "Kalanka Bay",
      category: "beaches",
      description:
        "Beautiful rocky bay near Marsaxlokk, often overlooked for the more famous St. Peter's Pool next door. Just as stunning but far more peaceful. Deep, clear water perfect for jumping in.",
      distance: "Delimara",
      googleMapsQuery: "Kalanka Bay, Malta",
      badge: "Hidden Gem",
    },
    {
      id: "mgiebah",
      name: "Mġiebaħ Bay",
      category: "beaches",
      description:
        "Secluded north-facing beach with golden sands and crystal waters. Requires a hike down a winding path past bamboo groves — that's what keeps the crowds away. Worth the effort.",
      distance: "Near Mellieħa",
      googleMapsQuery: "Mgiebah Bay, Malta",
      badge: "Secret Beach",
    },
    {
      id: "fomm-ir-rih",
      name: "Fomm ir-Riħ",
      category: "beaches",
      description:
        "Remote pebble beach with dramatic cliff scenery on Malta's wild west coast. Excellent snorkeling with abundant marine life on the submerged rocks. Long walk down — bring water.",
      distance: "West coast",
      googleMapsQuery: "Fomm ir-Rih, Malta",
      badge: "Off the Beaten Path",
    },
    {
      id: "coral-lagoon",
      name: "Coral Lagoon",
      category: "beaches",
      description:
        "Hidden swimming spot near Mellieħa that most tourists miss. Natural rock pool with beautiful coral-colored rocks. Locals' favorite — you won't find this in most guidebooks.",
      distance: "Mellieħa area",
      googleMapsQuery: "Coral Lagoon, Malta",
      badge: "Local Secret",
    },
    {
      id: "mgarr-ix-xini",
      name: "Mġarr ix-Xini",
      category: "beaches",
      description:
        "Picturesque Gozo bay at the end of a scenic valley — the road there is a sightseeing trip itself. Famous as the filming location for 'By The Sea' (Brad Pitt & Angelina Jolie).",
      distance: "Gozo",
      googleMapsQuery: "Mgarr ix-Xini, Gozo, Malta",
      badge: "Film Location",
    },

    // ===== HISTORICAL SITES =====
    {
      id: "lascaris-war-rooms",
      name: "Lascaris War Rooms",
      category: "historical",
      description:
        "Secret WWII underground command center 40m below Valletta. Guided tours reveal where Allied forces coordinated Malta's defense. Fascinating for history buffs.",
      priceRange: "€",
      distance: "Valletta",
      googleMapsQuery: "Lascaris War Rooms, Valletta, Malta",
    },
    {
      id: "fort-st-elmo",
      name: "Fort St. Elmo & War Museum",
      category: "historical",
      description:
        "Star-shaped fort at the tip of Valletta, famous for the Great Siege of 1565. Now houses the National War Museum. Incredible views and military history.",
      priceRange: "€",
      distance: "Valletta",
      googleMapsQuery: "Fort St. Elmo, Valletta, Malta",
    },
    {
      id: "mosta-dome",
      name: "Mosta Dome (Rotunda)",
      category: "historical",
      description:
        "One of the world's largest unsupported domes. Famous for the WWII miracle — a German bomb crashed through during mass but didn't explode. The replica bomb is on display.",
      distance: "Mosta",
      googleMapsQuery: "Mosta Dome, Malta",
      badge: "Free",
    },
    {
      id: "hypogeum",
      name: "Ħal Saflieni Hypogeum",
      category: "historical",
      description:
        "Underground prehistoric burial site carved 5,000 years ago — only 80 visitors per day allowed. Book 4-6 weeks ahead online. UNESCO World Heritage Site. Unmissable.",
      priceRange: "€€",
      distance: "Paola",
      googleMapsQuery: "Hypogeum, Malta",
      badge: "Book Ahead",
    },
    {
      id: "grandmasters-palace",
      name: "Grandmaster's Palace & Armoury",
      category: "historical",
      description:
        "Former seat of the Knights of Malta, now houses an impressive armoury with 6,000+ pieces. State rooms feature original Gobelin tapestries. In the heart of Valletta.",
      priceRange: "€",
      distance: "Valletta",
      googleMapsQuery: "Grandmaster's Palace, Valletta, Malta",
    },
    {
      id: "tarxien-temples",
      name: "Tarxien Temples",
      category: "historical",
      description:
        "Complex of four megalithic temples (3600-2500 BC) with intricate stone carvings. More accessible than Ħaġar Qim. UNESCO World Heritage Site.",
      priceRange: "€",
      distance: "Tarxien",
      googleMapsQuery: "Tarxien Temples, Malta",
      badge: "UNESCO",
    },
    {
      id: "citadella-gozo",
      name: "The Citadella (Gozo)",
      category: "historical",
      description:
        "Fortified citadel towering over Gozo's capital Victoria. Walk the ramparts for 360° views of the island. Cathedral, museums, and atmospheric narrow streets inside.",
      distance: "Victoria, Gozo",
      googleMapsQuery: "Citadella, Victoria, Gozo, Malta",
    },
    {
      id: "ghar-dalam",
      name: "Għar Dalam Cave & Museum",
      category: "historical",
      description:
        "Cave of Darkness — 145m cave with fossils up to 500,000 years old, including dwarf elephants. Small museum displays bones and teeth. Quick but interesting visit.",
      priceRange: "€",
      distance: "Birżebbuġa",
      googleMapsQuery: "Għar Dalam, Malta",
    },

    // ===== DAY TRIPS & EXCURSIONS =====
    {
      id: "gozo-day-trip",
      name: "Full Day Gozo Trip",
      category: "day-trips",
      description:
        "Take the ferry from Ċirkewwa, rent a car/quad in Mġarr, see the Citadella, swim at Ramla Bay, lunch in Xlendi, visit Dwejra. Return on evening ferry. Or stay overnight!",
      distance: "Full day",
      googleMapsQuery: "Gozo Ferry Terminal, Mġarr, Malta",
      badge: "Essential",
    },
    {
      id: "comino-trip",
      name: "Comino & Blue Lagoon Boat Trip",
      category: "day-trips",
      description:
        "Half-day or full-day trips from Sliema, Buġibba, or Ċirkewwa. Includes swimming time at Blue Lagoon. Some trips include Gozo stop. Book ahead in summer.",
      priceRange: "€€",
      distance: "Half/Full day",
      googleMapsQuery: "Blue Lagoon, Comino, Malta",
    },
    {
      id: "marsaxlokk-sunday",
      name: "Marsaxlokk Sunday Market",
      category: "day-trips",
      description:
        "Traditional fishing village with colorful luzzu boats. Sunday market sells fish, local produce, souvenirs. Have lunch at a waterfront restaurant. Arrive early to avoid crowds.",
      distance: "25 min from Valletta",
      googleMapsQuery: "Marsaxlokk, Malta",
      badge: "Sundays",
    },
    {
      id: "dingli-cliffs",
      name: "Dingli Cliffs Walk",
      category: "day-trips",
      description:
        "Malta's highest point with dramatic cliff views. Walk along the edge at sunset, stop at Diar il-Bniet restaurant for farm-to-table Maltese food. Peaceful and uncrowded.",
      distance: "25 min from Valletta",
      googleMapsQuery: "Dingli Cliffs, Malta",
      badge: "Free",
    },
    {
      id: "diving-trip",
      name: "Scuba Diving Experience",
      category: "day-trips",
      description:
        "Malta has some of Europe's best diving — clear water, WWII wrecks, caves, and marine life. Try the Blue Hole (Gozo), Um El Faroud wreck, or Cirkewwa arch. Many PADI schools.",
      priceRange: "€€",
      distance: "Various locations",
      googleMapsQuery: "Dive Systems Malta",
    },
    {
      id: "sicily-day-trip",
      name: "Day Trip to Sicily",
      category: "day-trips",
      description:
        "Take the fast ferry from Valletta to Pozzallo, Sicily (90 min). Visit Ragusa, Syracuse, or Catania. Book round-trip tickets with Virtu Ferries. Valid ID required.",
      priceRange: "€€€",
      distance: "Full day",
      googleMapsQuery: "Valletta Waterfront, Malta",
    },

    // ===== NIGHTLIFE =====
    {
      id: "paceville",
      name: "Paceville",
      category: "nightlife",
      description:
        "Malta's main party district — concentrated strip of clubs, bars, and late-night spots. Busy Thursday-Sunday, young crowd (18-30s). Drinks are cheap, vibe is chaotic fun.",
      priceRange: "€€",
      distance: "St. Julian's",
      googleMapsQuery: "Paceville, St. Julian's, Malta",
      badge: "Party Hub",
    },
    {
      id: "cafe-del-mar",
      name: "Café del Mar Malta",
      category: "nightlife",
      description:
        "Famous sunset bar/club on the rocks at St. Paul's Bay. Pool parties, international DJs, Ibiza vibes. Best in summer. Book sunbeds for sunset sessions.",
      priceRange: "€€€",
      distance: "Qawra",
      googleMapsQuery: "Café del Mar Malta",
    },
    {
      id: "havana-club",
      name: "Havana Club",
      category: "nightlife",
      description:
        "Iconic club in Paceville — multiple floors, mainstream music, always packed on weekends. The go-to spot for a big night out. Free entry most nights before midnight.",
      priceRange: "€€",
      distance: "Paceville",
      googleMapsQuery: "Havana Club, Paceville, Malta",
    },
    {
      id: "gianpula",
      name: "Gianpula Village",
      category: "nightlife",
      description:
        "Open-air club complex outside the main tourist areas. Multiple venues, pool parties, big-name DJs in summer. Malta's answer to a beach club festival. Worth the taxi.",
      priceRange: "€€€",
      distance: "Rabat area",
      googleMapsQuery: "Gianpula Village, Malta",
    },
    {
      id: "strait-street",
      name: "Strait Street (Strada Stretta)",
      category: "nightlife",
      description:
        "Once Valletta's red-light district, now a bohemian strip of wine bars, jazz venues, and quirky spots. More sophisticated than Paceville. Try Tico Tico or Trabuxu.",
      priceRange: "€€",
      distance: "Valletta",
      googleMapsQuery: "Strait Street, Valletta, Malta",
      badge: "Trendy",
    },
    {
      id: "boat-parties",
      name: "Boat Parties",
      category: "nightlife",
      description:
        "Summer boat parties sail around Comino with DJs, open bar, and swimming stops. Captain Morgan and Luzzu Cruises are popular operators. Book online, bring swimwear.",
      priceRange: "€€",
      distance: "Depart from Sliema",
      googleMapsQuery: "Sliema Ferries, Malta",
    },

    // ===== HIDDEN GEMS & SECRET SPOTS =====
    {
      id: "underground-valletta",
      name: "Underground Valletta",
      category: "hidden-gems",
      description:
        "Valletta's secret underground tunnel system, only opened to the public in 2021. Used for grain storage, troop movement, and WWII bomb shelters. Heritage Malta guided tours reveal the city beneath the city.",
      priceRange: "€€",
      distance: "Valletta",
      googleMapsQuery: "Underground Valletta, Malta",
      badge: "Recently Opened",
    },
    {
      id: "st-paul-hermit-church",
      name: "Church of St Paul The Hermit",
      category: "hidden-gems",
      description:
        "A unique church built inside a natural cave in the Valley of Honey, Mosta. Dating to 1656, it's one of Malta's best-kept secrets. Visit in winter/spring when the valley is lush green.",
      distance: "Mosta",
      googleMapsQuery: "Church of St Paul The Hermit, Mosta, Malta",
      badge: "Cave Church",
    },
    {
      id: "tal-mixta-cave",
      name: "Tal-Mixta Cave",
      category: "hidden-gems",
      description:
        "A natural cave in Gozo that frames Ramla Bay like a window — possibly the most Instagrammed secret spot in Malta. Short walk from Nadur, best at sunset when the bay glows golden.",
      distance: "Nadur, Gozo",
      googleMapsQuery: "Tal-Mixta Cave, Gozo, Malta",
      badge: "Instagram Famous",
    },
    {
      id: "victoria-lines",
      name: "Victoria Lines Hike",
      category: "hidden-gems",
      description:
        "12km British-era fortification wall stretching coast to coast across Malta. Often overlooked, it offers stunning valley views and connects multiple historical forts. Best in cooler months.",
      distance: "Madliena to Binġemma",
      googleMapsQuery: "Victoria Lines, Malta",
      badge: "Epic Hike",
    },
    {
      id: "ghar-lapsi",
      name: "Għar Lapsi",
      category: "hidden-gems",
      description:
        "Natural swimming pool with crystal-clear water, protected from open sea by rock formations. Popular with divers for underwater caves. Just 1km from Blue Grotto but way fewer tourists.",
      distance: "Near Blue Grotto",
      googleMapsQuery: "Għar Lapsi, Malta",
      badge: "Local Favorite",
    },
    {
      id: "wied-babu",
      name: "Wied Babu",
      category: "hidden-gems",
      description:
        "Hidden valley near the Blue Grotto with a secret turquoise pool at the end. Requires a 60-min scramble down — find the metal ladder near Żurrieq. Wear sturdy shoes, bring snorkel gear.",
      distance: "Near Żurrieq",
      googleMapsQuery: "Wied Babu, Malta",
      badge: "Adventure Required",
    },
    {
      id: "fishmermans-cave",
      name: "The Fisherman's Cave",
      category: "hidden-gems",
      description:
        "Magnificent cave opening 80m up a cliff face with Mediterranean views. Short hike but tricky to find the entrance. You can see Filfla island from here. Bring a picnic.",
      distance: "South coast",
      googleMapsQuery: "Fisherman's Cave, Malta",
      badge: "Secret Viewpoint",
    },
    {
      id: "il-maqluba",
      name: "Il-Maqluba",
      category: "hidden-gems",
      description:
        "Collapsed cave sinkhole from 1343 (yes, they kept records!) now a unique ecosystem with rare plants and wildlife. Visit St Matthew's Chapel at the entrance. Peaceful and rarely crowded.",
      distance: "Qrendi",
      googleMapsQuery: "Il-Maqluba, Qrendi, Malta",
      badge: "Natural Wonder",
    },
    {
      id: "buskett-gardens",
      name: "Buskett Gardens",
      category: "hidden-gems",
      description:
        "Malta's only woodland — planted by the Knights as a hunting ground. Home to Verdala Palace (President's summer residence). Perfect escape when you need greenery and shade.",
      distance: "Near Dingli",
      googleMapsQuery: "Buskett Gardens, Malta",
      badge: "Only Forest",
    },
    {
      id: "crystal-lagoon",
      name: "Crystal Lagoon",
      category: "hidden-gems",
      description:
        "Blue Lagoon's quieter, equally stunning cousin on Comino. Natural sea pool connected to open sea via underwater tunnel. Rent a kayak from nearby beaches to explore hidden corners.",
      distance: "Comino",
      googleMapsQuery: "Crystal Lagoon, Comino, Malta",
      badge: "Blue Lagoon Alternative",
    },
    {
      id: "little-armier",
      name: "Little Armier Bay",
      category: "hidden-gems",
      description:
        "Peaceful secret beach in northern Malta — no flashy resorts, no noisy bars. Just calm blue water, soft sand, and sea breeze. The kind of place you find once and keep going back to.",
      distance: "Northern Malta",
      googleMapsQuery: "Little Armier Bay, Malta",
      badge: "Peaceful Escape",
    },
    {
      id: "munxar-arch",
      name: "Munxar Point & Arch",
      category: "hidden-gems",
      description:
        "Stunning limestone arch in Marsaskala with swimming ladders and crystal-clear water. Walk 200m up for white cliff viewpoints. Paddle board or kayak for best views of the cliffs.",
      distance: "Marsaskala",
      googleMapsQuery: "Munxar Point, Marsaskala, Malta",
      badge: "Swim Through",
    },
    {
      id: "ta-cenc-kantra",
      name: "Ta' Ċenċ Il-Kantra",
      category: "hidden-gems",
      description:
        "Cliffside restaurant in Gozo with a private-feeling rocky inlet below for swimming. Fresh Mediterranean cuisine with stunning views. Rents sunbeds in summer. Call ahead for hours.",
      priceRange: "€€",
      distance: "Mġarr ix-Xini, Gozo",
      googleMapsQuery: "Ta' Ċenċ Il-Kantra, Gozo, Malta",
      badge: "Hidden Restaurant",
    },
    {
      id: "xemxija-heritage",
      name: "Xemxija Heritage Trail",
      category: "hidden-gems",
      description:
        "Ancient trail featuring 2000-year-old apiaries (bee houses), Punic tombs, and a centuries-old carob tree. Quiet, scenic, with great views of St. Paul's Bay. True off-the-beaten-path Malta.",
      distance: "Xemxija",
      googleMapsQuery: "Xemxija Heritage Trail, Malta",
      badge: "Ancient Path",
    },
    {
      id: "migra-ferha",
      name: "Miġra l-Ferħa Cliffs",
      category: "hidden-gems",
      description:
        "Dramatic gorge and cliff scenery — possibly Malta's most stunning coastal views. A water-carved gorge with old stairs leads to the sea. Perfect for sunset picnics, virtually no tourists.",
      distance: "West coast",
      googleMapsQuery: "Miġra l-Ferħa, Malta",
      badge: "Dramatic Views",
    },

    // ===== DIVING & SNORKELING =====
    {
      id: "cirkewwa-dive",
      name: "Ċirkewwa Dive Sites",
      category: "diving",
      description:
        "Malta's most popular dive area with multiple sites: the famous Arch, Madonna statue, swim-throughs, and easy shore access. P29 patrol boat and Rozi tugboat wrecks for advanced divers.",
      priceRange: "€€",
      distance: "Ċirkewwa",
      googleMapsQuery: "Cirkewwa Dive Site, Malta",
      badge: "Must Dive",
    },
    {
      id: "blue-hole-gozo",
      name: "Blue Hole (Gozo)",
      category: "diving",
      description:
        "Vertical chimney dropping 15m through rock into the open sea — one of Mediterranean's most famous dives. Near the former Azure Window site. Suitable for divers of all levels.",
      priceRange: "€€",
      distance: "Dwejra, Gozo",
      googleMapsQuery: "Blue Hole, Gozo, Malta",
      badge: "World Famous",
    },
    {
      id: "um-el-faroud",
      name: "Um El Faroud Wreck",
      category: "diving",
      description:
        "110m oil tanker scuttled in 1998, sitting upright at 36m depth. One of the best wreck dives in the Mediterranean. Advanced certification required. Penetration possible for technical divers.",
      priceRange: "€€€",
      distance: "Wied iż-Żurrieq",
      googleMapsQuery: "Um El Faroud wreck, Malta",
      badge: "Advanced",
    },
    {
      id: "hms-maori",
      name: "HMS Maori Wreck",
      category: "diving",
      description:
        "WWII destroyer sunk in 1942, now lying at 14m in Valletta's Grand Harbour. Easy dive with fascinating wartime history. Prop, guns, and hull clearly visible. Perfect for history buffs.",
      priceRange: "€€",
      distance: "Valletta",
      googleMapsQuery: "HMS Maori wreck, Valletta, Malta",
      badge: "WWII History",
    },
    {
      id: "inland-sea-tunnel",
      name: "Inland Sea & Tunnel",
      category: "diving",
      description:
        "Swim through an 80m tunnel from the Inland Sea lagoon to the open Mediterranean. Stunning light effects as you emerge. Suitable for snorkelers in calm conditions too.",
      priceRange: "€€",
      distance: "Dwejra, Gozo",
      googleMapsQuery: "Inland Sea, Gozo, Malta",
      badge: "Unique Experience",
    },
    {
      id: "ghar-lapsi-diving",
      name: "Għar Lapsi Caves",
      category: "diving",
      description:
        "Network of underwater caves leading from the natural pool to open sea. Excellent visibility, colorful marine life. Great for both diving and snorkeling. Popular with locals.",
      priceRange: "€€",
      distance: "Għar Lapsi",
      googleMapsQuery: "Għar Lapsi diving, Malta",
      badge: "Cave System",
    },
  ],
  localInsights: [
    "The ferry to Valletta from Sliema is €1.50 and much better than sitting in traffic — plus great photos of the skyline",
    "Skip July-August if you hate crowds. September-October has perfect weather, warm sea, and fewer tourists",
    "Sundays: Most shops closed, Marsaxlokk market is on, buses run reduced schedules — plan accordingly",
    "Book the Hypogeum tickets 4-6 weeks ahead online — they sell out and there's no walk-in option",
    "Rent a car for one day to see Gozo properly — the ferry takes cars and the island is small enough to cover",
    "Pastizzi from any hole-in-the-wall bakery beat fancy restaurant versions — Crystal Palace in Rabat is legendary",
    "Maltese rabbit (fenek) is the national dish — braised in wine and garlic, absolutely delicious",
    "Download the Tallinja app for bus times — buses can be unreliable, especially to the ferry terminal",
    "Tipping is appreciated but not expected — 5-10% at restaurants is generous",
    "Bring water shoes — most 'beaches' are rocky coastline with swimming ladders",
    "Blue Lagoon by 9am or after 4pm to avoid peak crowds — or skip it entirely in August",
    "The north (Mellieħa, Gozo) is much quieter than the central tourist belt around Sliema/St. Julian's",
    "Jellyfish season: Spring/summer can bring jellyfish — check weather sites for jellyfish-free beach recommendations before swimming",
    "Topless bathing is forbidden in Malta — and dogs aren't allowed on sandy beaches (hefty fines apply)",
    "Malta drives on the left (like UK). Free street parking exists but finding spots is a challenge in tourist areas",
    "Most buildings lack central heating — if visiting in winter, confirm your accommodation has heaters and bring layers",
    "Best areas for public transport: Sliema, St. Julian's, Gzira, Msida, Valletta — avoid remote villages without a car",
    "Summer humidity makes 30°C feel like 40°C — plan outdoor activities for early morning or late afternoon",
    "Underground Valletta only opened to tourists in 2021 — most people don't know it exists. Book Heritage Malta tours online",
    "Tal-Mixta Cave in Gozo frames Ramla Bay like a window — go at sunset for that golden glow Instagram shot",
    "Victoria Lines is a 12km hike across the entire island — an incredible off-the-beaten-path day out in cooler months",
    "Malta is the scuba diving capital of Europe: 30m+ visibility, WWII wrecks, underwater caves. Book a discover dive even if not certified",
    "Għar Lapsi is 1km from the crowded Blue Grotto but nobody goes there — natural pool with crystal water and underwater caves",
    "Crystal Lagoon on Comino is the Blue Lagoon's quieter twin — kayak there from the main beach to escape the crowds",
  ],
};
