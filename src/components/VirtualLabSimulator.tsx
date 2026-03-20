import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  chemicals, instruments, reactions,
  findReaction, getChemicalById,
  hazardColors, hazardLabels,
  type Chemical, type Instrument, type Reaction
} from "../data/chemicals";

// ─── Sub-components ───────────────────────────────────────────────────────────

// (animation helpers inlined in SVG)

// ─── Main Component ───────────────────────────────────────────────────────────
export const VirtualLabSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"lab" | "chemicals" | "instruments" | "reactions">("lab");
  const [selectedChemicals, setSelectedChemicals] = useState<string[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [temperature, setTemperature] = useState(25);
  const [isHeating, setIsHeating] = useState(false);
  const [hasIndicator, setHasIndicator] = useState<string | null>(null);
  const [hasCatalyst, setHasCatalyst] = useState<string | null>(null);
  const [currentReaction, setCurrentReaction] = useState<Reaction | null>(null);
  const [reactionStep, setReactionStep] = useState(0);
  const [reactionLog, setReactionLog] = useState<string[]>([]);
  const [isReacting, setIsReacting] = useState(false);
  const [searchChem, setSearchChem] = useState("");
  const [searchInstr, setSearchInstr] = useState("");
  const [filterHazard, setFilterHazard] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterState, setFilterState] = useState<string>("all");
  const [selectedChemDetail, setSelectedChemDetail] = useState<Chemical | null>(null);
  const [selectedInstrDetail, setSelectedInstrDetail] = useState<Instrument | null>(null);
  const [selectedRxnDetail, setSelectedRxnDetail] = useState<Reaction | null>(null);
  const heatingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-detect reaction
  useEffect(() => {
    const reactantPool = [...selectedChemicals];
    if (hasCatalyst) reactantPool.push(hasCatalyst);
    const rxn = findReaction(reactantPool);
    const heatOk = !rxn?.heatRequired || isHeating || temperature >= 150;
    const catOk = !rxn?.catalystRequired || hasCatalyst === rxn.catalystRequired || reactantPool.includes(rxn.catalystRequired!);
    if (rxn && heatOk && catOk) {
      setCurrentReaction(rxn);
    } else {
      setCurrentReaction(null);
      setReactionStep(0);
    }
  }, [selectedChemicals, isHeating, temperature, hasCatalyst]);

  // Heating logic
  useEffect(() => {
    if (isHeating) {
      heatingInterval.current = setInterval(() => {
        setTemperature((t) => Math.min(t + 5, 500));
      }, 200);
    } else {
      if (heatingInterval.current) clearInterval(heatingInterval.current);
      const cool = setInterval(() => {
        setTemperature((t) => {
          if (t <= 25) { clearInterval(cool); return 25; }
          return t - 2;
        });
      }, 300);
    }
    return () => {
      if (heatingInterval.current) clearInterval(heatingInterval.current);
    };
  }, [isHeating]);

  const addLog = useCallback((msg: string) => {
    setReactionLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  }, []);

  const startReaction = () => {
    if (!currentReaction) return;
    setIsReacting(true);
    setReactionStep(0);
    addLog(`⚗️ Starting: ${currentReaction.equation}`);
    currentReaction.observations.forEach((obs, i) => {
      setTimeout(() => {
        setReactionStep(i + 1);
        addLog(`👁️ ${obs}`);
        if (i === currentReaction.observations.length - 1) {
          addLog(`✅ Reaction complete! Products: ${currentReaction.products.join(", ")}`);
          setIsReacting(false);
        }
      }, (i + 1) * 1200);
    });
  };

  const resetLab = () => {
    setSelectedChemicals([]);
    setSelectedInstrument(null);
    setTemperature(25);
    setIsHeating(false);
    setHasIndicator(null);
    setHasCatalyst(null);
    setCurrentReaction(null);
    setReactionStep(0);
    setReactionLog([]);
    setIsReacting(false);
  };

  const toggleChemical = (id: string) => {
    setSelectedChemicals((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  // Filtered lists
  const filteredChems = chemicals.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchChem.toLowerCase()) ||
      c.formula.toLowerCase().includes(searchChem.toLowerCase());
    const matchHazard = filterHazard === "all" || c.hazard === filterHazard;
    const matchState = filterState === "all" || c.state === filterState;
    return matchSearch && matchHazard && matchState;
  });

  const filteredInstrs = instruments.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(searchInstr.toLowerCase());
    const matchCat = filterCategory === "all" || i.category === filterCategory;
    return matchSearch && matchCat;
  });

  const getFluidColor = () => {
    if (selectedChemicals.length === 0) return "#e0e8f0";
    if (currentReaction?.precipitateFormed) return "#d4d4d4";
    const firstChem = getChemicalById(selectedChemicals[0]);
    if (isReacting && currentReaction?.colorChange) {
      const after = currentReaction.colorChange.split("→")[1]?.trim();
      if (after?.includes("yellow")) return "#ffd700";
      if (after?.includes("Blue") || after?.includes("blue")) return "#2196f3";
      if (after?.includes("Black") || after?.includes("black")) return "#222";
      if (after?.includes("Milky")) return "#e0e0e0";
    }
    return firstChem?.color || "#c8dff5";
  };

  const tempColor =
    temperature < 50 ? "#60a5fa" :
    temperature < 150 ? "#fbbf24" :
    temperature < 300 ? "#f97316" : "#ef4444";

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50">
        {(["lab", "chemicals", "instruments", "reactions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold transition-colors capitalize ${
              activeTab === tab
                ? "bg-white text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab === "lab" ? "🧪 Virtual Lab" :
             tab === "chemicals" ? "⚗️ Chemicals" :
             tab === "instruments" ? "🔬 Instruments" : "⚡ Reactions"}
          </button>
        ))}
      </div>

      {/* ── LAB TAB ──────────────────────────────────────────────────────────── */}
      {activeTab === "lab" && (
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Controls */}
            <div className="space-y-4">
              {/* Instrument Select */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">🔬 Select Instrument</p>
                <div className="grid grid-cols-2 gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {instruments.filter(i => i.category === "glassware" || i.category === "heating").slice(0, 12).map((inst) => (
                    <button
                      key={inst.id}
                      onClick={() => setSelectedInstrument(selectedInstrument === inst.id ? null : inst.id)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] border transition-all ${
                        selectedInstrument === inst.id
                          ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                          : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-blue-50"
                      }`}
                    >
                      <span>{inst.emoji}</span>
                      <span className="truncate">{inst.name.split("(")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chemical Select */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">🧴 Add Chemicals (max 4)</p>
                <input
                  className="w-full px-2 py-1.5 text-[11px] border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-blue-400"
                  placeholder="Search chemicals..."
                  value={searchChem}
                  onChange={(e) => setSearchChem(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-1 max-h-[220px] overflow-y-auto pr-1">
                  {chemicals.filter(c =>
                    c.name.toLowerCase().includes(searchChem.toLowerCase()) ||
                    c.formula.toLowerCase().includes(searchChem.toLowerCase())
                  ).slice(0, 20).map((chem) => (
                    <button
                      key={chem.id}
                      onClick={() => toggleChemical(chem.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] border transition-all ${
                        selectedChemicals.includes(chem.id)
                          ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                          : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-blue-50"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-gray-200"
                        style={{ background: chem.color }}
                      />
                      <span className="flex-1 text-left truncate">{chem.name}</span>
                      <span className="text-gray-400 font-mono text-[10px]">{chem.formula}</span>
                      {selectedChemicals.includes(chem.id) && (
                        <span className="text-blue-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catalyst / Indicator */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 mb-1">Catalyst</p>
                  <select
                    className="w-full text-[11px] border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400"
                    value={hasCatalyst || ""}
                    onChange={(e) => setHasCatalyst(e.target.value || null)}
                  >
                    <option value="">None</option>
                    <option value="MnO2">MnO₂ (Manganese Dioxide)</option>
                    <option value="Fe">Fe (Iron)</option>
                    <option value="Pt">Pt (Platinum)</option>
                  </select>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 mb-1">Indicator</p>
                  <select
                    className="w-full text-[11px] border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400"
                    value={hasIndicator || ""}
                    onChange={(e) => setHasIndicator(e.target.value || null)}
                  >
                    <option value="">None</option>
                    <option value="litmus">Litmus</option>
                    <option value="phenolphthalein">Phenolphthalein</option>
                    <option value="universal">Universal Indicator</option>
                    <option value="methyl_orange">Methyl Orange</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Center: Lab Visualization */}
            <div className="flex flex-col items-center gap-3">
              {/* Reaction Vessel */}
              <div className="relative w-full max-w-[240px] mx-auto">
                {/* Instrument visual */}
                <div className="relative mx-auto" style={{ width: 160, height: 200 }}>
                  {/* Flask/Beaker SVG */}
                  {selectedInstrument?.includes("erlenmeyer") || !selectedInstrument ? (
                    <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-lg">
                      {/* Flask body */}
                      <path d="M55,10 L65,10 L65,80 L15,175 Q10,190 30,195 L130,195 Q150,190 145,175 L95,80 L95,10 L105,10" 
                        fill="rgba(200,220,255,0.25)" stroke="#93c5fd" strokeWidth="2.5" strokeLinejoin="round"/>
                      {/* Fluid */}
                      {selectedChemicals.length > 0 && (
                        <path d="M35,175 Q20,188 30,193 L130,193 Q140,188 125,175 L80,105 Z"
                          fill={getFluidColor()}
                          opacity="0.85">
                          {isReacting && <animate attributeName="opacity" values="0.85;0.5;0.85" dur="0.8s" repeatCount="indefinite"/>}
                        </path>
                      )}
                      {/* Bubbles */}
                      {isReacting && (
                        <>
                          <circle cx="70" cy="155" r="4" fill="white" opacity="0.7">
                            <animate attributeName="cy" values="155;100" dur="0.8s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.7;0" dur="0.8s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx="90" cy="145" r="3" fill="white" opacity="0.6">
                            <animate attributeName="cy" values="145;90" dur="1s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.6;0" dur="1s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx="80" cy="160" r="5" fill="white" opacity="0.5">
                            <animate attributeName="cy" values="160;95" dur="0.7s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.5;0" dur="0.7s" repeatCount="indefinite"/>
                          </circle>
                        </>
                      )}
                      {/* Stopper */}
                      <rect x="55" y="6" width="50" height="8" rx="3" fill="#fca5a5" stroke="#f87171" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-lg">
                      {/* Beaker */}
                      <path d="M30,20 L30,185 Q30,195 40,195 L120,195 Q130,195 130,185 L130,20 Z"
                        fill="rgba(200,220,255,0.2)" stroke="#93c5fd" strokeWidth="2.5"/>
                      <line x1="30" y1="20" x2="25" y2="10" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
                      {selectedChemicals.length > 0 && (
                        <path d="M30,130 L30,185 Q30,193 40,193 L120,193 Q130,193 130,185 L130,130 Z"
                          fill={getFluidColor()} opacity="0.85">
                          {isReacting && <animate attributeName="opacity" values="0.85;0.5;0.85" dur="0.8s" repeatCount="indefinite"/>}
                        </path>
                      )}
                    </svg>
                  )}

                  {/* Heat glow */}
                  {isHeating && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full blur-md animate-pulse"
                      style={{ background: tempColor, opacity: 0.6 }} />
                  )}
                </div>

                {/* Chemical labels */}
                {selectedChemicals.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mt-1">
                    {selectedChemicals.map((id) => {
                      const c = getChemicalById(id);
                      return c ? (
                        <span key={id} className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] rounded-full font-mono">
                          {c.formula}
                        </span>
                      ) : null;
                    })}
                    {hasCatalyst && (
                      <span className="px-1.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 text-[10px] rounded-full">
                        cat: {hasCatalyst}
                      </span>
                    )}
                    {hasIndicator && (
                      <span className="px-1.5 py-0.5 bg-pink-50 border border-pink-200 text-pink-700 text-[10px] rounded-full">
                        {hasIndicator}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Temperature gauge */}
              <div className="w-full max-w-[240px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-500">🌡️ Temperature</span>
                  <span className="text-[11px] font-bold" style={{ color: tempColor }}>{temperature}°C</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${(temperature / 500) * 100}%`, background: tempColor }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2 w-full max-w-[240px]">
                <button
                  onClick={() => setIsHeating(!isHeating)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isHeating
                      ? "bg-red-500 text-white shadow-md shadow-red-200"
                      : "bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100"
                  }`}
                >
                  {isHeating ? "🔥 Stop Heat" : "🔥 Apply Heat"}
                </button>
                <button
                  onClick={resetLab}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all"
                >
                  🔄 Reset
                </button>
              </div>

              {/* Reaction detected */}
              {currentReaction && (
                <div className="w-full max-w-[240px] bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-green-700 mb-1">⚡ Reaction Detected!</p>
                  <p className="text-[11px] font-mono text-gray-700 mb-2">{currentReaction.equation}</p>
                  <button
                    onClick={startReaction}
                    disabled={isReacting}
                    className="w-full py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isReacting ? "⏳ Reacting..." : "▶ Run Experiment"}
                  </button>
                </div>
              )}

              {!currentReaction && selectedChemicals.length > 0 && (
                <div className="w-full max-w-[240px] bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-[10px] text-amber-700">
                    No reaction detected. Try adding more chemicals, a catalyst, or apply heat.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Observations & Reaction Info */}
            <div className="space-y-3">
              {/* Current Reaction Info */}
              {currentReaction && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-2">
                  <p className="text-[11px] font-bold text-blue-800">{currentReaction.description}</p>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div className="bg-white rounded-lg px-2 py-1">
                      <span className="text-gray-400">Energy: </span>
                      <span className={`font-semibold ${
                        currentReaction.energyChange === "exothermic" ? "text-red-500" :
                        currentReaction.energyChange === "endothermic" ? "text-blue-500" : "text-gray-500"
                      }`}>
                        {currentReaction.energyChange === "exothermic" ? "🔴 Exothermic" :
                         currentReaction.energyChange === "endothermic" ? "🔵 Endothermic" : "⚪ Neutral"}
                      </span>
                    </div>
                    {currentReaction.conditions && (
                      <div className="bg-white rounded-lg px-2 py-1">
                        <span className="text-gray-400">Conditions: </span>
                        <span className="font-semibold text-gray-700">{currentReaction.conditions}</span>
                      </div>
                    )}
                  </div>
                  {/* Step-by-step observations */}
                  {reactionStep > 0 && (
                    <div className="space-y-1">
                      {currentReaction.observations.slice(0, reactionStep).map((obs, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[10px] text-gray-700 bg-white rounded-lg px-2 py-1">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{obs}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Products */}
                  {reactionStep === currentReaction.observations.length && reactionStep > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-green-700 mb-1">Products formed:</p>
                      <div className="flex flex-wrap gap-1">
                        {currentReaction.products.map((p) => {
                          const chem = getChemicalById(p);
                          return chem ? (
                            <span key={p} className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-mono">
                              {chem.emoji} {chem.formula}
                            </span>
                          ) : (
                            <span key={p} className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-mono">{p}</span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Observation Log */}
              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-1.5">📋 Observation Log</p>
                <div className="bg-gray-900 rounded-xl p-3 h-[220px] overflow-y-auto font-mono">
                  {reactionLog.length === 0 ? (
                    <p className="text-gray-500 text-[10px]">Lab log is empty. Add chemicals and run an experiment.</p>
                  ) : (
                    reactionLog.map((log, i) => (
                      <p key={i} className={`text-[10px] mb-1 ${
                        log.includes("✅") ? "text-green-400" :
                        log.includes("👁️") ? "text-yellow-300" :
                        log.includes("⚗️") ? "text-blue-400" : "text-gray-300"
                      }`}>{log}</p>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Reference */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[11px] font-semibold text-gray-600 mb-2">🔑 Quick Tips</p>
                <ul className="space-y-1 text-[10px] text-gray-500">
                  <li>• Add <strong>KMnO₄</strong> + Heat → O₂ gas</li>
                  <li>• Add <strong>H₂O₂</strong> + MnO₂ catalyst → O₂ gas</li>
                  <li>• Add <strong>CaCO₃</strong> + HCl → CO₂ gas</li>
                  <li>• Add <strong>Zn</strong> + H₂SO₄ → H₂ gas</li>
                  <li>• Add <strong>Fe</strong> + O₂ + Heat → Fe₃O₄ sparks</li>
                  <li>• Add <strong>Pb(NO₃)₂</strong> + KI → Golden Rain</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHEMICALS TAB ───────────────────────────────────────────────────── */}
      {activeTab === "chemicals" && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="Search chemicals..."
                value={searchChem}
                onChange={(e) => setSearchChem(e.target.value)}
              />
            </div>
            <select className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none" value={filterHazard} onChange={(e) => setFilterHazard(e.target.value)}>
              <option value="all">All Hazards</option>
              <option value="none">Safe</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High ⚠️</option>
            </select>
            <select className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
              <option value="all">All States</option>
              <option value="solid">Solid</option>
              <option value="liquid">Liquid</option>
              <option value="gas">Gas</option>
              <option value="aqueous">Aqueous</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredChems.map((chem) => (
              <button
                key={chem.id}
                onClick={() => setSelectedChemDetail(selectedChemDetail?.id === chem.id ? null : chem)}
                className={`text-left rounded-xl border p-3 transition-all hover:shadow-md ${
                  selectedChemDetail?.id === chem.id
                    ? "border-blue-400 bg-blue-50 shadow-md"
                    : "border-gray-100 bg-white hover:border-blue-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-lg border border-gray-100 shadow-inner"
                    style={{ background: chem.color }}
                  />
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${hazardColors[chem.hazard || "none"]}`}>
                    {hazardLabels[chem.hazard || "none"].split(" ")[0]}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-800 leading-tight">{chem.name}</p>
                <p className="text-[11px] font-mono text-blue-600 mt-0.5">{chem.formula}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className={`text-[9px] px-1 py-0.5 rounded font-medium ${
                    chem.state === "gas" ? "bg-sky-100 text-sky-700" :
                    chem.state === "liquid" ? "bg-blue-100 text-blue-700" :
                    chem.state === "solid" ? "bg-stone-100 text-stone-700" :
                    "bg-teal-100 text-teal-700"
                  }`}>
                    {chem.state}
                  </span>
                  {chem.pH !== undefined && (
                    <span className={`text-[9px] px-1 py-0.5 rounded font-medium ${
                      chem.pH < 7 ? "bg-red-100 text-red-600" :
                      chem.pH > 7 ? "bg-blue-100 text-blue-600" :
                      "bg-green-100 text-green-600"
                    }`}>
                      pH {chem.pH}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Chemical Detail Panel */}
          {selectedChemDetail && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-xl border-2 border-white shadow-md flex items-center justify-center text-2xl shrink-0"
                  style={{ background: selectedChemDetail.color }}
                >
                  {selectedChemDetail.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-800">{selectedChemDetail.name}</h3>
                      <p className="text-sm font-mono text-blue-600">{selectedChemDetail.formula}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${hazardColors[selectedChemDetail.hazard || "none"]}`}>
                      {hazardLabels[selectedChemDetail.hazard || "none"]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{selectedChemDetail.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                    {[
                      { label: "Molar Mass", value: `${selectedChemDetail.molarMass} g/mol` },
                      { label: "State", value: selectedChemDetail.state },
                      { label: "Melting Pt", value: selectedChemDetail.meltingPoint !== undefined ? `${selectedChemDetail.meltingPoint}°C` : "N/A" },
                      { label: "Boiling Pt", value: selectedChemDetail.boilingPoint !== undefined ? `${selectedChemDetail.boilingPoint}°C` : "N/A" },
                      { label: "Density", value: selectedChemDetail.density !== undefined ? `${selectedChemDetail.density} g/mL` : "N/A" },
                      { label: "Solubility", value: selectedChemDetail.solubility || "N/A" },
                      { label: "pH", value: selectedChemDetail.pH !== undefined ? `${selectedChemDetail.pH}` : "N/A" },
                      { label: "Hazard", value: hazardLabels[selectedChemDetail.hazard || "none"] },
                    ].map((item) => (
                      <div key={item.label} className="bg-white rounded-lg px-2 py-1.5">
                        <p className="text-[9px] text-gray-400 uppercase">{item.label}</p>
                        <p className="text-xs font-semibold text-gray-700">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Reactions involving this chemical */}
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-gray-600 mb-2">Related Reactions:</p>
                <div className="flex flex-wrap gap-2">
                  {reactions
                    .filter(r => r.reactants.includes(selectedChemDetail.id) || r.products.includes(selectedChemDetail.id))
                    .slice(0, 6)
                    .map(r => (
                      <span
                        key={r.id}
                        onClick={() => { setSelectedRxnDetail(r); setActiveTab("reactions"); }}
                        className="px-2 py-1 bg-white border border-blue-200 text-blue-600 text-[10px] rounded-lg cursor-pointer hover:bg-blue-100 font-mono"
                      >
                        {r.equation}
                      </span>
                    ))
                  }
                  {reactions.filter(r => r.reactants.includes(selectedChemDetail.id) || r.products.includes(selectedChemDetail.id)).length === 0 && (
                    <span className="text-[10px] text-gray-400">No reactions in database</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── INSTRUMENTS TAB ─────────────────────────────────────────────────── */}
      {activeTab === "instruments" && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="Search instruments..."
                value={searchInstr}
                onChange={(e) => setSearchInstr(e.target.value)}
              />
            </div>
            <select className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="glassware">🥛 Glassware</option>
              <option value="heating">🔥 Heating</option>
              <option value="measuring">📏 Measuring</option>
              <option value="support">🏗️ Support</option>
              <option value="safety">🛡️ Safety</option>
              <option value="other">📦 Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredInstrs.map((inst) => (
              <button
                key={inst.id}
                onClick={() => setSelectedInstrDetail(selectedInstrDetail?.id === inst.id ? null : inst)}
                className={`text-left rounded-xl border p-3 transition-all hover:shadow-md ${
                  selectedInstrDetail?.id === inst.id
                    ? "border-purple-400 bg-purple-50 shadow-md"
                    : "border-gray-100 bg-white hover:border-purple-200"
                }`}
              >
                <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${inst.imageBg} mb-2 flex items-center justify-center text-3xl`}>
                  {inst.emoji}
                </div>
                <p className="text-xs font-semibold text-gray-800 leading-tight">{inst.name}</p>
                <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                  inst.category === "glassware" ? "bg-blue-100 text-blue-700" :
                  inst.category === "heating" ? "bg-red-100 text-red-700" :
                  inst.category === "measuring" ? "bg-teal-100 text-teal-700" :
                  inst.category === "support" ? "bg-gray-100 text-gray-600" :
                  inst.category === "safety" ? "bg-green-100 text-green-700" :
                  "bg-orange-100 text-orange-700"
                }`}>
                  {inst.category}
                </span>
                {inst.maxVolume && (
                  <p className="text-[9px] text-gray-400 mt-0.5">{inst.maxVolume} mL</p>
                )}
              </button>
            ))}
          </div>

          {/* Instrument Detail */}
          {selectedInstrDetail && (
            <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-4">
              <div className="flex items-start gap-4">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${selectedInstrDetail.imageBg} flex items-center justify-center text-4xl border-2 border-white shadow-md shrink-0`}>
                  {selectedInstrDetail.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-800">{selectedInstrDetail.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block mt-1 ${
                        selectedInstrDetail.category === "glassware" ? "bg-blue-100 text-blue-700" :
                        selectedInstrDetail.category === "heating" ? "bg-red-100 text-red-700" :
                        selectedInstrDetail.category === "measuring" ? "bg-teal-100 text-teal-700" :
                        selectedInstrDetail.category === "support" ? "bg-gray-200 text-gray-600" :
                        selectedInstrDetail.category === "safety" ? "bg-green-100 text-green-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {selectedInstrDetail.category}
                      </span>
                    </div>
                    {selectedInstrDetail.maxVolume && (
                      <div className="bg-white border border-gray-100 rounded-lg px-3 py-1.5 text-center">
                        <p className="text-[9px] text-gray-400">Max Volume</p>
                        <p className="text-sm font-bold text-gray-700">{selectedInstrDetail.maxVolume} mL</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{selectedInstrDetail.description}</p>
                  <div className="mt-3 bg-white rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400 uppercase mb-1">Usage</p>
                    <p className="text-xs text-gray-700">{selectedInstrDetail.usage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REACTIONS TAB ───────────────────────────────────────────────────── */}
      {activeTab === "reactions" && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {reactions.map((rxn) => (
              <button
                key={rxn.id}
                onClick={() => setSelectedRxnDetail(selectedRxnDetail?.id === rxn.id ? null : rxn)}
                className={`text-left rounded-xl border p-3 transition-all hover:shadow-md ${
                  selectedRxnDetail?.id === rxn.id
                    ? "border-green-400 bg-green-50 shadow-md"
                    : "border-gray-100 bg-white hover:border-green-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                    rxn.energyChange === "exothermic" ? "bg-red-100 text-red-700" :
                    rxn.energyChange === "endothermic" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {rxn.energyChange === "exothermic" ? "🔴 Exothermic" :
                     rxn.energyChange === "endothermic" ? "🔵 Endothermic" : "⚪ Neutral"}
                  </span>
                  {rxn.heatRequired && (
                    <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">🔥 Heat</span>
                  )}
                </div>
                <p className="text-xs font-mono font-semibold text-gray-800 mb-1">{rxn.equation}</p>
                <p className="text-[10px] text-gray-500 line-clamp-2">{rxn.description}</p>
                {rxn.conditions && (
                  <p className="text-[10px] text-purple-600 mt-1 font-medium">⚡ {rxn.conditions}</p>
                )}
              </button>
            ))}
          </div>

          {/* Reaction Detail */}
          {selectedRxnDetail && (
            <div className="mt-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-100 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 font-mono">{selectedRxnDetail.equation}</h3>
                  {selectedRxnDetail.conditions && (
                    <p className="text-xs text-purple-600 font-medium mt-0.5">Conditions: {selectedRxnDetail.conditions}</p>
                  )}
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                  selectedRxnDetail.energyChange === "exothermic" ? "bg-red-100 text-red-700" :
                  selectedRxnDetail.energyChange === "endothermic" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {selectedRxnDetail.energyChange}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3">{selectedRxnDetail.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {/* Reactants */}
                <div className="bg-white rounded-xl p-3">
                  <p className="text-[10px] font-bold text-red-600 mb-2">⬅ Reactants</p>
                  <div className="space-y-1.5">
                    {selectedRxnDetail.reactants.map((rid) => {
                      const c = getChemicalById(rid);
                      return (
                        <div key={rid} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm border border-gray-100" style={{ background: c?.color || "#eee" }} />
                          <span className="text-xs font-mono font-semibold text-gray-700">{c?.formula || rid}</span>
                          <span className="text-[10px] text-gray-400">{c?.name || rid}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Products */}
                <div className="bg-white rounded-xl p-3">
                  <p className="text-[10px] font-bold text-green-600 mb-2">➡ Products</p>
                  <div className="space-y-1.5">
                    {selectedRxnDetail.products.map((pid) => {
                      const c = getChemicalById(pid);
                      return (
                        <div key={pid} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm border border-gray-100" style={{ background: c?.color || "#eee" }} />
                          <span className="text-xs font-mono font-semibold text-gray-700">{c?.formula || pid}</span>
                          <span className="text-[10px] text-gray-400">{c?.name || pid}</span>
                          {selectedRxnDetail.gasProduced === pid && <span className="text-[9px] text-sky-600">↑ gas</span>}
                          {selectedRxnDetail.precipitateFormed === pid && <span className="text-[9px] text-stone-600">↓ ppt</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div className="bg-white rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-600 mb-2">👁️ Observations</p>
                <ul className="space-y-1">
                  {selectedRxnDetail.observations.map((obs, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-700">
                      <span className="text-green-500 mt-0.5 shrink-0">•</span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
                {selectedRxnDetail.colorChange && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-gray-500">Color Change:</span>
                    <span className="text-[10px] text-gray-700 bg-gray-50 px-2 py-0.5 rounded-full">{selectedRxnDetail.colorChange}</span>
                  </div>
                )}
              </div>

              {/* Try in lab */}
              <button
                onClick={() => {
                  setSelectedChemicals(selectedRxnDetail.reactants.slice(0, 4));
                  if (selectedRxnDetail.catalystRequired) setHasCatalyst(selectedRxnDetail.catalystRequired);
                  setActiveTab("lab");
                }}
                className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                🧪 Try in Virtual Lab
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
