import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import JobFilters from '../components/JobFilters';
import JobList from '../components/JobList';
import Footer from '../components/Footer';

const Home = () => {
  // Filter States
  const [filters, setFilters] = useState({
    keyword: '',
    experience: '',
    location: '',
    category: 'all'
  });

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection 
        filters={filters} 
        onFilterChange={updateFilters} 
      />
      
      <main className="py-12 bg-white flex-grow" id="jobs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <JobFilters 
            activeFilter={filters.category} 
            setActiveFilter={(cat) => updateFilters({ category: cat })} 
          />
          
          <JobList filters={filters} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
