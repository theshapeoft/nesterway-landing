import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import { BlogArticle } from "@/lib/data/blog";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  article: BlogArticle;
}

export function BlogCard({ article }: BlogCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className="group h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Image Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-ocean-100 to-sand-100 flex items-center justify-center">
          <div className="text-6xl text-ocean-300">📝</div>
        </div>

        <CardContent className="p-6">
          {/* Category & Read Time */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="font-semibold text-ocean-600">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-ocean-600 transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {article.excerpt}
          </p>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
