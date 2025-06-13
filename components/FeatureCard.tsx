
import React from 'react';
import { Link } from 'react-router-dom';
import type { Feature } from '../types';

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <Link 
      to={feature.path} 
      className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-center mb-4 text-primary w-12 h-12 bg-primary-light rounded-full mx-auto">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold text-neutral-dark mb-2 text-center">{feature.title}</h3>
      <p className="text-neutral-DEFAULT text-sm text-center">{feature.description}</p>
      <div className="text-center mt-4">
        <span className="text-primary hover:text-primary-dark font-medium">
          Get Started &rarr;
        </span>
      </div>
    </Link>
  );
};

export default FeatureCard;
