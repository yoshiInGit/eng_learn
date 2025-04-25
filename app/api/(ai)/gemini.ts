import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

export const invokeGemini = async ({prompt}: {prompt:string}) : Promise<string>=> {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      return response.text ?? "Error res";
}