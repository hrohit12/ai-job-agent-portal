import React, { useState, useEffect, useMemo } from 'react';
import JobCard from './JobCard';
import { getJobs } from '../services/api';

const JobList = ({ filters }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async (isInitial = false) => {
      try {
        if (isInitial) setIsLoading(true);
        const response = await getJobs();
        const data = response.data || response;
        const jobsToUse = (data && Array.isArray(data)) ? data : [];
        setAllJobs(jobsToUse);
        setError(null);
      } catch (err) {
        console.error('API failed:', err);
        setAllJobs([]);
        setError('Failed to fetch real-time data. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs(true);

    // Realtime Polling: Check for new jobs every 60 seconds
    const interval = setInterval(() => fetchJobs(false), 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredJobs = useMemo(() => {
    if (!filters) return allJobs;
    
    return allJobs.filter(job => {
      const matchesKeyword = !filters.keyword || 
        job.title?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.company?.toLowerCase().includes(filters.keyword.toLowerCase());

      const matchesExperience = !filters.experience || job.experience === filters.experience;
      const matchesLocation = !filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase());

      let matchesCategory = true;
      if (filters.category !== 'all') {
        matchesCategory = job.category === filters.category || job.type === filters.category;
      }

      return matchesKeyword && matchesExperience && matchesLocation && matchesCategory;
    });
  }, [allJobs, filters]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium text-sm italic">Finding your next opportunity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 rounded-lg border border-red-100 max-w-2xl mx-auto">
        <p className="text-red-500 font-bold mb-2 uppercase tracking-widest text-xs">Error Loading Jobs</p>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-white font-bold px-6 py-2 rounded-sm text-xs uppercase tracking-widest"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <JobCard
            key={job.id || Math.random()}
            {...job}
          />
        ))
      ) : (
        <div className="w-full max-w-2xl py-20 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No Jobs Found</p>
          <p className="text-slate-400 text-sm mt-2">Try adjusting your filters to find more results.</p>
        </div>
      )}
    </div>
  );
};

export default JobList;
