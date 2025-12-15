import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
// Uses the API Key from .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const chat = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: "You are a helpful, professional real estate agent assistant for Ascend Properties in Sri Lanka. Your goal is to qualify leads by asking about their budget, location preferences (focus on Colombo), and whether they want to Buy, Sell, or Rent. Be concise and polite. Do not invent property listings. If you don't know, ask if they want a human agent to call." }]
            },
            {
              role: 'model',
              parts: [{ text: "Understood. I am ready to assist Ascend Properties clients." }]
            }
          ]
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const reply = response.text();

        return NextResponse.json({ reply });
      } catch (geminiError) {
        console.error("Gemini API Error:", geminiError);
      }
    }

    // --- MOCK FALLBACK (If no keys or Gemini fails) ---
    console.warn("Using Mock Fallback for Chat (GEMINI_API_KEY missing or error)");
    const userMessage = message.toLowerCase();
    let reply = "I'm sorry, can you please rephrase that?";

    if (userMessage.includes('buy') || userMessage.includes('sell') || userMessage.includes('rent')) {
      reply = "That's great! To help you better, could you tell me your budget range or preferred location in Colombo?";
    } else if (userMessage.includes('budget') || userMessage.includes('location') || userMessage.includes('colombo')) {
      reply = "Understood. I have a few properties that might interest you. Would you like a human agent to call you with more details?";
    } else if (userMessage.includes('yes') || userMessage.includes('call')) {
      reply = "Perfect! Please provide your Name and Phone Number, and one of our agents will contact you shortly.";
    } else if (/\d/.test(userMessage) && (userMessage.includes('name') || userMessage.length > 3)) {
      reply = "Thank you! Your details have been saved. An agent will be in touch within 15 minutes.";
    } else if (userMessage.includes('hi') || userMessage.includes('hello')) {
      reply = "Welcome to Ascend Properties! Are you looking to Buy, Sell, or Rent today?";
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
