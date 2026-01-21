// Property Templates for new property creation
// Each template provides pre-filled content that users can customize

export interface TemplateRule {
  text: string;
  severity: "critical" | "normal";
}

export interface TemplateAppliance {
  name: string;
  location?: string;
  instructions: string;
}

export interface TemplateSection {
  title: string;
  icon: string;
  content: string; // HTML content
}

export interface PropertyTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  rules: TemplateRule[];
  appliances: TemplateAppliance[];
  customSections: TemplateSection[];
}

export const propertyTemplates: PropertyTemplate[] = [
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch with no pre-filled content",
    icon: "file",
    rules: [],
    appliances: [],
    customSections: [],
  },
  {
    id: "apartment",
    name: "Apartment",
    description: "Common rules and appliances for apartments",
    icon: "building",
    rules: [
      { text: "No smoking inside the apartment", severity: "critical" },
      { text: "Quiet hours: 10pm - 8am (building policy)", severity: "critical" },
      { text: "No parties or loud gatherings", severity: "normal" },
      { text: "Please remove shoes at the entrance", severity: "normal" },
      { text: "Keep balcony/terrace tidy", severity: "normal" },
    ],
    appliances: [
      {
        name: "Washing Machine",
        location: "Bathroom or utility area",
        instructions: "Add detergent to the drawer, load clothes, select cycle (Normal for most items), and press Start. Cycle takes about 1 hour.",
      },
      {
        name: "Dishwasher",
        location: "Kitchen",
        instructions: "Scrape food off dishes, load with cups on top rack and plates on bottom. Add tablet to dispenser, close door firmly, and press Start.",
      },
      {
        name: "Air Conditioning",
        location: "Living room and bedrooms",
        instructions: "Use the remote to turn on. Set desired temperature (22-24°C recommended). Please turn off when leaving the apartment.",
      },
      {
        name: "TV & Remote",
        location: "Living room",
        instructions: "Press power button on remote. Use number buttons for channels, or press Home for smart TV apps. Netflix/YouTube available.",
      },
    ],
    customSections: [
      {
        title: "Building Access",
        icon: "key",
        content: "<p>The main entrance door uses a <strong>keypad code</strong>. Your code will be provided separately.</p><p>The elevator is located in the lobby. Our apartment is on the [floor] floor.</p>",
      },
    ],
  },
  {
    id: "house",
    name: "House",
    description: "Perfect for houses with outdoor spaces and parking",
    icon: "home",
    rules: [
      { text: "No smoking inside the house", severity: "critical" },
      { text: "Quiet hours: 10pm - 8am", severity: "normal" },
      { text: "No parties without prior approval", severity: "normal" },
      { text: "Keep gates closed at all times", severity: "normal" },
      { text: "Please water the plants if staying 3+ days", severity: "normal" },
      { text: "BBQ area must be cleaned after use", severity: "normal" },
    ],
    appliances: [
      {
        name: "Washing Machine",
        location: "Laundry room or garage",
        instructions: "Add detergent to the drawer, load clothes, select cycle (Normal for most items), and press Start.",
      },
      {
        name: "Dryer",
        location: "Laundry room or garage",
        instructions: "Clean lint trap before each use! Load clothes from washer, select heat level (Low for delicates), and press Start.",
      },
      {
        name: "Heating System",
        location: "Thermostat in hallway",
        instructions: "Use the thermostat to adjust temperature. Press up/down buttons to set desired temperature. System turns on automatically.",
      },
      {
        name: "BBQ/Grill",
        location: "Backyard or patio",
        instructions: "Open gas valve, press ignition button, and turn burner knobs to light. Preheat for 10 minutes. Please clean grates after use.",
      },
      {
        name: "Pool Equipment",
        location: "Pool area",
        instructions: "Pool is maintained automatically. Towels are provided in the pool house. Please shower before swimming.",
      },
    ],
    customSections: [
      {
        title: "Parking",
        icon: "car",
        content: "<p><strong>Garage:</strong> Use the remote clipped to the sun visor to open the garage door.</p><p><strong>Driveway:</strong> Additional parking is available in the driveway. Please do not block the sidewalk.</p>",
      },
      {
        title: "Garden & Outdoor",
        icon: "tree",
        content: "<p>Feel free to enjoy the garden and outdoor areas. Outdoor furniture cushions should be brought inside if rain is expected.</p><p>The garden hose is located by the side of the house.</p>",
      },
    ],
  },
  {
    id: "studio",
    name: "Studio",
    description: "Essential info for compact studio spaces",
    icon: "square",
    rules: [
      { text: "No smoking", severity: "critical" },
      { text: "Quiet hours: 10pm - 8am", severity: "critical" },
      { text: "Maximum 2 guests", severity: "normal" },
      { text: "Keep the space tidy", severity: "normal" },
    ],
    appliances: [
      {
        name: "Kitchenette",
        location: "Main living area",
        instructions: "Induction cooktop: place pot on surface and select heat level. Microwave: set time and power, press Start. Mini-fridge keeps items cool.",
      },
      {
        name: "Coffee Maker",
        location: "Kitchenette counter",
        instructions: "Fill water tank, add coffee pod or grounds, place cup underneath, and press brew button.",
      },
      {
        name: "Air Conditioning/Heating",
        location: "Wall unit",
        instructions: "Use the remote to turn on. Cool mode for summer, Heat mode for winter. Set to 22-24°C for comfort.",
      },
    ],
    customSections: [
      {
        title: "Space Tips",
        icon: "lightbulb",
        content: "<p>This cozy studio is designed for efficiency:</p><ul><li>The sofa converts to a bed - pull the handle underneath</li><li>Extra linens are in the closet</li><li>Use the hooks behind the door for hanging clothes</li></ul>",
      },
    ],
  },
];

export function getTemplateById(id: string): PropertyTemplate | undefined {
  return propertyTemplates.find((t) => t.id === id);
}
