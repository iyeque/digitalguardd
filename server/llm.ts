import type { Request, Response } from "express";
import fetch from "node-fetch";

// Hugging Face API integration
const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_API_URL = "https://api-inference.huggingface.co/models/openchat/openchat-3.5-1210";

export async function handleLLM(req: Request, res: Response) {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HF_API_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: [
          { role: "system", content: "You are a helpful digital safety assistant for parents." },
          { role: "user", content: message },
        ],
        parameters: {
          max_new_tokens: 256,
          temperature: 0.7
        }
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: errorText });
    }
    const data = await response.json();
    // Hugging Face returns an array or object depending on endpoint/model
    let botReply = "Sorry, I couldn't generate a response.";
    if (Array.isArray(data) && data[0] && typeof data[0] === "object" && "generated_text" in data[0]) {
      botReply = data[0].generated_text;
    } else if (typeof data === "object" && data !== null && "generated_text" in data) {
      botReply = typeof data.generated_text === "string" ? data.generated_text : String(data.generated_text);
    } else if (typeof data === "object" && data !== null && "error" in data) {
      botReply = `Error: ${data.error}`;
    }
    res.json({ reply: botReply });
  } catch (error) {
    let errorMessage = "LLM request failed";
    if (error && typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
      errorMessage = (error as any).message;
    }
    res.status(500).json({ error: errorMessage });
  }
}