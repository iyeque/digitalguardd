import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "Digital Wellness: 7 Tips For Better Sleep",
    description:
      "Learn how your digital habits affect your sleep and discover practical tips for better rest in our connected world.",
    duration: "1:01",
    thumbnail: "https://img.youtube.com/vi/5Z9MPik_SMU/maxresdefault.jpg",
    videoId: "5Z9MPik_SMU",
    category: "Digital Wellness",
    date: "February 20, 2024",
  },
  {
    id: 2,
    title: "Understanding Digital Footprint",
    description:
      "Explore what a digital footprint is and how it impacts your online presence and future opportunities.",
    duration: "0:49",
    thumbnail: "https://img.youtube.com/vi/5BwVJvw0X98/maxresdefault.jpg",
    videoId: "5BwVJvw0X98",
    category: "Online Safety",
    date: "February 15, 2024",
  },
  {
    id: 3,
    title: "Screen Time Management for Kids",
    description:
      "Essential strategies for parents to manage their children's screen time effectively while promoting healthy digital habits.",
    duration: "0:52",
    thumbnail: "https://img.youtube.com/vi/-6h1Fx-llYw/maxresdefault.jpg",
    videoId: "-6h1Fx-llYw",
    category: "Parenting Tips",
    date: "February 10, 2024",
  },
  {
    id: 4,
    title: "Social Media Safety Guide",
    description:
      "Learn how to protect your privacy and stay safe while using social media platforms.",
    duration: "0:49",
    thumbnail: "https://img.youtube.com/vi/vcA0ngHicNk/maxresdefault.jpg",
    videoId: "vcA0ngHicNk",
    category: "Online Safety",
    date: "February 5, 2024",
  },
  {
    id: 5,
    title: "Digital Wellness Basics",
    description:
      "An introduction to digital wellness and its importance in maintaining a healthy relationship with technology.",
    duration: "0:48",
    thumbnail: "https://img.youtube.com/vi/xxT3IYiIJsI/maxresdefault.jpg",
    videoId: "xxT3IYiIJsI",
    category: "Digital Wellness",
    date: "February 1, 2024",
  },
];

type VideoPlayerProps = {
  videoId: string;
  title: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title }) => (
  <div className="aspect-video rounded-lg overflow-hidden">
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  </div>
);

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(
    videos[0].videoId,
  );
  const videoPlayerRef = useRef<HTMLDivElement | null>(null);

  const playVideo = (videoId: string) => {
    setSelectedVideo(videoId);
    videoPlayerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Educational Videos</h1>
        <p className="text-lg text-gray-600 mb-12">
          Watch our collection of expert videos on digital wellness, online
          safety, and healthy technology use.
        </p>

        {/* Video Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button variant="outline" size="sm">
            All Videos
          </Button>
          <Button variant="outline" size="sm">
            Digital Wellness
          </Button>
          <Button variant="outline" size="sm">
            Online Safety
          </Button>
          <Button variant="outline" size="sm">
            Parenting Tips
          </Button>
        </div>

        {/* Featured Video */}
        <Card className="mb-12" ref={videoPlayerRef}>
          <CardContent className="pt-6">
            <VideoPlayer
              videoId={selectedVideo || videos[0].videoId}
              title={
                videos.find((v) => v.videoId === selectedVideo)?.title ||
                videos[0].title
              }
            />
            <div className="flex items-center gap-2 mt-4 mb-4">
              <span className="text-sm font-medium text-primary">
                Featured Video
              </span>
              <span className="text-sm text-gray-500">
                •{" "}
                {videos.find((v) => v.videoId === selectedVideo)?.date ||
                  videos[0].date}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {videos.find((v) => v.videoId === selectedVideo)?.title ||
                videos[0].title}
            </h2>
            <p className="text-gray-600 mb-4">
              {videos.find((v) => v.videoId === selectedVideo)?.description ||
                videos[0].description}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {videos.find((v) => v.videoId === selectedVideo)?.duration ||
                videos[0].duration}
            </div>
          </CardContent>
        </Card>

        {/* Video Grid - include all videos */}
        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <Card key={video.id}>
              <CardContent className="pt-6">
                <div
                  className="cursor-pointer"
                  onClick={() => playVideo(video.videoId)} // This will update the selected video and scroll
                >
                  <div className="aspect-video bg-gray-100 relative group rounded-lg mb-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                  </div>
                </div>
                <div className="text-sm text-primary font-medium mb-2">
                  {video.category}
                </div>
                <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {video.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {video.duration}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}