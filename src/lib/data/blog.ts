export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  image: string;
  slug: string;
}

export const blogArticles: BlogArticle[] = [
  {
    id: "article-1",
    title: "5 Ways Digital Guides Improve Guest Experience",
    excerpt: "Discover how digital property guides are revolutionizing the short-term rental experience for both hosts and guests.",
    category: "Guest Experience",
    readTime: "5 min read",
    publishedAt: "2025-01-15",
    image: "/blog/guest-experience.jpg",
    slug: "5-ways-digital-guides-improve-guest-experience"
  },
  {
    id: "article-2",
    title: "The Ultimate Property Welcome Guide Checklist",
    excerpt: "A comprehensive checklist covering everything your guests need to know, from WiFi passwords to local emergency contacts.",
    category: "Best Practices",
    readTime: "8 min read",
    publishedAt: "2025-01-10",
    image: "/blog/welcome-checklist.jpg",
    slug: "ultimate-property-welcome-guide-checklist"
  },
  {
    id: "article-3",
    title: "Why QR Codes Are Every Host's Secret Weapon",
    excerpt: "Learn how QR codes can save you hours of communication time while providing a seamless experience for your guests.",
    category: "Technology",
    readTime: "6 min read",
    publishedAt: "2025-01-05",
    image: "/blog/qr-codes.jpg",
    slug: "qr-codes-host-secret-weapon"
  }
];
