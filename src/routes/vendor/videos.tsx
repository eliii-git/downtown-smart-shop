"use client";
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowLeft, Play, Plus, Trash2, Eye } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/vendor/videos")({
  component: VendorVideos,
});

const mockVideos = [
  { id: "1", title: "New Stock Arrival", views: 1240, date: "2 days ago", thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { id: "2", title: "Shop Tour - Kikubo", views: 890, date: "1 week ago", thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { id: "3", title: "Wholesale Deals This Week", views: 2100, date: "2 weeks ago", thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
];

function VendorVideos() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState(mockVideos);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "vendor")) {
      navigate({ to: "/auth/signin", replace: true });
    }
  }, [isAuthenticated, isLoading, user?.role, navigate]);

  const handleDelete = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  if (isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!isAuthenticated || !user || user.role !== "vendor") {
    return null;
  }

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/vendor/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Video Management</h1>
              <p className="text-sm text-muted-foreground">Upload and manage your shop videos</p>
            </div>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative aspect-[9/16] w-full" style={{ backgroundImage: video.thumbnail }}>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-white/90">
                    <Play className="h-5 w-5 fill-current text-primary" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/50 text-white hover:bg-black/70">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/50 text-white hover:bg-black/70" onClick={() => handleDelete(video.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{video.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{video.views.toLocaleString()} views</span>
                  <span>·</span>
                  <span>{video.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          <button className="flex aspect-[9/16] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Upload New Video</p>
          </button>
        </div>
      </div>
    </Shell>
  );
}
