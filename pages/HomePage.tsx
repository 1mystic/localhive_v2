
import React from 'react';
import FeatureCard from '../components/FeatureCard';
import type { Feature } from '../types';
import { CalendarDaysIcon, SparklesIcon, PuzzlePieceIcon } from '../components/icons/NavIcons';
import { APP_NAME } from '../constants';

const HomePage: React.FC = () => {
  const features: Feature[] = [
    {
      id: 'event-planner',
      title: 'AI Event Planner',
      description: 'Brainstorm ideas, outline logistics, and get help with outreach for your local events.',
      icon: <CalendarDaysIcon className="w-8 h-8" />,
      path: '/event-planner',
    },
    {
      id: 'service-exchange',
      title: 'Community Services',
      description: 'Offer your skills or find help from neighbors. AI can help you craft the perfect listing.',
      icon: <PuzzlePieceIcon className="w-8 h-8" />,
      path: '/service-exchange',
    },
    {
      id: 'smart-coordinator',
      title: 'Smart Coordinator',
      description: 'Describe your community goals, and let AI help you organize and delegate tasks.',
      icon: <SparklesIcon className="w-8 h-8" />,
      path: '/smart-coordinator',
    },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-r from-primary-light via-primary to-primary-dark text-white rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <img src="https://picsum.photos/seed/localhive_hero/100/100" alt="LocalHive Community" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-md" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to {APP_NAME}!</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Your intelligent assistant for building a vibrant, active, and supportive local community. Let's make great things happen, together.
          </p>
          {/* <Link
            to="/smart-coordinator" // Example CTA, could be to any primary feature
            className="bg-white text-primary-dark font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 text-lg"
          >
            Get Started Now
          </Link> */}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-center text-neutral-dark mb-10">How {APP_NAME} Can Help</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>

      <section className="py-10 bg-white rounded-xl shadow-lg">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold text-neutral-dark mb-4">Join the Hive Mind</h2>
            <p className="text-neutral-DEFAULT max-w-xl mx-auto mb-6">
                {APP_NAME} leverages cutting-edge AI to simplify complex tasks, spark creativity, and connect you with your neighbors.
                From grassroots initiatives to neighborhood celebrations, we're here to amplify your community spirit.
            </p>
            <div className="flex justify-center space-x-4">
                <img src="https://picsum.photos/seed/community1/150/100" alt="Community Event 1" className="rounded-lg shadow-md w-1/3 object-cover"/>
                <img src="https://picsum.photos/seed/community2/150/100" alt="Community Event 2" className="rounded-lg shadow-md w-1/3 object-cover"/>
                <img src="https://picsum.photos/seed/community3/150/100" alt="Community Event 3" className="rounded-lg shadow-md w-1/3 object-cover"/>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
