import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { address, features, price, type } = await req.json();

    // Prompt Construction
    const prompt = `
      Act as a luxury real estate marketer in Colombo.
      Property Details:
      - Type: ${type}
      - Address: ${address}
      - Price: ${price}
      - Features: ${features}

      Write 3 versions of the copy. Return ONLY the content for each section, clearly separated.
      1. LinkedIn: Professional, focusing on investment ROI.
      2. Instagram: Lifestyle-focused, using emojis.
      3. Email Blast: Urgent tone, 'Just Listed'.
    `;

    let generatedContent = {
      linkedin: '',
      instagram: '',
      email: ''
    };

    if (process.env.GEMINI_API_KEY) {
       try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
           generatedContent.linkedin = text; 
        }
       } catch (geminiError) {
         console.error("Gemini API Error:", geminiError);
       }
    }

    // --- MOCK FALLBACK (If no keys or Gemini fails or empty response) ---
    if (!generatedContent.linkedin && !generatedContent.instagram) {
      console.warn("Using Mock Fallback for Marketing (GEMINI_API_KEY missing or error)");
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      generatedContent.linkedin = `🚀 **Prime Investment Opportunity in ${address}**\n\nAscend Properties is proud to present this exceptional ${type.toLowerCase()} located in the heart of the city.\n\nEverything you need for a high-yield portfolio:\nSound investment fundamental\n✅ ${features}\n✅ Competitive pricing at ${price}\n\nLocations like this in Colombo 03/07 demand high rental yields. Secure your viewing today.\n\n#RealEstate #ColomboProperty #Investment #LuxuryLiving`;

      generatedContent.instagram = `✨ Living the Dream at ${address} ✨\n\nImagine waking up to this view! 😍 This stunning ${type.toLowerCase()} just hit the market and it's GORGEOUS.\n\n💎 ${price}\n🌿 ${features}\n📍 Prime Location\n\nDm us for a tour! 🗝️\n\n#LuxuryLife #ColomboLiving #DreamHome #PropertyGoals 🇱🇰`;

      generatedContent.email = `Subject: JUST LISTED: ${type} at ${address} - Won't Last Long!\n\nDear Client,\n\nWe have just listed a hot property at ${address} that matches your search criteria.\n\nPrice: ${price}\nHighlights: ${features}\n\nThis is priced to sell and we expect high interest. Reply to this email correctly to schedule a priority viewing.\n\nBest,\nAscend Properties Team`;
    }

    return NextResponse.json(generatedContent);

  } catch (error) {
    console.error('Marketing Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
