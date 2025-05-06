import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GamepadIcon, Star, Users, Clock } from "lucide-react";
import DigitalCitizenshipQuest from "@/components/games/DigitalCitizenshipQuest";
import DigitalSafetyAdventures from "@/components/games/DigitalSafetyAdventures";
import CyberDetective from "@/components/games/CyberDetective";
import FamilyTechChallenge from "@/components/games/FamilyTechChallenge";
import { GameCard } from "@/components/games/GameCard";

const games = [
  {
    id: 1,
    title: "Digital Safety Adventures",
    description:
      "Learn about online safety through an interactive adventure game.",
    ageRange: "8-12 years",
    players: "Single player",
    duration: "20-30 min",
    difficulty: "Beginner",
    category: "Safety",
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 2,
    title: "Cyber Detective",
    description: "Solve puzzles and learn about digital privacy and security.",
    ageRange: "10-14 years",
    players: "Single player",
    duration: "15-20 min",
    difficulty: "Intermediate",
    category: "Privacy",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: 3,
    title: "Family Tech Challenge",
    description:
      "A multiplayer quiz game about technology and digital wellness.",
    ageRange: "All ages",
    players: "2-4 players",
    duration: "25-30 min",
    difficulty: "Various",
    category: "Family",
    color: "from-orange-500/20 to-red-500/20",
  },
];

export default function Games() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const gameGridRef = useRef<HTMLDivElement | null>(null);

  const startGame = (gameId: number) => {
    setActiveGame(gameId.toString());
    gameGridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Educational Games
            </h1>
            <p className="text-lg text-gray-600">
              Learn digital literacy through interactive gameplay
            </p>
          </div>

          {activeGame ? (
            activeGame === "1" ? (
              <DigitalSafetyAdventures onBack={() => setActiveGame(null)} />
            ) : activeGame === "2" ? (
              <CyberDetective onBack={() => setActiveGame(null)} />
            ) : activeGame === "3" ? (
              <FamilyTechChallenge onBack={() => setActiveGame(null)} />
            ) : (
              <DigitalCitizenshipQuest onBack={() => setActiveGame(null)} />
            )
          ) : (
            <>
              {/* Featured Game */}
              <Card className="mb-12 overflow-hidden border-0 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm">
                <div className="grid md:grid-cols-2 gap-6 p-8">
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm font-medium text-primary">
                          Featured Game
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold mb-4"> {/* Gradient removed here */}
                        Digital Citizenship Quest
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Embark on an epic adventure to become a responsible
                        digital citizen. Master online etiquette and safety.
                      </p>
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-1 text-sm bg-background/50 px-3 py-1 rounded-full">
                          <Users className="h-4 w-4" />
                          Single player
                        </div>
                        <div className="flex items-center gap-1 text-sm bg-background/50 px-3 py-1 rounded-full">
                          <Clock className="h-4 w-4" />
                          30-40 min
                        </div>
                      </div>
                      <Button
                        onClick={() => startGame(4)} // Start highlighted game (Digital Citizenship Quest)
                        className="bg-gradient-to-r from-blue-400 to-purple-500 hover:bg-opacity-90 text-white"
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 rounded-2xl p-8">
                    <img
                      src="https://api.dicebear.com/7.x/pixel-art/svg?seed=digital-guardian&backgroundColor=b6e3f4&scale=180&pixelSize=24"
                      alt="Digital Citizenship Quest"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                </div>
              </Card>

              {/* Games Grid */}
              <div className="grid md:grid-cols-2 gap-6" ref={gameGridRef}>
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    {...game}
                    onStartGame={() => startGame(game.id)}
                  />
                ))}
              </div>

              {/* Achievements Section */}
              <div className="mt-16 text-center">
                <h2 className="text-3xl font-bold mb-8">
                  Game Achievements
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    "Safety Expert",
                    "Privacy Pro",
                    "Digital Citizen",
                    "Tech Master",
                  ].map((achievement) => (
                    <div
                      key={achievement}
                      className="bg-background/50 rounded-lg p-4 backdrop-blur-sm"
                    >
                      <div className="h-16 w-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                        <Star className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-sm font-medium">{achievement}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}