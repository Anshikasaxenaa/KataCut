import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    // Optional: Protect the route to only logged in users if needed, 
    // but for zero-knowledge local mode, we allow it without a session.
    
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text payload is required' }, { status: 400 });
    }

    // Call Gemini 2.5 Flash to extract subscriptions
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are an expert financial data extractor. I will provide raw text from a bank statement or SMS.
      Your task is to find all recurring subscriptions and return them as a JSON array.
      
      For each subscription, extract:
      - merchant: The name of the service (e.g. Netflix, Spotify).
      - amount: The amount billed as a number.
      - frequency: 'monthly' or 'yearly'.
      - date: The date of the transaction if available (ISO string).
      - customDetails: Any interesting insights not explicitly stated, such as "High cancellation difficulty", "Video Streaming category", or hidden fees/international charges.

      Return ONLY valid JSON matching this structure:
      {
        "subscriptions": [
          { "merchant": string, "amount": number, "frequency": string, "date": string, "customDetails": string }
        ]
      }
      
      Here is the text:
      ${text}`,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const output = response.text;
    if (!output) {
      throw new Error("No output from model");
    }

    const parsed = JSON.parse(output);

    // Return the JSON directly to the client. We do NOT store it in our database here!
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Error analyzing statement:', error);
    return NextResponse.json({ error: 'Failed to analyze statement' }, { status: 500 });
  }
}
