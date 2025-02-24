import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const blogPosts = [
  {
    id: 1,
    title: "The Importance of Digital Literacy in Today's World",
    excerpt: "Digital literacy is no longer optional - it's a fundamental skill for success in today's interconnected world.",
    content: `Digital literacy has become as essential as traditional literacy in today's world. It encompasses:

    1. Understanding digital tools and platforms
    2. Critical thinking in the digital space
    3. Online safety and security awareness
    4. Effective digital communication
    5. Information evaluation and verification

    In our increasingly connected world, these skills are crucial for:
    - Academic success
    - Professional development
    - Personal safety
    - Informed decision-making
    - Active digital citizenship`,
    author: "Wilma Mwangi",
    date: "February 24, 2024",
    readTime: "7 min read",
    category: "Digital Education"
  },
  {
    id: 2,
    title: "Protecting Your Digital Identity: A Comprehensive Guide",
    excerpt: "Your digital identity is precious. Learn how to protect it effectively in an increasingly connected world.",
    content: `Protecting your digital identity is crucial in our interconnected world. Here's a comprehensive guide:

    Key Steps for Digital Identity Protection:
    1. Use strong, unique passwords
    2. Enable two-factor authentication
    3. Regularly monitor your accounts
    4. Be cautious with personal information sharing
    5. Keep software and systems updated

    Remember:
    - Your digital footprint is permanent
    - Regular security audits are essential
    - Privacy settings need regular reviews
    - Be selective about online connections
    - Trust but verify online interactions`,
    author: "Max Mwangi",
    date: "February 23, 2024",
    readTime: "8 min read",
    category: "Online Safety"
  },
  {
    id: 3,
    title: "Digital Well-being: Finding Balance in a Connected World",
    excerpt: "Maintaining digital well-being is essential for mental health and productivity in our technology-driven society.",
    content: `Digital well-being is about finding harmony between technology use and personal health:

    Essential Practices:
    1. Set clear boundaries for device usage
    2. Practice digital detox regularly
    3. Maintain healthy online relationships
    4. Create tech-free zones and times
    5. Focus on quality over quantity in digital interactions

    Benefits of Digital Balance:
    - Improved mental health
    - Better sleep patterns
    - Enhanced real-world relationships
    - Increased productivity
    - Reduced stress and anxiety

    Remember: Technology should enhance, not control, your life.`,
    author: "Dr. Sarah Chen",
    date: "February 22, 2024",
    readTime: "6 min read",
    category: "Digital Wellness"
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
          <Button variant="outline" size="sm">Digital Education</Button>
          <Button variant="outline" size="sm">Online Safety</Button>
          <Button variant="outline" size="sm">Digital Wellness</Button>
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="text-sm text-primary font-medium mb-2">
                  {post.category}
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="hover:no-underline">
                      <h2 className="text-2xl font-bold text-left">{post.title}</h2>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose max-w-none mt-4">
                        <p className="whitespace-pre-line">{post.content}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
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