import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "Digital Wellness: 7 Tips For Better Sleep",
    description: "Learn how your digital habits affect your sleep and discover practical tips for better rest in our connected world.",
    duration: "10:23",
    thumbnail: "https://img.youtube.com/vi/5Z9MPik_SMU/maxresdefault.jpg",
    youtubeLink: "https://youtu.be/5Z9MPik_SMU?si=cdLT7jTvSnn5n1-C",
    category: "Digital Wellness",
    date: "February 20, 2024"
  },
  {
    id: 2,
    title: "Understanding Digital Footprint",
    description: "Explore what a digital footprint is and how it impacts your online presence and future opportunities.",
    duration: "8:45",
    thumbnail: "https://img.youtube.com/vi/5BwVJvw0X98/maxresdefault.jpg",
    youtubeLink: "https://youtu.be/5BwVJvw0X98?si=gw2vza5Il58rMsT5",
    category: "Online Safety",
    date: "February 15, 2024"
  },
  {
    id: 3,
    title: "Screen Time Management for Kids",
    description: "Essential strategies for parents to manage their children's screen time effectively while promoting healthy digital habits.",
    duration: "12:30",
    thumbnail: "https://img.youtube.com/vi/-6h1Fx-llYw/maxresdefault.jpg",
    youtubeLink: "https://youtu.be/-6h1Fx-llYw?si=kbceNBSbgho7Nzug",
    category: "Parenting Tips",
    date: "February 10, 2024"
  },
  {
    id: 4,
    title: "Social Media Safety Guide",
    description: "Learn how to protect your privacy and stay safe while using social media platforms.",
    duration: "15:20",
    thumbnail: "https://img.youtube.com/vi/vcA0ngHicNk/maxresdefault.jpg",
    youtubeLink: "https://youtu.be/vcA0ngHicNk?si=PfE4NUp_NwZ5xd-G",
    category: "Online Safety",
    date: "February 5, 2024"
  },
  {
    id: 5,
    title: "Digital Wellness Basics",
    description: "An introduction to digital wellness and its importance in maintaining a healthy relationship with technology.",
    duration: "11:15",
    thumbnail: "https://img.youtube.com/vi/xxT3IYiIJsI/maxresdefault.jpg",
    youtubeLink: "https://youtu.be/xxT3IYiIJsI?si=wm3_TXF4o9kDLcCz",
    category: "Digital Wellness",
    date: "February 1, 2024"
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
          <Button variant="outline" size="sm">Digital Wellness</Button>
          <Button variant="outline" size="sm">Online Safety</Button>
          <Button variant="outline" size="sm">Parenting Tips</Button>
        </div>

        {/* Featured Video */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <a 
              href={videos[0].youtubeLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block"
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 relative group">
                <img 
                  src={videos[0].thumbnail} 
                  alt={videos[0].title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                  <ExternalLink className="text-white opacity-0 group-hover:opacity-100 h-12 w-12" />
                </div>
              </div>
            </a>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-primary">Featured Video</span>
              <span className="text-sm text-gray-500">• {videos[0].date}</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{videos[0].title}</h2>
            <p className="text-gray-600 mb-4">{videos[0].description}</p>
            <div className="flex items-center gap-4">
              <a 
                href={videos[0].youtubeLink} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button>Watch on YouTube</Button>
              </a>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {videos[0].duration}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {videos.slice(1).map((video) => (
            <Card key={video.id}>
              <CardContent className="pt-6">
                <a 
                  href={video.youtubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block"
                >
                  <div className="aspect-video bg-gray-100 relative group rounded-lg mb-4">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                      <ExternalLink className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
                    </div>
                  </div>
                </a>
                <div className="text-sm text-primary font-medium mb-2">
                  {video.category}
                </div>
                <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                <div className="flex items-center justify-between">
                  <a 
                    href={video.youtubeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">Watch on YouTube</Button>
                  </a>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {video.duration}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}