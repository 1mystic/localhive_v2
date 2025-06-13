
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventPlannerPage from './pages/EventPlannerPage';
import ServiceExchangePage from './pages/ServiceExchangePage';
import SmartCoordinatorPage from './pages/SmartCoordinatorPage';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-neutral-dark">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event-planner" element={<EventPlannerPage />} />
          <Route path="/service-exchange" element={<ServiceExchangePage />} />
          <Route path="/smart-coordinator" element={<SmartCoordinatorPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
