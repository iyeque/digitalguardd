import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Trophy, UserCircle2, Code, Crown } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Digital Guardian</h1>
        <p className="text-lg text-gray-600 mb-12">
          Digital Guardian was founded with a simple mission: to help families navigate the digital world safely and confidently. We believe in creating a positive digital environment where children can learn and grow while staying protected.
        </p>

        <div className="grid gap-8 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
                  <p className="text-gray-600">
                    To empower parents with the knowledge and tools they need to ensure their children's digital well-being and create a safe online environment for families.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Users className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Who We Are</h2>
                  <p className="text-gray-600 mb-6">
                    We're a team of digital safety experts, educators, and parents committed to making the internet a safer place for children. Our diverse backgrounds allow us to approach digital wellness from multiple perspectives.
                  </p>

                  {/* Leadership Team */}
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <UserCircle2 className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">Wilma Mwangi</h3>
                      <p className="text-sm text-primary mb-2">CEO/Co-founder</p>
                      <p className="text-sm text-gray-600">
                        Leading our mission to create safer digital spaces for families.
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <Code className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">Max Mwangi</h3>
                      <p className="text-sm text-primary mb-2">CTO/Co-founder</p>
                      <p className="text-sm text-gray-600">
                        Driving innovation in digital safety technology.
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <Crown className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">Elise Mwangi</h3>
                      <p className="text-sm text-primary mb-2">Chief Children Officer</p>
                      <p className="text-sm text-gray-600">
                        Ensuring our solutions work for young minds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Trophy className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Our Values</h2>
                  <p className="text-gray-600">
                    We believe in:
                    <ul className="list-disc ml-6 mt-2">
                      <li>Safety as our top priority</li>
                      <li>Education through engagement</li>
                      <li>Family-centered solutions</li>
                      <li>Continuous improvement and adaptation</li>
                    </ul>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-gray-600">
            We're always looking for passionate individuals and organizations to partner with us in creating a safer digital world for children. If you share our vision, we'd love to hear from you.
          </p>
        </div>
      </div>
    </div>
  );
}