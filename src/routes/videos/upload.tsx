"use client";
import { useState, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Upload, Image as ImageIcon, Video, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";

export const Route = createFileRoute("/videos/upload")({
  component: VideoUpload,
});

function VideoUpload() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [music, setMusic] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-white">Please sign in to upload videos</p>
          <Link to="/auth/signin">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setThumbnail(url);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnail(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return;

    setLoading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setLoading(false);
      navigate({ to: "/videos" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-black/80 p-4 backdrop-blur-lg">
        <Link to="/videos">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold text-white">Upload Video</h1>
        <div className="w-10" />
      </div>

      <div className="mx-auto max-w-lg px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Video File</Label>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Video className="mr-2 h-4 w-4" />
                  {videoFile ? videoFile.name : "Select Video"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Thumbnail</Label>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  className="hidden"
                />
                {thumbnail ? (
                  <div className="relative aspect-[9/16] w-full max-w-xs overflow-hidden rounded-xl">
                    <img src={thumbnail} alt="Thumbnail" className="h-full w-full object-cover" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => setThumbnail("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Select Thumbnail
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption" className="text-white">Caption</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe your video..."
                  className="border-white/20 bg-white/5 text-white placeholder:text-white/50"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="music" className="text-white">Music / Sound</Label>
                <Input
                  id="music"
                  value={music}
                  onChange={(e) => setMusic(e.target.value)}
                  placeholder="Add a sound or music..."
                  className="border-white/20 bg-white/5 text-white placeholder:text-white/50"
                />
              </div>

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-white">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-red-500 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600"
                disabled={!videoFile || loading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
