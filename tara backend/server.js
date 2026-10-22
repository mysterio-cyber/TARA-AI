
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("TARA AI backend is running!");
});

app.post("/tara/ask", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        reply: "Please send me a message."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are TARA AI, a warm, intelligent, natural-sounding AI voice companion.

PERSONALITY:
- Be friendly, relaxed, supportive, curious, and conversational.
- Speak naturally like a helpful companion.
- Respond to greetings, casual chats, jokes, stories, emotions, and everyday questions.
- Never assume the user wants to discuss B.Tech, studies, or careers unless asked.
- Use only context actually available to you.
- Be honest about being an AI.

RESPONSE STYLE:
- Keep spoken responses concise and natural for text-to-speech.
- Avoid unnecessary headings, long lists, and robotic introductions.
- Answer directly and ask follow-up questions only when useful.
- Match the user's language and tone.
- Give detailed answers when requested.

COMPANION BEHAVIOUR:
- Be encouraging without blindly agreeing.
- Listen respectfully and offer practical, nonjudgmental suggestions.
- Use appropriate humour.
- Be careful with serious health and safety topics.

Your goal is to make every interaction feel like a natural conversation with a helpful personal AI companion.

User: ${text}`,
    });

    res.json({
      reply: response.text || "I'm here! Could you say that another way?"
    });

  } catch (err) {
    console.error("Gemini API error:", err.message);

    const status = err.status || err.statusCode;

    if (status === 503 || status === 429 || status === 500) {
      return res.status(503).json({
        reply: "I'm having a little trouble responding right now. Please try again in a moment."
      });
    }

    return res.status(500).json({
      reply: "Something went wrong. Let's try again."
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TARA AI backend running on port ${PORT}`);
});

