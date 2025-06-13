
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { APP_NAME } from '../constants';
import { CalendarDaysIcon, SparklesIcon, PuzzlePieceIcon } from './icons/NavIcons'; // Using specific icons for nav

const Navbar: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
      isActive
        ? 'bg-primary text-white'
        : 'text-neutral-dark hover:bg-primary-light hover:text-primary-dark'
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-primary-dark hover:text-primary">
            <img src="https://picsum.photos/seed/localhive_logo/40/40" alt="LocalHive Logo" className="h-10 w-10 rounded-full" />
            <span className="text-2xl font-bold">{APP_NAME}</span>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <NavLink to="/event-planner" className={navLinkClasses}>
              <CalendarDaysIcon className="w-5 h-5 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Event Planner</span>
            </NavLink>
            <NavLink to="/service-exchange" className={navLinkClasses}>
              <PuzzlePieceIcon className="w-5 h-5 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Services</span>
            </NavLink>
            <NavLink to="/smart-coordinator" className={navLinkClasses}>
              <SparklesIcon className="w-5 h-5 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Coordinator</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
