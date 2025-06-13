
import React from 'react';
import type { GroundingChunk, GenerateContentGeminiResponse } from '../types';

interface GeneratedContentDisplayProps {
  title?: string;
  content: string | null; // Can be a JSON string for certain contentTypes
  geminiResponse?: GenerateContentGeminiResponse | null;
  error?: string | null;
  isLoading: boolean;
  contentType?: 'text' | 'ideas' | 'logistics';
}

const GeneratedContentDisplay: React.FC<GeneratedContentDisplayProps> = ({ 
  title, 
  content, 
  geminiResponse, 
  error, 
  isLoading, 
  contentType = 'text' 
}) => {
  if (isLoading) return null; // Loading spinner is handled by parent
  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
        <h4 className="font-semibold text-lg mb-2">Error</h4>
        <p className="whitespace-pre-wrap">{error}</p>
      </div>
    );
  }
  
  const effectiveContent = content || geminiResponse?.text || "";
  if (!effectiveContent) return null;

  const groundingChunks = geminiResponse?.candidates?.[0]?.groundingMetadata?.groundingChunks;

  const renderContent = () => {
    if (contentType === 'ideas' && effectiveContent) {
      try {
        let ideasData;
        let jsonStr = effectiveContent.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }
        ideasData = JSON.parse(jsonStr);
        
        if (Array.isArray(ideasData) && ideasData.every(idea => idea.name && idea.description)) {
          return (
            <ul className="list-disc list-inside space-y-3">
              {ideasData.map((idea, index) => (
                <li key={index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <strong className="text-primary-dark">{idea.name}:</strong> {idea.description}
                </li>
              ))}
            </ul>
          );
        }
      } catch (e) {
        // If not valid JSON or not array of ideas, fall back to plain text
      }
    }
    // Default: render as pre-wrap text
    return <p className="whitespace-pre-wrap text-gray-700">{effectiveContent}</p>;
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
      {title && <h4 className="font-semibold text-xl text-neutral-dark mb-3">{title}</h4>}
      {renderContent()}
      {groundingChunks && groundingChunks.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h5 className="text-sm font-semibold text-neutral-DEFAULT mb-2">Sources:</h5>
          <ul className="list-disc list-inside space-y-1">
            {groundingChunks.filter(chunk => chunk.web && chunk.web.uri).map((chunk, index) => (
              <li key={index} className="text-xs">
                <a 
                  href={chunk.web!.uri!} // Added non-null assertion as we filter for uri
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-accent hover:underline"
                  title={chunk.web!.title || chunk.web!.uri!}
                >
                  {chunk.web!.title || chunk.web!.uri!}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeneratedContentDisplay;
