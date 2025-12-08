import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    if (response.text) {
      return response.text;
    }
    return "আমি দুঃখিত, আমি আপনার প্রশ্নের উত্তর দিতে পারছি না।";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "একটি প্রযুক্তিগত ত্রুটি হয়েছে। দয়া করে পরে আবার চেষ্টা করুন।";
  }
};