import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ExperimentGrid } from "./components/ExperimentGrid";
import { NewExperimentModal } from "./components/NewExperimentModal";

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState("resource");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fa] font-sans">
      <Header activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">Middle School</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">🇬🇧 English</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                🔬 NB Chemistry Virtual Lab
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-md">
                Interactive chemistry simulations · 50+ chemicals · 35+ instruments · Step-by-step experiments
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              {[
                { val: "44+", label: "Experiments", icon: "⚗️" },
                { val: "50+", label: "Chemicals", icon: "🧴" },
                { val: "35+", label: "Instruments", icon: "🔬" },
                { val: "12M+", label: "Total Uses", icon: "👁️" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 text-center border border-white/20">
                  <div className="text-base font-bold">{s.icon} {s.val}</div>
                  <div className="text-[10px] text-blue-100 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
        <div className="flex gap-5">
          <Sidebar onChapterSelect={() => {}} />
          <ExperimentGrid onNewExperiment={() => setModalOpen(true)} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg shadow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 3H15M9 3V13L4.5 20.5C4.5 20.5 4 21.5 5 22H19C20 21.5 19.5 20.5 19.5 20.5L15 13V3M9 3H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">NOBOOK Virtual Lab</p>
                <p className="text-[10px] text-gray-400">Chemistry Simulation Platform · English Edition</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-blue-500 transition-colors">About</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Help Center</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Terms of Use</a>
            </div>
            <p className="text-[11px] text-gray-300">© 2025 NOBOOK. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <NewExperimentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default App;
