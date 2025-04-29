import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

interface Puzzle {
  id: number;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const puzzles: Puzzle[] = [
  {
    id: 1,
    scenario: "You receive a friend request from someone you don't know.",
    question: "What's the safest action to take?",
    options: [
      "Accept and see what they post",
      "Ignore the request",
      "Accept but block them later if needed",
      "Ask mutual friends about them first"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    scenario: "A website asks for your phone number to continue.",
    question: "When is it okay to share?",
    options: [
      "Only on trusted sites with clear privacy policies",
      "If they promise not to share it",
      "When they offer a discount",
      "Never share your phone number online"
    ],
    correctAnswer: 0
  }
];

interface CyberDetectiveProps {
  onBack: () => void;
}

export default function CyberDetective({ onBack }: CyberDetectiveProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    if (answerIndex === puzzles[currentPuzzle].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
    
    timerRef.current = setTimeout(() => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setGameOver(true);
      }
    }, 1000);
  }, [currentPuzzle, selectedAnswer]);

  const resetGame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentPuzzle(0);
    setScore(0);
    setGameOver(false);
    setSelectedAnswer(null);
  }, []);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      {!gameOver ? (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-green-600 mb-1">Case #{currentPuzzle + 1}</h2>
            <p className="italic mb-2">{puzzles[currentPuzzle].scenario}</p>
            <h3 className="text-xl font-bold">{puzzles[currentPuzzle].question}</h3>
          </div>
          <div className="space-y-3">
            {puzzles[currentPuzzle].options.map((option, index) => (
              <Button
                key={index}
                className={`w-full justify-start ${
                  selectedAnswer === index 
                    ? index === puzzles[currentPuzzle].correctAnswer
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                    : ''
                }`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            ))}
          </div>
          <div className="mt-4 text-right">
            Solved: {score}/{puzzles.length}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Investigation Complete!</h2>
          <p className="text-lg mb-4">Your score: {score}/{puzzles.length}</p>
          {score === puzzles.length && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="font-medium">Perfect Score!</span>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame}>Try Again</Button>
            <Button variant="outline" onClick={onBack}>Back to Games</Button>
          </div>
        </div>
      )}
    </Card>
  );
}