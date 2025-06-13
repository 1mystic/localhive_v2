
import React from 'react';
import { APP_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-dark text-neutral-light py-8 text-center">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. Fostering Community Together.</p>
        <p className="text-sm text-gray-400 mt-1">Powered by AI, Driven by People.</p>
      </div>
    </footer>
  );
};

export default Footer;
