"use client";

import { useEffect, useRef, useState } from "react";
import FeedItem from "./FeedItem";
import { getPostScore, getTopPostId, getCategoryScore, getStats, setTrackingMode } from "@/lib/tracker";

const posts = [
  {
    id: 1,
    title: "Getting Started with Machine Learning",
    category: "Technology",
    description:
      "Discover the fundamentals of machine learning and how it's transforming industries.",
  },
  {
    id: 2,
    title: "The Art of Minimalist Design",
    category: "Design",
    description:
      "Learn how minimalist design principles create powerful user experiences.",
  },
  {
    id: 3,
    title: "Sustainable Living in Urban Spaces",
    category: "Lifestyle",
    description:
      "Reduce your environmental footprint while living in the city.",
  },
  {
    id: 4,
    title: "The Future of Remote Work",
    category: "Business",
    description:
      "Explore tools and strategies for remote-first organizations.",
  },
  {
    id: 5,
    title: "Mastering TypeScript in 2024",
    category: "Technology",
    description:
      "Take your JavaScript skills to the next level with TypeScript.",
  },
];

export default function Feed() {
  const [refresh, setRefresh] = useState(0);
  const [highlightPost, setHighlightPost] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"manipulative" | "ethical">("manipulative");

  useEffect(() => {
    setTrackingMode(mode);
  }, [mode]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setRefresh((r) => r + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const lastScrollPositionRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentTime = Date.now();
      const currentPosition = window.scrollY;

      const deltaTime = currentTime - lastTimeRef.current;
      const deltaScroll = Math.abs(
        currentPosition - lastScrollPositionRef.current
      );

      const scrollSpeed = deltaScroll / (deltaTime || 1);

      const scrollDirection =
        currentPosition > lastScrollPositionRef.current ? "down" : "up";



      lastTimeRef.current = currentTime;
      lastScrollPositionRef.current = currentPosition;

      // Idle detection
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      idleTimerRef.current = setTimeout(() => {
        console.log("[Tracking] User idle (possible drop-off)");

        const bestPost = getTopPostId();

        if (bestPost !== null) {
          console.log("[Hook] Showing best post:", bestPost);
          setHighlightPost(bestPost);
        }
      }, 3000);
    };

    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex justify-center bg-black min-h-screen">
      <div className="w-full max-w-lg px-4 py-6">
        
        {/* Title */}
        <h1 className="text-white text-xl font-semibold mb-4">
          Attention Feed
        </h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("manipulative")}
            className={`px-3 py-1 rounded transition-colors ${
              mode === "manipulative" ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Manipulative
          </button>

          <button
            onClick={() => setMode("ethical")}
            className={`px-3 py-1 rounded transition-colors ${
              mode === "ethical" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Ethical
          </button>
        </div>

        {/* Feed Container */}
        <div className="flex flex-col gap-8">
          {[...posts]
            .sort((a, b) => {
              if (!mounted) return 0;

              const stats = getStats();

              const isColdStart = Object.keys(stats).length === 0;

              if (isColdStart) {
                return Math.random() - 0.5;
              }

              const exploreChance = Math.random();

              // 🟢 ETHICAL MODE
              if (mode === "ethical") {
                // More exploration, less manipulation
                if (exploreChance < 0.6) {
                  return Math.random() - 0.5;
                }

                const scoreA = getPostScore(a.id);
                const scoreB = getPostScore(b.id);

                return scoreB - scoreA;
              }

              // 🔴 MANIPULATIVE MODE
              if (mode === "manipulative") {
                // Less exploration, more addictive behavior
                if (exploreChance < 0.2) {
                  return Math.random() - 0.5;
                }

                const scoreA =
                  getPostScore(a.id) + getCategoryScore(a.category) * 0.5;

                const scoreB =
                  getPostScore(b.id) + getCategoryScore(b.category) * 0.5;

                return scoreB - scoreA;
              }

              return 0;
            })
            .map((post) => (
            <div
              key={post.id}
              className={`snap-start transition-all duration-300 ${
                highlightPost === post.id ? "ring-2 ring-yellow-400 ring-offset-4 ring-offset-black scale-[1.02]" : ""
              }`}
            >
              <FeedItem post={post} />
              <div className="text-xs text-gray-500 mt-2 px-2 py-1 text-center font-mono bg-gray-900 rounded border border-gray-800">
                Rank Score: {getPostScore(post.id).toFixed(2)} <span className="text-gray-600">|</span> Category Boost:{" "}
                {getCategoryScore(post.category).toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}