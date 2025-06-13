
import React, { useState, useCallback } from 'react';
import { generateTextFromGemini } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import GeneratedContentDisplay from '../components/GeneratedContentDisplay';
import type { ServiceListingItem, GenerateContentGeminiResponse } from '../types';
import { MOCK_SERVICE_CATEGORIES } from '../constants';

type ServiceExchangeActiveTool = 'description-ai' | null;

const ServiceExchangePage: React.FC = () => {
  const [serviceType, setServiceType] = useState<'offer' | 'need'>('offer');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>(MOCK_SERVICE_CATEGORIES[0]);
  
  const [listings, setListings] = useState<ServiceListingItem[]>([
    { id: '1', type: 'offer', title: 'Friendly Dog Walking', description: 'Experienced dog walker available weekday mornings. Love all breeds!', category: 'Dog Walking', contact: 'jane@example.com' },
    { id: '2', type: 'need', title: 'Help with Garden Weeding', description: 'Need someone to help tame my overgrown vegetable patch. Flexible hours.', category: 'Gardening', contact: 'tom@example.com' },
    { id: '3', type: 'offer', title: 'Basic Computer Tutoring', description: 'Patient tutoring for seniors wanting to learn email, internet, etc.', category: 'Tech Help', contact: 'sarah@example.com' },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiDescription, setAiDescription] = useState<GenerateContentGeminiResponse | null>(null);
  const [activeTool, setActiveTool] = useState<ServiceExchangeActiveTool>(null);

  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
        setError("Please fill in all fields for the listing.");
        setActiveTool(null); // Clear active tool as this is a manual submission
        return;
    }
    setError(null);
    const newListing: ServiceListingItem = {
      id: String(Date.now()),
      type: serviceType,
      title,
      description,
      category,
      contact: 'your_contact@example.com (mock)'
    };
    setListings(prev => [newListing, ...prev]);
    setTitle('');
    setDescription('');
    setCategory(MOCK_SERVICE_CATEGORIES[0]);
    setAiDescription(null); 
    setActiveTool(null); // Reset active tool and AI suggestions
  };

  const handleGenerateDescription = useCallback(async () => {
    if (!title) {
      setError('Please provide a title for your service/need first.');
      setActiveTool('description-ai'); // Set active tool to show error in context
      return;
    }
    setIsLoading(true);
    setError(null);
    setAiDescription(null);
    setActiveTool('description-ai');

    const serviceKind = serviceType === 'offer' ? 'I want to offer the following service' : 'I need help with the following';
    const prompt = `Help me write a compelling and friendly description for a community service listing.
    Type of listing: ${serviceType === 'offer' ? 'Service Offered' : 'Service Needed'}
    Title: "${title}"
    Category: "${category}"
    ${description ? `Current draft of description (optional, improve this): "${description}"` : ''}
    
    Please generate a concise (2-4 sentences) and appealing description. Focus on clarity and a positive tone.`;
    const systemInstruction = "You are an AI assistant helping community members write effective service exchange listings.";

    try {
      const result = await generateTextFromGemini(prompt, systemInstruction);
      setAiDescription(result);
      if (result.text) { 
        setDescription(result.text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [title, category, description, serviceType]);

  return (
    <div className="space-y-8 p-4 md:p-6 bg-white rounded-xl shadow-xl">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-primary-dark mb-2">Community Service Exchange</h2>
        <p className="text-neutral-DEFAULT">Offer your skills or find help from your neighbors. Let's support each other!</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <section className="p-6 bg-gray-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-primary-dark mb-4">Post a New Listing</h3>
          <form onSubmit={handleSubmitListing} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">I want to...</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as 'offer' | 'need')}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="offer">Offer a Service</option>
                <option value="need">Request Help / Service</option>
              </select>
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-dark mb-1">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Math Tutoring for Kids, Ride to Grocery Store"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-neutral-dark mb-1">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              >
                {MOCK_SERVICE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-dark mb-1">Description</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about the service you're offering or needing."
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
                 <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isLoading}
                    className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                    {isLoading && activeTool === 'description-ai' ? <LoadingSpinner size="sm" /> : 'Help me write description (AI)'}
                </button>
                 <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300"
                >
                    Post Listing
                </button>
            </div>
            {isLoading && activeTool === 'description-ai' && <LoadingSpinner text="Generating description..." />}
            <GeneratedContentDisplay
                title="AI Suggested Description"
                geminiResponse={aiDescription}
                content={null}
                error={activeTool === 'description-ai' ? error : null}
                isLoading={isLoading && activeTool === 'description-ai'}
            />
            {/* Display general form error if not related to AI description */}
            {error && activeTool !== 'description-ai' && <p className="text-sm text-red-600 mt-1">{error}</p>}

          </form>
        </section>

        {/* Listings Section */}
        <section>
          <h3 className="text-xl font-semibold text-primary-dark mb-4">Current Listings (Mock Data)</h3>
          {listings.length === 0 ? (
             <p className="text-neutral-DEFAULT">No listings yet. Be the first to post!</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {listings.map(listing => (
                <div key={listing.id} className={`p-4 rounded-lg shadow-md border-l-4 ${listing.type === 'offer' ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
                  <h4 className="font-semibold text-lg text-neutral-dark">{listing.title}</h4>
                  <p className="text-sm text-neutral-DEFAULT mb-1">Category: {listing.category} | Type: <span className="font-medium">{listing.type === 'offer' ? 'Offering' : 'Seeking'}</span></p>
                  <p className="text-sm text-gray-700">{listing.description}</p>
                  {listing.contact && <p className="text-xs text-gray-500 mt-2">Contact (mock): {listing.contact}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ServiceExchangePage;
