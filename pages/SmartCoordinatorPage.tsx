
import React, { useState, useCallback } from 'react';
import { generateTextFromGemini } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import GeneratedContentDisplay from '../components/GeneratedContentDisplay';
import type { GenerateContentGeminiResponse } from '../types';
import { APP_NAME } from '../constants';

const SmartCoordinatorPage: React.FC = () => {
  const [userRequest, setUserRequest] = useState<string>('');
  const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<GenerateContentGeminiResponse | null>(null);

  const handleSubmitRequest = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userRequest.trim()) {
      setError('Please enter your community goal or task.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    const systemInstruction = `You are ${APP_NAME}, an intelligent community assistant. A user wants to: "${userRequest}". Your goal is to provide a helpful plan, actionable suggestions, or break down the tasks involved. Be concise, practical, and encouraging. If the request implies needing recent information or current events, use available tools to find that information and cite sources.`;
    
    try {
      const result = await generateTextFromGemini(userRequest, systemInstruction, useGoogleSearch);
      setAiResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [userRequest, useGoogleSearch]);

  return (
    <div className="space-y-8 p-4 md:p-6 bg-white rounded-xl shadow-xl">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-primary-dark mb-2">Smart Community Coordinator</h2>
        <p className="text-neutral-DEFAULT">Describe your community goal, and let AI help you plan and organize!</p>
      </header>

      <form onSubmit={handleSubmitRequest} className="space-y-4">
        <div>
          <label htmlFor="userRequest" className="block text-sm font-medium text-neutral-dark mb-1">What would you like to achieve or organize in your community?</label>
          <textarea
            id="userRequest"
            rows={4}
            value={userRequest}
            onChange={(e) => setUserRequest(e.target.value)}
            placeholder="e.g., 'Organize a neighborhood cleanup next month', 'Start a book club for local seniors', 'Find volunteers for the school fair'"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="useGoogleSearch"
            type="checkbox"
            checked={useGoogleSearch}
            onChange={(e) => setUseGoogleSearch(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="useGoogleSearch" className="ml-2 block text-sm text-neutral-dark">
            Enable Google Search for up-to-date information (if relevant)
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : `Ask ${APP_NAME} AI`}
        </button>
      </form>

      {isLoading && <LoadingSpinner text="Coordinating with AI..." />}
      
      <GeneratedContentDisplay
        title="AI Coordinator's Plan / Suggestions"
        geminiResponse={aiResponse}
        content={null}
        error={error}
        isLoading={isLoading} // The component itself will return null if this is true
      />
    </div>
  );
};

export default SmartCoordinatorPage;
