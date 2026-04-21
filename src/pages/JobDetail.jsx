import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById, applyToJob } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  MapPin, 
  Briefcase, 
  Wallet, 
  Users, 
  Clock, 
  ArrowLeft, 
  Calendar,
  ShieldCheck,
  CheckCircle,
  Share2,
  ExternalLink
} from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState(0);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data);
        setApplicants(data?.applicantsCount || 0);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
    window.scrollTo(0, 0);
  }, [id]);

  const handleApply = () => {
    if (job?.applyLink) {
      window.open(job.applyLink, '_blank');
      setApplicants(prev => prev + 1);
      applyToJob(job.id).catch(err => console.error(err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Job Not Found</h2>
        <p className="text-slate-500 mb-8">The job listing you're looking for might have been removed or expired.</p>
        <Link to="/" className="bg-primary text-white font-bold px-8 py-3 rounded-xl uppercase tracking-widest text-[13px]">
          Back to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow py-8 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Breadcrumb / Back Link */}
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-[11px] md:text-[13px] font-bold uppercase tracking-widest mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to All Jobs
          </Link>

          <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
            {/* Header Section */}
            <div className="p-6 md:p-12 border-b border-slate-100">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-primary/20">
                      {job.type}
                    </div>
                    <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-slate-500 text-[10px] md:text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {job.postedAt}
                    </div>
                  </div>
                  
                  <h1 className="font-heading font-semibold text-slate-900 mb-4 tracking-tight leading-tight">
                    {job.title}
                  </h1>
                  
                  <div className="flex items-center gap-2 text-slate-500 mb-10">
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">@</div>
                    <span className="text-[16px] md:text-[18px] font-medium">{job.company}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 text-slate-600">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-primary shadow-sm">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                        <p className="text-[14px] md:text-[15px] font-bold text-slate-900">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-primary shadow-sm">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Salary</p>
                        <p className="text-[14px] md:text-[15px] font-bold text-slate-900">{job.salary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-primary shadow-sm">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Experience</p>
                        <p className="text-[14px] md:text-[15px] font-bold text-slate-900 capitalize">{job.experience} Yrs</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-80 space-y-4">
                  <button 
                    onClick={handleApply}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all text-[15px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] group"
                  >
                    Apply Now <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-[12px] font-bold uppercase tracking-widest py-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{applicants} Candidates Applied</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-12 flex flex-col md:flex-row gap-12">
              <div className="flex-[2] space-y-10">
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full"></div>
                    Job Description
                  </h2>
                  <p className="text-slate-600 text-[16px] md:text-[18px] leading-relaxed whitespace-pre-wrap font-medium">
                    {job.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full"></div>
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {job.skills && job.skills.map((skill, index) => (
                      <span key={index} className="px-5 py-2.5 bg-slate-50 text-slate-700 font-bold text-[13px] rounded-xl border border-slate-200/60 shadow-sm hover:border-primary/30 transition-all cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <div className="flex-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                    <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Important Dates</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Apply By</p>
                          <p className="text-[14px] font-bold text-slate-900">{job.applyBy || "Immediately"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Start Date</p>
                          <p className="text-[14px] font-bold text-slate-900">{job.startDate || "TBD"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary rounded-2xl p-6 text-white text-center">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-primary" />
                    <h4 className="font-bold text-[15px] mb-2">Verified Opportunity</h4>
                    <p className="text-[12px] text-white/60 font-medium leading-relaxed">
                      This job is directly posted by Naresh i Technologies verified hiring team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetail;
