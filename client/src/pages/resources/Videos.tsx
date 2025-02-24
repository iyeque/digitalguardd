import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "Understanding Digital Well-being",
    description: "An introduction to digital wellness and its importance for families.",
    duration: "15:24",
    thumbnail: "https://img.youtube.com/vi/placeholder1/maxresdefault.jpg",
    category: "Digital Wellness"
  },
  {
    id: 2,
    title: "Setting Up Parental Controls",
    description: "Step-by-step guide to configuring parental controls on various devices.",
    duration: "12:45",
    thumbnail: "https://img.youtube.com/vi/placeholder2/maxresdefault.jpg",
    category: "Tutorial"
  },
  {
    id: 3,
    title: "Healthy Screen Time Habits",
    description: "Expert tips for managing screen time and creating healthy digital habits.",
    duration: "18:30",
    thumbnail: "https://img.youtube.com/vi/placeholder3/maxresdefault.jpg",
    category: "Tips & Advice"
  }
];

export default function Videos() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Educational Videos</h1>
        <p className="text-lg text-gray-600 mb-12">
          Watch our collection of expert videos on digital wellness, online safety, and healthy technology use.
        </p>

        {/* Video Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button variant="outline" size="sm">All Videos</Button>
          <Button variant="outline" size="sm">Tutorials</Button>
          <Button variant="outline" size="sm">Tips & Advice</Button>
          <Button variant="outline" size="sm">Expert Talks</Button>
        </div>

        {/* Featured Video */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <PlayCircle className="h-16 w-16 text-primary opacity-75" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Featured: Digital Safety Guide for Parents</h2>
            <p className="text-gray-600 mb-4">
              A comprehensive overview of digital safety measures and best practices for parents.
            </p>
            <div className="flex items-center gap-4">
              <Button>Watch Now</Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                20:15
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-primary opacity-75" />
              </div>
              <CardContent className="pt-4">
                <div className="text-sm text-primary font-medium mb-2">
                  {video.category}
                </div>
                <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm">Watch Video</Button>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {video.duration}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Playlist Section */}
        <Card className="mt-12">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Video Playlists</h2>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <PlayCircle className="h-4 w-4 mr-2" />
                Getting Started with Digital Wellness
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <PlayCircle className="h-4 w-4 mr-2" />
                Online Safety Essentials
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <PlayCircle className="h-4 w-4 mr-2" />
                Parent's Guide to Social Media
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
