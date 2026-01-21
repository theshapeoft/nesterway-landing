import type { Property } from "@/types";

export const sliemaSanctuary: Property = {
  id: "static-sliema-sanctuary",
  slug: "sliema-sanctuary",
  name: "Sliema Sanctuary",
  areaSlug: "sliema",
  areaName: "Sliema",
  countrySlug: "malta",
  countryName: "Malta",
  welcomeMessage:
    "Welcome! We're so happy to have you staying at our apartment. Make yourself at home and enjoy everything Sliema has to offer. If you need anything at all, don't hesitate to reach out.",
  hostName: "Maria",
  hostPhotoUrl: undefined, // Will use initials fallback
  checkoutTime: "11:00",
  wifi: {
    networks: [
      {
        name: "SliemaSanctuary_5G",
        password: "Welcome2Malta!",
        type: "WPA",
        description: "Recommended for streaming",
        isPrimary: true,
      },
      {
        name: "SliemaSanctuary_2.4G",
        password: "Welcome2Malta!",
        type: "WPA",
        description: "Better range, slower speed",
      },
    ],
  },
  emergencyContact: {
    name: "Maria",
    phone: "+356 9999 1234",
    email: "maria@sliema-sanctuary.com",
  },
  sections: [
    {
      id: "house-rules",
      title: "House Rules",
      icon: "clipboard-list",
      content: [
        { text: "No smoking inside the apartment", severity: "critical" },
        { text: "Quiet hours: 10pm - 8am", severity: "normal" },
        { text: "Maximum 4 guests", severity: "normal" },
        { text: "No parties or events", severity: "critical" },
        { text: "Pets welcome (small dogs and cats only)", severity: "normal" },
        {
          text: "Please separate recycling - bins are in the kitchen",
          severity: "normal",
        },
      ],
    },
    {
      id: "appliances",
      title: "Appliances & How-Tos",
      icon: "plug",
      content: [
        {
          name: "Washing Machine",
          location: "Bathroom",
          instructions:
            "Use the white Bosch machine. Standard cycle is dial position 3. Detergent pods are under the sink.",
        },
        {
          name: "Coffee Machine",
          location: "Kitchen counter",
          instructions:
            "Nespresso machine - pods are in the drawer below. Fill water tank from the back. Press button once for espresso, hold for lungo.",
        },
        {
          name: "Air Conditioning",
          location: "Living room and bedroom",
          instructions:
            "Remote is on the bedside table. Press power, then use arrows to set temperature. Please turn off when leaving.",
        },
        {
          name: "Smart TV",
          location: "Living room",
          instructions:
            "Use the Samsung remote. Netflix is pre-installed - please log into your own account. YouTube is also available.",
        },
      ],
    },
    {
      id: "checkin-checkout",
      title: "Check-in / Check-out",
      icon: "door-open",
      content: [
        "Check-in: From 3:00 PM onwards",
        "Check-out: By 11:00 AM",
        "Key lockbox is to the left of the main entrance - code was sent in your booking confirmation",
        "Please return the key to the lockbox when you leave",
        "Leave used towels in the bathtub",
        "No need to strip the beds - just leave them as they are",
        "Take out any rubbish to the bins in the courtyard",
      ],
    },
    {
      id: "parking",
      title: "Parking & Transport",
      icon: "car",
      content: [
        "Street parking is available but can be tricky - look for white-lined spaces (free) not blue (paid residents only)",
        "Nearest public car park: The Point Shopping Mall (5 min walk) - €1/hour",
        "Bus stop 100m away - routes 13, 14, 16 go to Valletta (€1.50 single)",
        "Bolt and eCabs apps work well for taxis",
        "Ferry to Valletta runs every 30 mins from the seafront (€1.50, 5 min crossing)",
        "Walking is the best way to explore Sliema!",
      ],
    },
    {
      id: "emergency",
      title: "Emergency Information",
      icon: "alert-triangle",
      content: [
        "Emergency services: 112 (EU-wide)",
        "Police: 191",
        "Ambulance: 196",
        "Nearest hospital: Mater Dei Hospital (15 min by taxi)",
        "Nearest pharmacy: Boots at The Point Mall (open until 10pm)",
        "First aid kit is in the bathroom cabinet",
        "Fire extinguisher is by the front door",
      ],
    },
    {
      id: "property-notes",
      title: "Property Notes",
      icon: "file-text",
      content: [
        "The hot water takes about 30 seconds to come through - be patient!",
        "The balcony door can be stiff - lift slightly while sliding",
        "Neighbours are friendly - Tomas next door speaks English if you need local help",
        "Grocery delivery: Wolt and Bolt Food both deliver here",
        "Best sunset views from the Sliema promenade - 2 min walk",
      ],
    },
  ],
};
