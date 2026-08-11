"use client";
import { useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Share2, Bookmark, Play, Music, ShoppingBag, UserPlus, Search, Home, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getShop, getProduct, ugx, videoFeed } from "@/data/marketplace";
import { VideoCard } from "@/components/videos/VideoCard";
import { useAuth } from "@/components/auth/AuthProvider";

export const Route = createFileRoute("/videos")({
  component: VideosPage,
});

function VideosPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, videoFeed.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const currentVideo = videoFeed[currentIndex];

  return (
    <div className="relative h-screen w-full bg-black">
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4 pb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              ✕
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-white">Following</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <div className="h-full w-full overflow-hidden">
        <VideoCard
          video={currentVideo}
          isActive={true}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>

      <div className="absolute bottom-4 left-4 z-30">
        <p className="text-xs text-white/70">@{currentIndex + 1} / {videoFeed.length}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-white/10 bg-black/80 py-3 backdrop-blur-lg">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-white/70">
          <Home className="h-5 w-5" />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/videos/upload" className="flex flex-col items-center gap-0.5 text-white/70">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-pink-500 to-red-500">
            <Plus className="h-5 w-5 text-white" />
          </div>
        </Link>
        <Link to={user ? `/profile` : "/auth/signin"} className="flex flex-col items-center gap-0.5 text-white/70">
          <User className="h-5 w-5" />
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </div>
  );
}
