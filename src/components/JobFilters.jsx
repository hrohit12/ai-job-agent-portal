import React from 'react';

const JobFilters = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { label: 'All Jobs', value: 'all' },
    { label: 'Internships', value: 'Internship' },
    { label: 'Remote', value: 'Remote' },
    { label: 'Full-Time', value: 'Full-Time' },
    { label: 'Part-Time', value: 'Part-Time' },
  ];

  return (
    <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 md:pb-0 no-scrollbar px-4 -mx-4 md:mx-0 md:justify-center">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setActiveFilter(filter.value)}
          className={`px-5 py-2 md:px-6 md:py-2.5 rounded-full text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] transition-all border-2 whitespace-nowrap
            ${activeFilter === filter.value 
              ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/10' 
              : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600'}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default JobFilters;
