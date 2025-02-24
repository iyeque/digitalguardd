import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { HelpCircle, BookOpen, Video, MessageCircle } from "lucide-react";

export default function Support() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Support Center</h1>
        <p className="text-lg text-gray-600 mb-12">
          Find answers to common questions and get the help you need to ensure your family's digital well-being.
        </p>

        {/* Quick Help Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-semibold">Knowledge Base</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Browse our comprehensive guides and articles for detailed information.
              </p>
              <Link href="/resources/blog">
                <Button variant="outline" className="w-full">View Articles</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Video className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-semibold">Video Tutorials</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Watch step-by-step tutorials on digital safety and wellness.
              </p>
              <Link href="/resources/videos">
                <Button variant="outline" className="w-full">Watch Videos</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How can I set up parental controls?</AccordionTrigger>
              <AccordionContent>
                Setting up parental controls varies by device and platform. We recommend starting with built-in controls on your devices and then exploring additional software options. Check our detailed guides in the resources section for step-by-step instructions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What's the recommended screen time for children?</AccordionTrigger>
              <AccordionContent>
                Screen time recommendations vary by age. For children 2-5 years, limit to 1 hour per day. For older children, establish consistent limits and ensure screen time doesn't interfere with sleep, physical activity, and other healthy behaviors.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How can I monitor my child's online activity?</AccordionTrigger>
              <AccordionContent>
                We recommend a combination of open communication and monitoring tools. Start by setting clear guidelines, using family-friendly browsers, and installing reputable monitoring software. Visit our resources section for recommended tools and approaches.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>What should I do if my child encounters inappropriate content?</AccordionTrigger>
              <AccordionContent>
                Stay calm and use it as a teaching moment. Document the incident, report inappropriate content through the platform's reporting tools, and adjust parental controls as needed. Consider consulting our guides on handling online incidents.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Support */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="flex items-center gap-4 mb-6">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Need More Help?</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
          </p>
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
