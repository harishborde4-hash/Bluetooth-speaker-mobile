import React from "react";
import { chemicals, instruments } from "../data/chemicals";

const chapters = [
  { label: "All Units", icon: "📚", count: 44, color: "blue" },
  { label: "Unit 1: Intro to Chemistry", icon: "🔬", count: 5, color: "indigo" },
  { label: "Unit 2: Composition of Matter", icon: "⚛️", count: 4, color: "violet" },
  { label: "Unit 3: Molecules & Atoms", icon: "🔮", count: 6, color: "purple" },
  { label: "Unit 4: Water & Hydrogen", icon: "💧", count: 5, color: "sky" },
  { label: "Unit 5: Mass Conservation", icon: "⚖️", count: 4, color: "teal" },
  { label: "Unit 6: Carbon & Compounds", icon: "🌑", count: 5, color: "gray" },
  { label: "Unit 7: Combustion & Fuels", icon: "🔥", count: 4, color: "orange" },
  { label: "Unit 8: Metals", icon: "🔩", count: 5, color: "amber" },
  { label: "Unit 9: Solutions", icon: "🧪", count: 3, color: "cyan" },
  { label: "Unit 10: Acids, Bases & Salts", icon: "⚗️", count: 3, color: "red" },
];

const quickStats = [
  { label: "Chemicals", value: chemicals.length, icon: "🧴" },
  { label: "Instruments", value: instruments.length, icon: "🔬" },
  { label: "Experiments", value: 44, icon: "⚗️" },
];

interface SidebarProps {
  onChapterSelect?: (chapter: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onChapterSelect }) => {
  const [active, setActive] = React.useState(0);

  const handleClick = (i: number) => {
    setActive(i);
    if (onChapterSelect) onChapterSelect(chapters[i].label);
  };

  return (
    <aside className="w-[210px] shrink-0 hidden lg:block space-y-3">
      {/* Quick stats */}
      <div className="bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl p-3 text-white">
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-2">Lab Overview</p>
        <div className="grid grid-cols-3 gap-1">
          {quickStats.map((s) => (
            <div key={s.label} className="text-center bg-white/15 rounded-lg py-1.5 px-1">
              <p className="text-sm font-bold leading-none">{s.value}</p>
              <p className="text-[9px] opacity-80 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-3 py-2.5 bg-gray-50 border-b border-gray-100">
          <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">📚 Table of Contents</p>
        </div>
        <ul className="divide-y divide-gray-50">
          {chapters.map((chapter, i) => (
            <li key={i}>
              <button
                onClick={() => handleClick(i)}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 text-[11.5px] transition-colors ${
                  active === i
                    ? "text-blue-600 bg-blue-50 font-semibold border-l-2 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-500 border-l-2 border-transparent"
                }`}
              >
                <span className="text-sm shrink-0">{chapter.icon}</span>
                <span className="flex-1 leading-tight">{chapter.label}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                  active === i ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {chapter.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chemical States Legend */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">States of Matter</p>
        <div className="space-y-1.5">
          {[
            { state: "Solid", color: "bg-stone-300", text: "text-stone-700", emoji: "⬛" },
            { state: "Liquid", color: "bg-blue-300", text: "text-blue-700", emoji: "💧" },
            { state: "Gas", color: "bg-sky-200", text: "text-sky-700", emoji: "💨" },
            { state: "Aqueous", color: "bg-teal-200", text: "text-teal-700", emoji: "🫗" },
          ].map((s) => (
            <div key={s.state} className="flex items-center gap-2">
              <span className="text-xs">{s.emoji}</span>
              <div className={`w-3 h-3 rounded-sm ${s.color}`} />
              <span className={`text-[11px] font-medium ${s.text}`}>{s.state}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hazard Legend */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">⚠️ Hazard Levels</p>
        <div className="space-y-1.5">
          {[
            { level: "Safe", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-400" },
            { level: "Low", bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-400" },
            { level: "Medium", bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-400" },
            { level: "High ⚠️", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
          ].map((h) => (
            <div key={h.level} className={`flex items-center gap-2 px-2 py-1 rounded-lg ${h.bg}`}>
              <div className={`w-2 h-2 rounded-full ${h.dot}`} />
              <span className={`text-[10px] font-semibold ${h.text}`}>{h.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Reminder */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
        <p className="text-[10px] font-bold text-amber-700 mb-1.5">🥽 Lab Safety</p>
        <ul className="space-y-1 text-[9px] text-amber-700">
          <li>• Always wear goggles</li>
          <li>• Wear protective gloves</li>
          <li>• Work in ventilated area</li>
          <li>• Never taste chemicals</li>
          <li>• Know emergency exits</li>
        </ul>
      </div>
    </aside>
  );
};
