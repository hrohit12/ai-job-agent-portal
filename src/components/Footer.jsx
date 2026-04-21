import React from 'react';

const Footer = () => {
  return (
    <footer className="pt-16 md:pt-24 pb-12 bg-slate-50 border-t border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 overflow-hidden">
          <div 
            onClick={() => window.location.href = "/"} 
            className="flex items-center cursor-pointer"
          >
            <img
              src="/src/assets/nareshit-logo.png"
              alt="Logo"
              className="h-24 md:h-52 w-auto"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-slate-400 text-[11px] md:text-[13px] font-bold uppercase tracking-widest leading-tight">
            © 2026 Naresh i Technologies. <br className="md:hidden" /> All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 md:gap-8">
            <span className="text-[11px] md:text-[13px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary leading-tight">Terms</span>
            <span className="text-[11px] md:text-[13px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary leading-tight">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
