import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  MapPin,
  PlayCircle,
  Calendar,
  Wallet,
  Hourglass,
  Users,
  Share2,
  Clock,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { applyToJob } from '../services/api';

const JobCard = ({
  id,
  title,
  company,
  location,
  salary,
  type,
  experience,
  applyLink,
  startDate,
  duration,
  applyBy,
  postedAt,
  applicantsCount,
  incentive,
  skills = [],
  description = ""
}) => {
  const navigate = useNavigate();
  const [currentApplicants, setCurrentApplicants] = useState(applicantsCount || 0);

  const handleApply = (e) => {
    e.stopPropagation(); // Prevent card navigation
    window.open(applyLink, "_blank");
    setCurrentApplicants(prev => prev + 1);
    applyToJob(id).catch(err => console.error("Background persistence failed:", err));
  };

  const handleNavigateToDetail = () => {
    navigate(`/job/${id}`);
  };

  return (
    <div 
      onClick={handleNavigateToDetail}
      className="bg-white p-5 md:p-8 border border-slate-200/60 rounded-[20px] md:rounded-[24px] relative max-w-4xl mx-auto w-full overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group/card"
    >
      <div className="flex flex-col md:flex-row gap-8 md:gap-10">
        {/* Left Side: Logo & Header */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-5 md:mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full text-slate-500 text-[10px] md:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
                  {postedAt}
                </div>
                {incentive && (
                  <div className="px-2.5 py-1 bg-green-50/50 border border-green-100 rounded-full text-green-600 text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                    {incentive}
                  </div>
                )}
              </div>
              <h3 className="font-heading font-semibold text-slate-900 leading-tight mb-2 tracking-tight group-hover/card:text-primary transition-colors">{title}</h3>
              <p className="text-[14px] md:text-[15px] text-slate-500 font-medium leading-relaxed flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-100 flex items-center justify-center text-[9px] text-slate-400">@</span>
                {company}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-slate-600 text-[12px] md:text-[13px] mb-6 md:mb-8 font-medium">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                <MapPin className="w-4 h-4 md:w-4.5 md:h-4.5 text-primary" />
              </div>
              <span className="opacity-80 leading-tight">{location}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                <Briefcase className="w-4 h-4 md:w-4.5 md:h-4.5 text-primary" />
              </div>
              <span className="opacity-80 leading-tight">{type || 'Full-time'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                <Hourglass className="w-4 h-4 md:w-4.5 md:h-4.5 text-primary" />
              </div>
              <span className="opacity-80 capitalize leading-tight">{experience} Exp</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                <Wallet className="w-4 h-4 md:w-4.5 md:h-4.5 text-primary" />
              </div>
              <span className="opacity-80 leading-tight">{salary}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-slate-50 text-slate-600 text-[11px] md:text-[12px] font-semibold border border-slate-100 rounded-full hover:bg-white hover:border-primary/30 transition-all cursor-default shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Info & Actions */}
        <div className="w-full md:w-72 flex flex-col justify-between md:pl-10 md:border-l border-slate-100 pt-6 md:pt-0 border-t md:border-t-0">
           <div className="bg-slate-50/50 rounded-xl md:rounded-2xl p-4 md:p-5 mb-6 md:mb-8 border border-slate-100/50">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Apply By</span>
                <span className="text-[12px] md:text-[13px] font-bold text-slate-900">{applyBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
                <span className="text-[12px] md:text-[13px] font-bold text-slate-900">{duration}</span>
              </div>
            </div>
            <div className="pt-3 mt-3 md:pt-4 md:mt-4 border-t border-slate-200/60 flex items-center justify-between">
               <div className="flex items-center gap-2 text-slate-500 text-[12px] md:text-[13px] font-semibold">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span><span className="text-primary">{currentApplicants}</span> Applicants</span>
              </div>
            </div>
           </div>

           <div className="flex flex-col gap-3">
              <button 
                onClick={handleApply}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 md:py-4 rounded-xl shadow-lg shadow-primary/20 transition-all text-[13px] md:text-[14px] uppercase tracking-widest active:scale-[0.98] group flex items-center justify-center gap-2"
              >
                Apply Now
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleNavigateToDetail(); }}
                className="w-full py-2.5 md:py-3 text-slate-500 hover:text-slate-900 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-transparent hover:border-slate-100 rounded-xl"
              >
                Full Job Profile
                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/card:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
