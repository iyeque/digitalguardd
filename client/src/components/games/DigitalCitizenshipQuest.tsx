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
    text: "What should you do if someone online asks for your personal information?",
    options: [
      "Share it if they seem friendly",
      "Never share personal information with strangers",
      "Ask them for their information first",
      "Share only your address"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "Which password is the strongest?",
    options: [
      "password123",
      "birthdaydate",
      "P@ssw0rd!2024",
      "qwerty"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    text: "What should you do before sharing something online?",
    options: [
      "Share it immediately",
      "Think about the impact and if it's appropriate",
      "Ask strangers for their opinion",
      "Share it only at night"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    text: "What's the best way to respond to cyberbullying?",
    options: [
      "Respond with insults",
      "Ignore and report it",
      "Delete your account",
      "Share it publicly"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    text: "How often should you update your passwords?",
    options: [
      "Never",
      "Every 3-6 months",
      "Only when you forget them",
      "Every week"
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    text: "What should you do if you see inappropriate content online?",
    options: [
      "Share it with friends",
      "Report it and leave the page",
      "Comment on it",
      "Save it for later"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    text: "What information is safe to share in online profiles?",
    options: [
      "Your full name and address",
      "Only general interests and hobbies",
      "Your daily schedule",
      "Your pet's name"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    text: "What's the safest way to use public WiFi?",
    options: [
      "For all activities",
      "Only for browsing, not logging in",
      "For online banking",
      "For shopping with credit cards"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    text: "How can you verify if a website is secure?",
    options: [
      "By its design",
      "Check for HTTPS and a padlock icon",
      "If it has lots of ads",
      "If it ranks high in search results"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    text: "What should you do with old devices before disposing of them?",
    options: [
      "Throw them away",
      "Factory reset and wipe all data",
      "Give them to strangers",
      "Sell them as-is"
    ],
    correctAnswer: 1
  }
];

interface DigitalCitizenshipQuestProps {
  onBack: () => void;
}

export default function DigitalCitizenshipQuest({ onBack }: DigitalCitizenshipQuestProps) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent extra clicks

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
          <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
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
