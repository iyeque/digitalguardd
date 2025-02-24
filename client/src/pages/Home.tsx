import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Book, Video, GamepadIcon, Crown } from "lucide-react";
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

      {/* Weekly Featured Resources */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured This Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog of the Week */}
            <Link href="/resources/blog">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-primary">Blog of the Week</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Setting Healthy Digital Boundaries</h3>
                  <p className="text-gray-600 mb-4">Learn effective strategies for establishing and maintaining digital boundaries that work for your family.</p>
                  <div className="text-sm text-gray-500">
                    By Dr. Sarah Chen • 8 min read
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Video of the Week */}
            <Link href="/resources/videos">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-primary">Video of the Week</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Understanding Screen Time Impact</h3>
                  <p className="text-gray-600 mb-4">Expert insights on managing screen time and its effects on child development.</p>
                  <div className="text-sm text-gray-500">
                    15 minutes • With Dr. Michael Thompson
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Game of the Week */}
            <Link href="/resources/games">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-primary">Game of the Week</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Digital Safety Adventures</h3>
                  <p className="text-gray-600 mb-4">An interactive game teaching kids about online safety through fun challenges.</p>
                  <div className="text-sm text-gray-500">
                    Ages 8-12 • 20-30 minutes
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Parents Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  {/* Star Rating */}
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Digital Guardian has helped our family establish healthy digital habits. The resources are practical and easy to implement."
                </p>
                <div className="text-sm font-medium">
                  Sarah M.
                  <span className="text-gray-500 ml-2">Parent of two</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The educational games have made learning about online safety fun for my kids. They actually look forward to their digital wellness lessons!"
                </p>
                <div className="text-sm font-medium">
                  John D.
                  <span className="text-gray-500 ml-2">Father of three</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The weekly content updates keep us engaged and informed about the latest digital wellness practices. An invaluable resource for modern parents."
                </p>
                <div className="text-sm font-medium">
                  Lisa R.
                  <span className="text-gray-500 ml-2">Mother of two</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}