import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GamepadIcon, Star, Users, Clock } from "lucide-react";

const games = [
  {
    id: 1,
    title: "Digital Safety Adventures",
    description: "Learn about online safety through an interactive adventure game.",
    ageRange: "8-12 years",
    players: "Single player",
    duration: "20-30 min",
    difficulty: "Beginner",
    category: "Safety"
  },
  {
    id: 2,
    title: "Cyber Detective",
    description: "Solve puzzles and learn about digital privacy and security.",
    ageRange: "10-14 years",
    players: "Single player",
    duration: "15-20 min",
    difficulty: "Intermediate",
    category: "Privacy"
  },
  {
    id: 3,
    title: "Family Tech Challenge",
    description: "A multiplayer quiz game about technology and digital wellness.",
    ageRange: "All ages",
    players: "2-4 players",
    duration: "25-30 min",
    difficulty: "Various",
    category: "Family"
  }
];

export default function Games() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Educational Games</h1>
        <p className="text-lg text-gray-600 mb-12">
          Explore our collection of interactive games designed to teach digital literacy and online safety in a fun way.
        </p>

        {/* Game Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button variant="outline" size="sm">All Games</Button>
          <Button variant="outline" size="sm">Safety Games</Button>
          <Button variant="outline" size="sm">Privacy Games</Button>
          <Button variant="outline" size="sm">Family Games</Button>
        </div>

        {/* Featured Game */}
        <Card className="mb-12 overflow-hidden">
          <div className="aspect-video bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
            <GamepadIcon className="h-16 w-16 text-primary" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Featured Game</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Digital Citizenship Quest</h2>
            <p className="text-gray-600 mb-4">
              Embark on an epic adventure to become a responsible digital citizen. Learn about online etiquette, safety, and digital well-being through exciting challenges.
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                Single player
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                30-40 min
              </div>
              <div className="text-sm text-primary font-medium">
                Ages 10+
              </div>
            </div>
            <Button>Play Now</Button>
          </CardContent>
        </Card>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {games.map((game) => (
            <Card key={game.id}>
              <CardContent className="pt-6">
                <div className="text-sm text-primary font-medium mb-2">
                  {game.category}
                </div>
                <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    {game.players}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {game.duration}
                  </div>
                  <div className="text-sm text-primary font-medium">
                    Ages: {game.ageRange}
                  </div>
                </div>
                <Button variant="outline">Start Game</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Achievements */}
        <Card className="mt-12">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Game Achievements</h2>
            <p className="text-gray-600 mb-6">
              Track your progress and earn badges as you learn about digital wellness through our games.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Safety Expert', 'Privacy Pro', 'Digital Citizen', 'Tech Master'].map((achievement) => (
                <div key={achievement} className="text-center">
                  <div className="h-16 w-16 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-sm font-medium">{achievement}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
