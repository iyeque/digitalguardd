import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GameCardProps {
  id: number;
  title: string;
  description: string;
  ageRange: string;
  players: string;
  duration: string;
  difficulty?: string;
  category: string;
  color: string;
  onStartGame: () => void;
}

export function GameCard({
  title,
  description,
  ageRange,
  players,
  duration,
  category,
  color,
  onStartGame,
}: GameCardProps) {
  return (
    <Card className={`overflow-hidden border-0 bg-gradient-to-r ${color}`}>
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="bg-background/40 p-4 rounded-lg">
            <img
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${title}&backgroundColor=transparent&scale=120&pixelSize=16`}
              alt={title}
              className="w-16 h-16"
            />
          </div>
          <div>
            <div className="text-sm font-medium mb-1 opacity-80">
              {category}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
          </div>
        </div>
        <p className="text-sm mt-4 mb-4 opacity-90">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="text-xs bg-background/30 px-2 py-1 rounded-full">
            {players}
          </div>
          <div className="text-xs bg-background/30 px-2 py-1 rounded-full">
            {duration}
          </div>
          <div className="text-xs bg-background/30 px-2 py-1 rounded-full">
            Ages: {ageRange}
          </div>
        </div>
        <Button
          variant="secondary"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:bg-opacity-70 text-white"
          onClick={onStartGame}
        >
          Start Game
        </Button>
      </div>
    </Card>
  );
}