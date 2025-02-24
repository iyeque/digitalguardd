import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Book, Video, GamepadIcon } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Protecting Your Family's Digital Well-being
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Digital Guardian helps parents create a safe and healthy digital environment for their children through education, resources, and support.
            </p>
            <div className="space-x-4">
              <Link href="/resources/blog">
                <Button size="lg">Explore Resources</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How We Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Safety First</h3>
                <p className="text-gray-600">
                  Learn about online safety measures and implement effective digital boundaries.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Book className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Educational Resources</h3>
                <p className="text-gray-600">
                  Access expert articles and guides on digital wellness and parenting.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <GamepadIcon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
                <p className="text-gray-600">
                  Engage with educational games and activities designed for families.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Preview */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/resources/blog">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Book className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Blog</h3>
                  <p className="text-gray-600">Expert articles and guides</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/resources/videos">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Video className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Videos</h3>
                  <p className="text-gray-600">Educational video content</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/resources/games">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <GamepadIcon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Games</h3>
                  <p className="text-gray-600">Interactive learning games</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
