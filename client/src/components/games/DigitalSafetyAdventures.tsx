import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

interface Scenario {
  id: number;
  situation: string;
  choices: {
    text: string;
    isSafe: boolean;
    feedback: string;
  }[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    situation: "You receive a message from someone claiming to be from a game company, asking for your password.",
    choices: [
      {
        text: "Give them your password",
        isSafe: false,
        feedback: "Never share passwords! Companies will never ask for them."
      },
      {
        text: "Ignore the message",
        isSafe: true,
        feedback: "Good choice! It's best to ignore suspicious messages."
      },
      {
        text: "Ask a parent or guardian",
        isSafe: true,
        feedback: "Excellent! Always check with a trusted adult about suspicious messages."
      }
    ]
  },
  {
    id: 2,
    situation: "You see a pop-up saying you won a prize and need to click to claim it.",
    choices: [
      {
        text: "Click to claim the prize",
        isSafe: false,
        feedback: "This could be a scam! Never click on unexpected prize offers."
      },
      {
        text: "Close the pop-up",
        isSafe: true,
        feedback: "Smart move! It's best to close unexpected pop-ups."
      },
      {
        text: "Tell an adult about it",
        isSafe: true,
        feedback: "Great decision! Always tell an adult about suspicious online offers."
      }
    ]
  }
];

interface DigitalSafetyAdventuresProps {
  onBack: () => void;
}

export default function DigitalSafetyAdventures({ onBack }: DigitalSafetyAdventuresProps) {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChoice = useCallback((choiceIndex: number) => {
    if (selectedChoice !== null) return;

    setSelectedChoice(choiceIndex);
    if (scenarios[currentScenario].choices[choiceIndex].isSafe) {
      setScore(prevScore => prevScore + 1);
    }
    setShowFeedback(true);
    
    timerRef.current = setTimeout(() => {
      setShowFeedback(false);
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setSelectedChoice(null);
      } else {
        setGameOver(true);
      }
    }, 2000);
  }, [currentScenario, selectedChoice]);

  const resetGame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentScenario(0);
    setScore(0);
    setGameOver(false);
    setSelectedChoice(null);
    setShowFeedback(false);
  }, []);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      {!gameOver ? (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 text-blue-600">
              Adventure {currentScenario + 1}/{scenarios.length}
            </h2>
            <p className="text-lg">{scenarios[currentScenario].situation}</p>
          </div>
          <div className="space-y-3">
            {scenarios[currentScenario].choices.map((choice, index) => (
              <Button
                key={index}
                className={`w-full justify-start ${
                  selectedChoice === index 
                    ? choice.isSafe
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                    : ''
                }`}
                onClick={() => handleChoice(index)}
                disabled={selectedChoice !== null}
              >
                {choice.text}
              </Button>
            ))}
          </div>
          {showFeedback && (
            <div className="mt-4 p-4 bg-background/50 rounded-lg">
              <p>{scenarios[currentScenario].choices[selectedChoice!].feedback}</p>
            </div>
          )}
          <div className="mt-4 text-right">
            Safe Choices: {score}/{currentScenario + 1}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-purple-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Adventure Complete!</h2>
          <p className="text-lg mb-4">Your score: {score}/{scenarios.length}</p>
          {score === scenarios.length && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="font-medium">Perfect Score!</span>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame}>Play Again</Button>
            <Button variant="outline" onClick={onBack}>Back to Games</Button>
          </div>
        </div>
      )}
    </Card>
  );
}