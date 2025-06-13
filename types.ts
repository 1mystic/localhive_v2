
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

export interface EventIdea {
  name: string;
  description: string;
}

export interface ServiceListingItem {
  id: string;
  type: 'offer' | 'need';
  title: string;
  description: string;
  category: string;
  contact?: string; // Optional, as it's mock
}

// Gemini API related types
export interface GroundingChunkWeb {
  uri?: string; // Made optional to match @google/genai
  title?: string; // Made optional to match @google/genai
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Other types of chunks can be added here if needed
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // Other candidate fields
  // Ensure this Candidate interface is compatible with @google/genai's Candidate type
  // This might involve adding other properties from the library's Candidate type if they are accessed.
  // For the current usage, only groundingMetadata is explicitly used in GeneratedContentDisplay.
}

export interface GenerateContentGeminiResponse {
  text: string;
  candidates?: Candidate[]; // This uses the local Candidate type above
}
