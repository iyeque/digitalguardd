import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string; sender: 'user' | 'bot'}>>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {text: inputValue, sender: 'user'}]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {text: getBotResponse(inputValue), sender: 'bot'}]);
    }, 500);
    
    setInputValue('');
  };

  const getBotResponse = (message: string) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('parental') || lowerMsg.includes('control')) {
      return "You can set up parental controls through your device settings. Would you like step-by-step instructions for a specific device?";
    } else if (lowerMsg.includes('screen time')) {
      return "Recommended screen time varies by age. For children 2-5 years, limit to 1 hour per day. For older children, consistent limits are important.";
    } else if (lowerMsg.includes('monitor') || lowerMsg.includes('activity')) {
      return "We recommend using built-in device monitoring tools along with open communication. Our Resources section has detailed guides.";
    } else {
      return "I'm here to help with digital safety questions. You can ask about parental controls, screen time recommendations, or online safety tips.";
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Chat with Support</Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Digital Guardian Support</DialogTitle>
            <DialogDescription>
              Ask me about digital safety and parental controls
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 rounded-md border px-3 py-2"
              placeholder="Type your question..."
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}