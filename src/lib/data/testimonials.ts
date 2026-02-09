export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  propertyCount?: number;
  rating: number;
  image?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    quote: "We went from 10+ WiFi questions per guest to zero. Nesterway paid for itself in saved time within the first week.",
    author: "Sarah Mitchell",
    role: "Coastal Retreat",
    propertyCount: 5,
    rating: 5,
    image: "/testimonials/sarah.jpg"
  },
  {
    id: "testimonial-2",
    quote: "Guests love the local restaurant recommendations. We've had multiple 5-star reviews specifically mention the guide!",
    author: "Michael Chen",
    role: "Mountain Haven",
    rating: 5,
    image: "/testimonials/michael.jpg"
  },
  {
    id: "testimonial-3",
    quote: "Setup took 15 minutes. Within a week, guests were checking out perfectly without a single question. Game changer.",
    author: "Emma Rodriguez",
    role: "Villa Solana",
    rating: 5,
    image: "/testimonials/emma.jpg"
  },
  {
    id: "testimonial-4",
    quote: "The offline access is crucial for our remote cabin. Guests can access everything even with spotty cell service.",
    author: "David Thompson",
    role: "Wilderness Lodge",
    propertyCount: 3,
    rating: 5,
    image: "/testimonials/david.jpg"
  },
  {
    id: "testimonial-5",
    quote: "Professional, beautiful, and so easy to update. Our guests feel like VIPs the moment they arrive.",
    author: "Jessica Park",
    role: "Downtown Lofts",
    propertyCount: 8,
    rating: 5,
    image: "/testimonials/jessica.jpg"
  },
  {
    id: "testimonial-6",
    quote: "Cut our check-out issues by 80%. The automated reminders and clear instructions make all the difference.",
    author: "Robert Anderson",
    role: "Beachside Rentals",
    propertyCount: 12,
    rating: 5,
    image: "/testimonials/robert.jpg"
  }
];

export const featuredTestimonial: Testimonial = {
  id: "featured-1",
  quote: "Nesterway transformed how we welcome guests. What used to take 30 minutes of back-and-forth messages now happens instantly with a QR code scan. Our review scores went up, our workload went down, and guests love the professional touch. Best investment we've made in our hosting business.",
  author: "Jennifer Martinez",
  role: "Lake House Retreats - 7 Properties",
  rating: 5,
  image: "/testimonials/jennifer.jpg"
};
