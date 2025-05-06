import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/support">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Support
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-6">Comprehensive FAQ Resources</h1>
        <p className="text-lg text-gray-600 mb-12">
          Explore these trusted online resources for extensive digital safety FAQs and guides.
        </p>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Common Sense Media</h2>
              <p className="text-gray-600 mb-4">
                Comprehensive guides on digital parenting, screen time management, and age-appropriate content.
              </p>
              <a href="https://www.commonsensemedia.org" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">Visit Website</Button>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">ConnectSafely</h2>
              <p className="text-gray-600 mb-4">
                Expert advice on social media safety, cyberbullying prevention, and privacy protection.
              </p>
              <a href="https://www.connectsafely.org" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">Visit Website</Button>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Family Online Safety Institute</h2>
              <p className="text-gray-600 mb-4">
                Research-based resources on digital parenting and online safety best practices.
              </p>
              <a href="https://www.fosi.org" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">Visit Website</Button>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">NetSmartz</h2>
              <p className="text-gray-600 mb-4">
                Educational resources from the National Center for Missing & Exploited Children.
              </p>
              <a href="https://www.netsmartz.org" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">Visit Website</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}