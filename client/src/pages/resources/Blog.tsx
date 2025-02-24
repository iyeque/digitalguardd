import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Setting Healthy Digital Boundaries for Your Family",
    excerpt: "Learn effective strategies for establishing and maintaining digital boundaries that work for your family.",
    author: "Dr. Sarah Chen",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Digital Wellness"
  },
  {
    id: 2,
    title: "Understanding Social Media's Impact on Teen Mental Health",
    excerpt: "Research-backed insights into how social media affects teenage mental well-being and what parents can do.",
    author: "Michael Thompson",
    date: "March 12, 2024",
    readTime: "10 min read",
    category: "Mental Health"
  },
  {
    id: 3,
    title: "A Parent's Guide to Online Gaming Safety",
    excerpt: "Essential tips and guidelines for keeping children safe while enjoying online gaming.",
    author: "Emma Rodriguez",
    date: "March 10, 2024",
    readTime: "6 min read",
    category: "Online Safety"
  }
];

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Digital Wellness Blog</h1>
        <p className="text-lg text-gray-600 mb-12">
          Expert insights and practical advice on digital wellness, online safety, and healthy technology use for families.
        </p>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button variant="outline" size="sm">All Topics</Button>
          <Button variant="outline" size="sm">Digital Wellness</Button>
          <Button variant="outline" size="sm">Online Safety</Button>
          <Button variant="outline" size="sm">Mental Health</Button>
          <Button variant="outline" size="sm">Parenting Tips</Button>
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="text-sm text-primary font-medium mb-2">
                  {post.category}
                </div>
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Button variant="outline">Read More</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-12">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest articles and updates on digital wellness.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
