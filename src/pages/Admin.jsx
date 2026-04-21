import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { postJob } from '../services/api';
import { Layout, PlusCircle, CheckCircle, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    salary: '',
    experience: 'fresher',
    description: '',
    applyLink: '',
    skills: '',
    startDate: 'Immediately',
    duration: '',
    applyBy: '',
    incentive: '',
    category: 'Full-Time'
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'hrohit12' && adminEmail === 'minimindpodcasts677@gmail.com') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    // URL Validation for Apply Link
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    if (!urlPattern.test(formData.applyLink)) {
      setStatus({ type: 'error', message: 'Please provide a valid URL for the Apply Link.' });
      setIsSubmitting(false);
      return;
    }

    try {
      // Process skills into array
      const dataToSend = {
        id: Date.now(),
        ...formData,
        adminEmail: adminEmail,
        adminPassword: password,
        skills: typeof formData.skills === 'string'
          ? formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
          : formData.skills,
        applicantsCount: 0,
        postedAt: 'Just now'
      };

      const result = await postJob(dataToSend);

      if (result && result.success === false) {
        if (result.message === "Unauthorized") {
          alert("Unauthorized: " + (result.message || "Only admin can post jobs"));
        } else {
          alert("Server Error: " + (result.message || "Unknown error"));
        }
        setStatus({ type: 'error', message: result.message || 'Unauthorized: Access denied' });
        return;
      }

      setStatus({ type: 'success', message: 'Job posted successfully!' });
      // Clear form
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'Full-Time',
        salary: '',
        experience: 'fresher',
        description: '',
        applyLink: '',
        skills: '',
        startDate: 'Immediately',
        duration: '',
        applyBy: '',
        incentive: '',
        category: 'Full-Time'
      });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to post job. Please check your API URL.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-lg border border-slate-200 shadow-xl p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Naresh IT Admin</h1>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-semibold">Secure Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Admin ID</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-medium"
                placeholder="admin@nareshit.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Secret Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{loginError}</p>}

            <button className="w-full py-4 bg-primary hover:bg-secondary text-white hover:text-primary font-bold rounded-sm uppercase tracking-[0.2em] text-xs transition-all shadow-[4px_4px_0px_0px_rgba(255,210,0,1)] hover:shadow-none border-2 border-primary">
              Access Dashboard
            </button>
          </form>

          <Link to="/" className="block text-center mt-8 text-slate-400 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">
            Back to Public Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" /> Back to Portal
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <PlusCircle className="w-8 h-8 text-primary" /> Admin Dashboard
            </h1>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Create New Job Listing</h2>
              <p className="text-slate-400 text-xs mt-1">Fill in the details to broadcast your job to the TechCareer community.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {status.message && (
                <div className={`p-4 rounded-sm flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                  {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm font-medium">{status.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Job Title</label>
                  <input
                    required name="title" value={formData.title} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company Name</label>
                  <input
                    required name="company" value={formData.company} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. TechCorp AI"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</label>
                  <input
                    required name="location" value={formData.location} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. Remote or Hyderabad"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salary / Stipend</label>
                  <input
                    required name="salary" value={formData.salary} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. ₹ 20,000 - 35,000 /month"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Job Type</label>
                  <select
                    name="type" value={formData.type} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Experience Range</label>
                  <select
                    name="experience" value={formData.experience} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="fresher">Fresher</option>
                    <option value="1-3">1-3 Years</option>
                    <option value="3-6">3-6 Years</option>
                    <option value="6+">6+ Years</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Start Date</label>
                  <input
                    name="startDate" value={formData.startDate} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. Immediately or June 2026"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duration</label>
                  <input
                    name="duration" value={formData.duration} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. 6 Months / Permanent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Apply By (Date)</label>
                  <input
                    name="applyBy" value={formData.applyBy} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. 15 May 2026"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Incentives / Perks</label>
                  <input
                    name="incentive" value={formData.incentive} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. Performance Bonus"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Skills (Comma separated)</label>
                <input
                  name="skills" value={formData.skills} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">External Apply Link</label>
                <input
                  required name="applyLink" value={formData.applyLink} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="https://company.com/apply"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detailed Description</label>
                <textarea
                  required name="description" value={formData.description} onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                  placeholder="Tell candidates what to expect..."
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-primary text-white font-bold rounded-sm uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-105 shadow-lg shadow-primary/20'
                    }`}
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : (
                    <>Publish Job <Layout className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
