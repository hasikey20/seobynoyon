import { GoogleGenAI, Type } from "@google/genai";
import { Platform, SeoConfig, SeoResult } from "../types";

// Helper to convert file to base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getAiInstance = (apiKey?: string) => {
  return new GoogleGenAI({ apiKey: apiKey || process.env.API_KEY });
};

export const generateSeoData = async (
  file: File,
  platform: Platform,
  config: SeoConfig
): Promise<SeoResult> => {
  
  const ai = getAiInstance(config.apiKey);
  const base64Data = await fileToGenerativePart(file);

  const prompt = `
    Analyze the uploaded stock image for the platform: ${platform}.
    
    Requirements:
    1. Title: Create a SEO-friendly title between ${config.minTitleWords} and ${config.maxTitleWords} words.
    2. Description: Write a detailed description between ${config.minDescWords} and ${config.maxDescWords} words.
    3. Keywords: Generate between ${config.minKeywords} and ${config.maxKeywords} relevant keywords (tags).
    4. Language: ${config.language}.
    5. Tone: ${config.tone}.
    
    Focus on visual elements, concepts, lighting, and potential usage scenarios suitable for stock photography.
  `;

  // Define the schema for structured JSON output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "The SEO optimized title" },
      description: { type: Type.STRING, description: "The detailed description" },
      keywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of relevant keywords"
      }
    },
    required: ["title", "description", "keywords"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Lower temperature for more precise/factual tags
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as SeoResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateImagePrompt = async (
  file: File,
  config: SeoConfig
): Promise<string> => {
  const ai = getAiInstance(config.apiKey);
  const base64Data = await fileToGenerativePart(file);

  const prompt = `
    Analyze this image and create a highly detailed text prompt that could be used to recreate it using a generative AI model (like Midjourney, Stable Diffusion, or Dall-E).
    
    Include details about:
    - Subject matter and action
    - Art style, medium, and technique
    - Lighting, color palette, and atmosphere
    - Composition and camera angle
    
    Output Format: A single, descriptive paragraph. 
    Language: ${config.language}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        temperature: 0.7, // Higher temperature for more creative descriptions
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return text.trim();

  } catch (error) {
    console.error("Gemini API Error (Prompt):", error);
    throw error;
  }
};