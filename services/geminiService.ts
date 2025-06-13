
import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters, Candidate as GeminiCandidate } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import type { GenerateContentGeminiResponse, Candidate } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Use non-null assertion as we check above and error handling should catch if it's truly missing at runtime.

const parseGeminiResponse = (response: GenerateContentResponse): GenerateContentGeminiResponse => {
  // Explicitly cast candidates if necessary, or ensure types.ts Candidate is a superset or compatible.
  // The fix in types.ts aims to make `types.ts#Candidate` compatible with `GeminiCandidate`.
  return {
    text: response.text,
    candidates: response.candidates as Candidate[] | undefined, // Cast to local Candidate type
  };
};

export const generateTextFromGemini = async (
  prompt: string,
  systemInstruction?: string,
  useGoogleSearch: boolean = false
): Promise<GenerateContentGeminiResponse> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }

  try {
    const generationParams: GenerateContentParameters = {
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {},
    };

    if (systemInstruction && generationParams.config) {
      generationParams.config.systemInstruction = systemInstruction;
    }
    
    if (useGoogleSearch && generationParams.config) {
        generationParams.config.tools = [{googleSearch: {}}];
        // Ensure responseMimeType is not set to application/json when using googleSearch
        if (generationParams.config.responseMimeType === "application/json") {
            delete generationParams.config.responseMimeType;
        }
    } else if (generationParams.config && !systemInstruction) { 
      // Ensure config object exists if no system instruction but other configs might be added by default or later.
      // This path is okay if config remains empty.
    }


    const response = await ai.models.generateContent(generationParams);
    return parseGeminiResponse(response);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred with the Gemini API.");
  }
};


export const generateJsonFromGemini = async <T,>(
  prompt: string,
  systemInstruction?: string
): Promise<T> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }
  try {
    const generationParams: GenerateContentParameters = {
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    };
     if (systemInstruction && generationParams.config) {
      generationParams.config.systemInstruction = systemInstruction;
    }

    const response = await ai.models.generateContent(generationParams);
    
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    try {
      const parsedData = JSON.parse(jsonStr);
      return parsedData as T;
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e, "Raw response:", jsonStr);
      throw new Error("Failed to parse JSON response from AI. The response was not valid JSON. Raw text: " + jsonStr);
    }
  } catch (error) {
    console.error("Error calling Gemini API for JSON:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred with the Gemini API.");
  }
};
