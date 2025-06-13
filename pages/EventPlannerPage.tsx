
import React, { useState, useCallback } from 'react';
import { generateTextFromGemini, generateJsonFromGemini } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import GeneratedContentDisplay from '../components/GeneratedContentDisplay';
import type { EventIdea, GenerateContentGeminiResponse } from '../types';
import { MOCK_EVENT_TYPES } from '../constants';
import { LightBulbIcon, ClipboardDocumentListIcon, EnvelopeIcon } from '../components/icons/NavIcons';


type ActiveTool = 'ideas' | 'logistics' | 'sponsorship' | null;

const EventPlannerPage: React.FC = () => {
  const [eventType, setEventType] = useState<string>(MOCK_EVENT_TYPES[0]);
  const [eventDescription, setEventDescription] = useState<string>('');
  const [communityFocus, setCommunityFocus] = useState<string>('local neighborhood');
  const [sponsorTarget, setSponsorTarget] = useState<string>('local businesses');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<EventIdea[] | null>(null);
  const [generatedLogistics, setGeneratedLogistics] = useState<GenerateContentGeminiResponse | null>(null);
  const [generatedSponsorship, setGeneratedSponsorship] = useState<GenerateContentGeminiResponse | null>(null);

  const [activeTool, setActiveTool] = useState<ActiveTool>(null);

  const handleGenerate = useCallback(async (tool: ActiveTool) => {
    if (!eventDescription && (tool === 'logistics' || tool === 'sponsorship')) {
      setError('Please provide an event description.');
      setActiveTool(tool); // Set active tool even on error to show error in correct section
      return;
    }
    if (!eventType && tool === 'ideas') {
      setError('Please select or provide an event type.');
      setActiveTool(tool); // Set active tool even on error to show error in correct section
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveTool(tool);
    // Reset specific content based on the tool
    if (tool === 'ideas') setGeneratedIdeas(null);
    if (tool === 'logistics') setGeneratedLogistics(null);
    if (tool === 'sponsorship') setGeneratedSponsorship(null);


    try {
      let prompt = '';
      let systemInstruction = "You are an AI assistant helping to plan community events. Be creative, practical, and encouraging.";

      if (tool === 'ideas') {
        prompt = `Generate 5 creative event ideas for a "${eventType}" in a "${communityFocus}" community. For each idea, provide a catchy name and a brief 1-2 sentence description. Format the output as a JSON array of objects, where each object has a "name" and "description" key.`;
        systemInstruction = "You are an AI assistant specialized in brainstorming event ideas. Provide output in the requested JSON format."
        const ideas = await generateJsonFromGemini<EventIdea[]>(prompt, systemInstruction);
        setGeneratedIdeas(ideas);
      } else if (tool === 'logistics') {
        prompt = `Create a checklist of key logistical steps for organizing an event: "${eventDescription}". The event type is "${eventType}". Categorize the steps if possible (e.g., Pre-event, During Event, Post-event). Provide a detailed and practical plan.`;
        const logistics = await generateTextFromGemini(prompt, systemInstruction);
        setGeneratedLogistics(logistics);
      } else if (tool === 'sponsorship') {
        prompt = `Draft a persuasive and concise sponsorship request message for an event called "${eventDescription || 'our community event'}". This event is a "${eventType}". The target audience for this message is potential ${sponsorTarget}. Include placeholders like [Contact Person] or [Sponsorship Package Link] where appropriate. Make it sound professional yet community-focused.`;
        const sponsorshipEmail = await generateTextFromGemini(prompt, systemInstruction);
        setGeneratedSponsorship(sponsorshipEmail);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      // Content for the failed tool is already null from above
    } finally {
      setIsLoading(false);
    }
  }, [eventType, eventDescription, communityFocus, sponsorTarget]);

  const renderButton = (toolName: ActiveTool, buttonText: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => handleGenerate(toolName)}
      disabled={isLoading}
      className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
    >
      {isLoading && activeTool === toolName ? <LoadingSpinner size="sm" /> : icon}
      <span className="ml-2">{buttonText}</span>
    </button>
  );
  
  return (
    <div className="space-y-8 p-4 md:p-6 bg-white rounded-xl shadow-xl">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-primary-dark mb-2">AI Event Planner</h2>
        <p className="text-neutral-DEFAULT">Let's bring your community event to life! Fill in some details and let AI assist you.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-neutral-dark mb-1">Event Type</label>
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          >
            {MOCK_EVENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            <option value="Other">Other (describe below)</option>
          </select>
        </div>
        <div>
          <label htmlFor="communityFocus" className="block text-sm font-medium text-neutral-dark mb-1">Community Focus (for ideas)</label>
          <input
            type="text"
            id="communityFocus"
            value={communityFocus}
            onChange={(e) => setCommunityFocus(e.target.value)}
            placeholder="e.g., local neighborhood, online gaming community"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label htmlFor="eventDescription" className="block text-sm font-medium text-neutral-dark mb-1">Event Name / Brief Description</label>
        <textarea
          id="eventDescription"
          rows={3}
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          placeholder="e.g., 'Annual Summer Fest in Willow Creek Park' or 'Coding workshop for beginners'"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          required
        />
      </div>
      
      <div>
          <label htmlFor="sponsorTarget" className="block text-sm font-medium text-neutral-dark mb-1">Target for Sponsorship (for sponsorship email)</label>
          <input
            type="text"
            id="sponsorTarget"
            value={sponsorTarget}
            onChange={(e) => setSponsorTarget(e.target.value)}
            placeholder="e.g., local businesses, tech companies, art foundations"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        {renderButton('ideas', 'Generate Ideas', <LightBulbIcon className="w-5 h-5" />)}
        {renderButton('logistics', 'Outline Logistics', <ClipboardDocumentListIcon className="w-5 h-5" />)}
        {renderButton('sponsorship', 'Draft Sponsorship Email', <EnvelopeIcon className="w-5 h-5" />)}
      </div>

      {isLoading && activeTool && <LoadingSpinner text={`Generating ${activeTool}...`} />}
      
      <GeneratedContentDisplay
        title="Generated Event Ideas"
        content={generatedIdeas ? JSON.stringify(generatedIdeas, null, 2) : null} // Pass string for parsing in child
        geminiResponse={null}
        error={activeTool === 'ideas' ? error : null}
        isLoading={isLoading && activeTool === 'ideas'}
        contentType="ideas"
      />
      <GeneratedContentDisplay
        title="Generated Logistics Plan"
        geminiResponse={generatedLogistics}
        content={null} // use geminiResponse directly
        error={activeTool === 'logistics' ? error : null}
        isLoading={isLoading && activeTool === 'logistics'}
        contentType="logistics"
      />
      <GeneratedContentDisplay
        title="Generated Sponsorship Email"
        geminiResponse={generatedSponsorship}
        content={null} // use geminiResponse directly
        error={activeTool === 'sponsorship' ? error : null}
        isLoading={isLoading && activeTool === 'sponsorship'}
      />
    </div>
  );
};

export default EventPlannerPage;
