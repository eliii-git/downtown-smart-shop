"use client";
import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Play, Music, ShoppingBag, UserPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getShop, getProduct, ugx, type VideoFeedItem } from "@/data/marketplace";
import { useAuth } from "@/components/auth/AuthProvider";

interface VideoCardProps {
  video: VideoFeedItem;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function VideoCard({ video, isActive, onNext, onPrev }: VideoCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartY = useRef(0);
  const { user } = useAuth();

  const shop = getShop(video.shopId);
  const product = getProduct(video.productId);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  }, [isActive]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaY = touch.clientY - touchStartY.current;
    if (Math.abs(deltaY) > 50) {
      if (deltaY < 0) onNext();
      else onPrev();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setPlaying(!playing);
    }
  };

  const handleLike = () => setLiked(!liked);
  const handleSave = () => setSaved(!saved);
  const handleFollow = () => setFollowing(!following);

  return (
    <div
      className="relative h-screen w-full snap-center snap-always"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnail}
        className="h-full w-full object-cover"
        loop
        playsInline
        muted
        onClick={togglePlay}
      />

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-black/40">
            <Play className="h-8 w-8 fill-current text-white" />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div className="absolute inset-x-0 bottom-0 p-4 pb-20">
        <div className="flex items-end justify-between">
          <div className="max-w-[75%] space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="h-10 w-10 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(135deg, oklch(0.6 0.15 ${video.hue}), oklch(0.3 0.1 ${video.hue}))`,
                }}
              />
              <div>
                <p className="text-sm font-semibold text-white">@{shop?.name}</p>
                {!following && user && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-0.5 h-6 border-white/40 px-2 text-[10px] text-white hover:bg-white/20"
                    onClick={handleFollow}
                  >
                    <UserPlus className="mr-1 h-3 w-3" />
                    Follow
                  </Button>
                )}
                {following && (
                  <p className="text-[10px] text-white/70">Following</p>
                )}
              </div>
            </div>
            <p className="text-sm text-white/90">{video.caption}</p>
            <div className="flex items-center gap-1.5 text-white/80">
              <Music className="h-3.5 w-3.5" />
              <p className="text-xs truncate">{video.music}</p>
            </div>
            {product && (
              <Link
                to="/product/$productId"
                params={{ productId: product.id }}
                className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-8 w-8 rounded-lg object-cover"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-white">{product.name}</p>
                  <p className="text-[11px] text-white/70">{ugx(product.retail)}</p>
                </div>
                <ShoppingBag className="ml-2 h-4 w-4 text-white" />
              </Link>
            )}
          </div>

          <div className="flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={handleLike}
              className="flex flex-col items-center gap-1"
            >
              <div className={`glass grid h-11 w-11 place-items-center rounded-full ${liked ? "bg-primary/30" : ""}`}>
                <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : "text-white"}`} />
              </div>
              <span className="text-[11px] text-white">{(video.likes + (liked ? 1 : 0)).toLocaleString()}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center gap-1"
            >
              <div className="glass grid h-11 w-11 place-items-center rounded-full">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-[11px] text-white">{video.comments}</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-1"
            >
              <div className="glass grid h-11 w-11 place-items-center rounded-full">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-[11px] text-white">{video.shares}</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex flex-col items-center gap-1"
            >
              <div className={`glass grid h-11 w-11 place-items-center rounded-full ${saved ? "bg-primary/30" : ""}`}>
                <Bookmark className={`h-5 w-5 ${saved ? "fill-primary text-primary" : "text-white"}`} />
              </div>
              <span className="text-[11px] text-white">{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="absolute inset-x-0 bottom-0 top-20 z-20 rounded-t-3xl bg-background p-4 shadow-[var(--shadow-float)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">{video.comments} Comments</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowComments(false)}>
              ✕
            </Button>
          </div>
          <div className="max-h-60 space-y-3 overflow-y-auto">
            {[
              { user: "Sarah M.", text: "Great stock! Can I get 10 units?", time: "2h ago" },
              { user: "Mike K.", text: "Is this the original Samsung?", time: "5h ago" },
              { user: "John D.", text: "Delivery to Jinja?", time: "1d ago" },
            ].map((c, i) => (
              <div key={i} className="flex gap-2">
                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10" />
                <div className="flex-1">
                  <p className="text-xs font-semibold">{c.user}</p>
                  <p className="text-xs text-muted-foreground">{c.text}</p>
                  <p className="text-[10px] text-muted-foreground">{c.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="h-9 text-xs"
            />
            <Button size="sm" className="shrink-0">Post</Button>
          </div>
        </div>
      )}
    </div>
  );
}
