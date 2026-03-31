"use client";
import { trackView, trackClick } from "@/lib/tracker";
import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: number;
  title: string;
  category: string;
  description: string;
}

interface FeedCardProps {
  post: Post;
}

export default function FeedItem({ post }: FeedCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // 👇 VIEW TRACKING (IMPORTANT)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Card is visible
            startTimeRef.current = Date.now();

          } else {
            // Card left view
            if (startTimeRef.current) {
              const duration = Date.now() - startTimeRef.current;
              trackView(post.id, duration, post.category);
              startTimeRef.current = null;
            }
          }
        });
      },
      {
        threshold: 0.6, // 60% visible
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [post.id]);

  // 👇 CLICK TRACKING
  const handleClick = () => {
    trackClick(post.id);
  };

  return (
    <Card
      ref={cardRef}
      onClick={handleClick}
      className="cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
    >
      <div className="aspect-video w-full bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <div className="text-muted-foreground/50 text-sm">
            Image Placeholder
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight mt-2">
          {post.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription className="line-clamp-3">
          {post.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}