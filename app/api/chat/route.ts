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
              parts: [{ text: "You are a professional, helpful real estate assistant for 'Ascend Properties' in Sri Lanka. Your ONLY role is to assist users with buying, selling, and renting properties in Sri Lanka (specifically Colombo). \n\nRULES:\n1. If a user asks about anything NOT related to real estate, properties, or Ascend Properties, politely decline and say you can only help with real estate queries.\n2. Be concise and professional.\n3. Do not invent specific property listings. If asked for listings, ask for their preferences (Budget, Location, Bed/Bath) so a human agent can assist.\n4. If they want to talk to a human, ask for their Name and Phone number." }]
            },
            {
              role: 'model',
              parts: [{ text: "Understood. I am a dedicated real estate assistant for Ascend Properties. I will strictly stick to real estate topics and refuse irrelevant queries." }]
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
