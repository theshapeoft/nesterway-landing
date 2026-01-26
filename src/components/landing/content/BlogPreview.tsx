import { BlogCard } from "./BlogCard";
import { blogArticles } from "@/lib/data/blog";
import { Section, SectionHeader, CTAButton } from "../shared";

export function BlogPreview() {
  return (
    <Section variant="default" id="blog">
      <SectionHeader
        subtitle="Resources"
        title="Tips & Best Practices for Hosts"
        description="Learn how to create exceptional guest experiences and grow your hosting business"
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {blogArticles.map((article) => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>

      <div className="text-center">
        <CTAButton href="/blog" variant="outline" size="lg">
          View All Articles
        </CTAButton>
      </div>
    </Section>
  );
}
