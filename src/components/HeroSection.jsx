import { AuroraText } from './magicui/AuroraText';

const HeroSection = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <header className="relative pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-slate-50/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,84,166,0.05),transparent_60%),radial-gradient(circle_at_bottom_left,rgba(237,28,36,0.03),transparent_60%)] -z-10"></div>
      
      <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-full text-slate-500 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
          Trusted by 1M+ Students
        </div>

        <h1 className="font-heading font-semibold text-slate-900 mb-6 leading-tight tracking-tight">
          Find Your <AuroraText className="text-nit-red">Dream Job</AuroraText> <br className="hidden md:block" /> 
          With <AuroraText className="text-secondary font-bold">Naresh IT</AuroraText>
        </h1>
        
        <p className="text-slate-500 mb-10 max-w-2xl mx-auto font-medium opacity-80">
          Official recruitment portal for India's #1 software training institute. Connect with top IT firms and start your career today.
        </p>
        
        <div className="glass p-2 md:p-2.5 rounded-2xl flex flex-col md:flex-row gap-3 max-w-4xl mx-auto ring-1 ring-slate-200/50">
          <div className="flex-[1.5] flex items-center px-4 md:px-6 py-3 md:py-4 bg-white/50 rounded-xl border border-white/60 focus-within:bg-white transition-all shadow-sm">
            <span className="material-symbols-outlined text-primary text-xl md:text-2xl mr-3 md:mr-4 opacity-100">search</span>
            <input 
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              className="bg-transparent border-none focus:ring-0 text-slate-900 w-full placeholder:text-slate-400 text-[15px] md:text-[16px] font-semibold outline-none" 
              placeholder="Java, Python, AWS..." 
              type="text" 
            />
          </div>
          
          <div className="flex-1 flex items-center px-4 md:px-6 py-3 md:py-4 bg-white/50 rounded-xl border border-white/60 focus-within:bg-white transition-all shadow-sm">
            <span className="material-symbols-outlined text-slate-400 text-lg md:text-xl mr-2 md:mr-3 opacity-80">grade</span>
            <select 
              name="experience"
              value={filters.experience}
              onChange={handleChange}
              className="bg-transparent border-none focus:ring-0 text-slate-900 w-full text-[15px] md:text-[16px] font-semibold cursor-pointer outline-none"
            >
              <option value="">Experience</option>
              <option value="fresher">Fresher</option>
              <option value="1-3">1–3 Yrs</option>
              <option value="3-6">3–6 Yrs</option>
              <option value="6+">6+ Yrs</option>
            </select>
          </div>

          <button className="bg-secondary hover:bg-secondary-dark text-white font-bold px-8 md:px-12 py-3.5 md:py-4 rounded-xl transition-all text-[13px] md:text-[14px] uppercase tracking-widest shadow-xl shadow-secondary/20 active:scale-95 group flex items-center justify-center gap-2">
            Search 
            <span className="material-symbols-outlined text-[18px] md:text-[20px] group-hover:translate-x-1 transition-transform">east</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
