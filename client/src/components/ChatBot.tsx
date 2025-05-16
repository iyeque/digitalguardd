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
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, {text: inputValue, sender: 'user'}]);
    setLoading(true);
    const userMessage = inputValue;
    setInputValue('');
    try {
      const res = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {text: data.reply || "Sorry, I couldn't generate a response.", sender: 'bot'}]);
    } catch (err) {
      setMessages(prev => [...prev, {text: "Sorry, there was an error contacting the assistant.", sender: 'bot'}]);
    } finally {
      setLoading(false);
    }
  };

  const getBotResponse = (message: string) => {
    const lowerMsg = message.toLowerCase();
    // Direct, authoritative answers for each topic
    if (["parental", "control", "restrict", "block", "limit"].some(k => lowerMsg.includes(k))) {
      return "To set up parental controls, use your device's built-in settings to restrict content, set screen time limits, and manage app access. Regularly review your child's device activity and adjust restrictions as needed for their age.";
    }
    if (["screen time", "how long", "limit time", "usage time", "device time"].some(k => lowerMsg.includes(k))) {
      return "Experts recommend consistent screen time limits based on age: for children 6 and older, encourage healthy habits and balance screen use with offline activities. Set device-free times, such as during meals and before bed.";
    }
    if (["monitor", "activity", "track", "supervise", "see what"].some(k => lowerMsg.includes(k))) {
      return "Monitor your child's online activity by checking their browsing history, using parental controls, and having open conversations about their digital life. Encourage them to share their online experiences with you.";
    }
    if (["cyberbullying", "bully", "harass", "mean online", "threat"].some(k => lowerMsg.includes(k))) {
      return "If your child is experiencing cyberbullying, save evidence, block the bully, and report the behavior to the platform. Support your child emotionally and contact school officials or authorities if needed.";
    }
    if (["privacy", "data", "personal info", "protect info", "safe online"].some(k => lowerMsg.includes(k))) {
      return "Teach your child not to share personal information online, use strong passwords, and adjust privacy settings on apps and social media. Remind them to be cautious about what they post and who they interact with.";
    }
    if (["predator", "stranger", "grooming", "unsafe contact"].some(k => lowerMsg.includes(k))) {
      return "Warn your child never to communicate with strangers online or share personal details. Teach them to recognize suspicious behavior and to tell a trusted adult if someone makes them uncomfortable.";
    }
    if (["social media", "instagram", "tiktok", "facebook", "snapchat", "twitter", "post online"].some(k => lowerMsg.includes(k))) {
      return "Discuss safe social media use: set privacy settings, think before posting, and only connect with people they know. Remind your child that online actions can have real-world consequences.";
    }
    if (["digital wellness", "well-being", "balance", "mental health", "healthy habits"].some(k => lowerMsg.includes(k))) {
      return "Promote digital wellness by encouraging regular breaks, device-free family time, and open conversations about feelings related to technology use. Model healthy tech habits yourself.";
    }
    if (["scam", "phishing", "fraud", "fake", "hack", "malware"].some(k => lowerMsg.includes(k))) {
      return "Teach your child to recognize scams and phishing: don't click suspicious links, avoid sharing passwords, and verify requests for information. Keep devices updated with security software.";
    }
    if (["digital safety", "online safety", "internet safety", "safe online", "protect family"].some(k => lowerMsg.includes(k))) {
      return "Practice digital safety by using strong passwords, enabling two-factor authentication, keeping software updated, and talking regularly about safe online behavior as a family.";
    }
    return "I'm here to help with digital safety questions. You can ask about parental controls, screen time, privacy, cyberbullying, digital wellness, or online safety. Let me know your concern for direct advice.";
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
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
              className="flex-1 rounded-md border px-3 py-2"
              placeholder="Type your question..."
              disabled={loading}
            />
            <Button onClick={handleSendMessage} disabled={loading}>{loading ? 'Sending...' : 'Send'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}