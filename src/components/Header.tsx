import React, { useState } from "react";

interface HeaderProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const BookIcon = () => (
  <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M1.5 0V22C0.671573 22 0 21.3284 0 20.5L0 1.5C0 0.671573 0.671573 0 1.5 0Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 1.5L1.5 1.50001L1.5 5.24537e-06L12 0L12 1.5Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 22L1.5 22L1.5 20.5L12 20.5L12 22Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10 18.25C10 18.6642 9.66422 19 9.25 19L4.25 19C3.83579 19 3.5 18.6642 3.5 18.25C3.5 17.8358 3.83578 17.5 4.25 17.5L9.25 17.5C9.66421 17.5 10 17.8358 10 18.25Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10 1.5C10 2.05228 9.55229 2.49999 9.00001 2.49999L4.49999 2.49999C3.94771 2.49999 3.5 2.05228 3.5 1.5C3.5 0.947718 3.94771 0.500005 4.49999 0.500005L9 0.500001C9.55229 0.5 10 0.947714 10 1.5Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C12.8284 0 13.5 0.671573 13.5 1.5V20.5C13.5 21.3284 12.8284 22 12 22L12 0Z" fill="currentColor" />
  </svg>
);

const ChemFlaskIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3H15M9 3V13L4.5 20.5C4.5 20.5 4 21.5 5 22H19C20 21.5 19.5 20.5 19.5 20.5L15 13V3M9 3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8.5" cy="18" r="1" fill="#60a5fa"/>
    <circle cx="13" cy="16" r="1.5" fill="#34d399"/>
    <circle cx="16" cy="19.5" r="1" fill="#f472b6"/>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ activeNav, setActiveNav }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center h-14 px-4 max-w-[1400px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8 select-none">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg shadow">
            <ChemFlaskIcon />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-gray-800 tracking-wide">NOBOOK</span>
            <span className="text-[10px] text-gray-400 leading-tight tracking-wider">VIRTUAL LAB</span>
          </div>
          <div className="ml-2 px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[10px] font-semibold text-blue-500 uppercase tracking-wider">
            Middle School
          </div>
          <div className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
            <img src="https://imgcdn.nobook.com/static/teacher-badge.3e4e8359.png" alt="Teacher" className="w-4 h-4 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-[10px] font-semibold text-amber-600">Teacher</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {[
            { id: "resource", label: "Premium Experiments" },
            { id: "coursewares", label: "My Experiments" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeNav === item.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
              }`}
            >
              {item.label}
              {activeNav === item.id && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <button className="hidden md:flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100">
            <BookIcon />
            <span className="text-xs ml-1">Download Student App</span>
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all">
            Login / Register
          </button>
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-3">
          {[
            { id: "resource", label: "Premium Experiments" },
            { id: "coursewares", label: "My Experiments" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-3 py-2.5 text-sm rounded-lg mt-1 ${
                activeNav === item.id
                  ? "text-blue-600 bg-blue-50 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
