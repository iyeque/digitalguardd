import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "What's the recommended screen time for children under 5?",
    options: [
      "No more than 1 hour per day",
      "2-3 hours per day",
      "As much as they want",
      "Only on weekends"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    text: "What's the best way to manage family device usage?",
    options: [
      "Set clear rules and time limits",
      "Let everyone decide for themselves",
      "Only allow devices at school/work",
      "Ban all devices at home"
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    text: "What's a good rule for device use during meals?",
    options: [
      "No devices at the table",
      "Only for quick checks",
      "Only for educational content",
      "Allowed if eating alone"
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    text: "How can parents model good tech habits?",
    options: [
      "By using devices constantly",
      "Setting designated tech-free times",
      "Only using devices at work",
      "Never discussing tech use"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    text: "What's a good bedtime tech rule?",
    options: [
      "Devices allowed until sleepy",
      "No screens 1 hour before bed",
      "Only for relaxing content",
      "Allowed with night mode on"
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    text: "How should families handle social media use?",
    options: [
      "No rules needed",
      "Age-appropriate limits and monitoring",
      "Complete ban until 18",
      "Only allow anonymous accounts"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    text: "What's a healthy way to balance online/offline activities?",
    options: [
      "Spend all free time online",
      "Schedule regular device-free family time",
      "Only go offline when forced",
      "Alternate days online/offline"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    text: "How can tech support family bonding?",
    options: [
      "By watching videos separately",
      "Playing educational games together",
      "Texting from different rooms",
      "Sharing social media posts"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    text: "What's important about device charging locations?",
    options: [
      "Charge anywhere convenient",
      "Use a central family charging station",
      "Only charge in bedrooms",
      "Never charge overnight"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    text: "How should families handle tech disagreements?",
    options: [
      "Argue constantly",
      "Create clear family tech agreements",
      "Let kids decide everything",
      "Take away all devices as punishment"
    ],
    correctAnswer: 1
  }
];

interface FamilyTechChallengeProps {
  onBack: () => void;
}

export default function FamilyTechChallenge({ onBack }: FamilyTechChallengeProps) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
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
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
    
    timerRef.current = setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setGameOver(true);
      }
    }, 1000);
  }, [currentQuestion, selectedAnswer]);

  const resetGame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentQuestion(0);
    setScore(0);
    setGameOver(false);
    setSelectedAnswer(null);
  }, []);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      {!gameOver ? (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">
              Question {currentQuestion + 1}/{questions.length}
            </h2>
            <p className="text-lg">{questions[currentQuestion].text}</p>
          </div>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                className={`w-full justify-start ${
                  selectedAnswer === index 
                    ? index === questions[currentQuestion].correctAnswer
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
            Score: {score}/{questions.length}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
          <p className="text-lg mb-4">Your score: {score}/{questions.length}</p>
          {score === questions.length && (
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