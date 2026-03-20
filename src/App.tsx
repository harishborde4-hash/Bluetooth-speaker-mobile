import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ExperimentGrid } from "./components/ExperimentGrid";
import { NewExperimentModal } from "./components/NewExperimentModal";

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState("resource");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fa] font-sans">
      <Header activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              🔬 Chemicals by Neptun
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-lg">
              Explore premium chemistry simulations, 3D models, and interactive experiments designed for middle school students.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/20">
              <div className="text-xl font-bold">44+</div>
              <div className="text-[10px] text-blue-100 mt-0.5">Experiments</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/20">
              <div className="text-xl font-bold">12M+</div>
              <div className="text-[10px] text-blue-100 mt-0.5">Total Uses</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/20">
              <div className="text-xl font-bold">5</div>
              <div className="text-[10px] text-blue-100 mt-0.5">Resource Types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          <Sidebar />
          <ExperimentGrid onNewExperiment={() => setModalOpen(true)} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 3H15M9 3V13L4.5 20.5C4.5 20.5 4 21.5 5 22H19C20 21.5 19.5 20.5 19.5 20.5L15 13V3M9 3H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">Chemicals by Neptun</p>
                <p className="text-[10px] text-gray-400">Chemistry Simulation Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-blue-500 transition-colors">About</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Help Center</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Terms of Use</a>
            </div>
            <p className="text-[11px] text-gray-300">© 2025 Chemicals by Neptun. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <NewExperimentModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* H.B Watermark — fixed bottom-right */}
      <div
        style={{
          position: "fixed",
          bottom: "18px",
          right: "22px",
          zIndex: 9999,
          pointerEvents: "none",
          userSelect: "none",
          color: "rgba(220, 38, 38, 0.22)",
          fontSize: "28px",
          fontWeight: 900,
          fontFamily: "Georgia, serif",
          letterSpacing: "0.12em",
          lineHeight: 1,
          textShadow: "0 1px 4px rgba(220,38,38,0.10)",
          transform: "rotate(-12deg)",
        }}
      >
        H.B
      </div>
    </div>
  );
};

export default App;
