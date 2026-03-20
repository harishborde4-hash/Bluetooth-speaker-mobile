import React, { useState, useEffect, useRef } from "react";
import type { Experiment } from "../data/experiments";
import { getReactionsByExperiment, getChemicalById, instruments as allInstruments, hazardColors, hazardLabels } from "../data/chemicals";

interface ExperimentDetailProps {
  experiment: Experiment;
  onClose: () => void;
}

const StepIndicator: React.FC<{ steps: string[]; current: number }> = ({ steps, current }) => (
  <div className="flex items-center gap-1 overflow-x-auto pb-1">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
          i < current ? "bg-green-100 text-green-700" :
          i === current ? "bg-blue-500 text-white shadow-sm" :
          "bg-gray-100 text-gray-400"
        }`}>
          {i < current ? "✓" : i + 1}
          <span className="hidden sm:inline">{step}</span>
        </div>
        {i < steps.length - 1 && (
          <div className={`w-4 h-0.5 shrink-0 ${i < current ? "bg-green-300" : "bg-gray-200"}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// Experiment procedure steps by ID
const experimentProcedures: Record<string, {
  objective: string;
  theory: string;
  materials: { name: string; quantity: string }[];
  apparatus: string[];
  steps: { title: string; description: string; safetyNote?: string; expectedObservation?: string }[];
  questions: { q: string; a: string }[];
}> = {
  "346": {
    objective: "Prepare oxygen gas by heating potassium permanganate and collect it by upward displacement of air.",
    theory: "Potassium permanganate (KMnO₄) is a dark purple solid that decomposes on heating above 200°C. The decomposition produces potassium manganate (K₂MnO₄), manganese dioxide (MnO₂), and oxygen gas (O₂). The equation is: 2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑. Oxygen is denser than air and can be collected by upward displacement.",
    materials: [
      { name: "Potassium Permanganate (KMnO₄)", quantity: "2–3 g" },
      { name: "Cotton wool / glass wool", quantity: "small piece" },
      { name: "Distilled water", quantity: "as needed" },
    ],
    apparatus: ["test_tube", "rubber_stopper_1", "delivery_tube", "gas_jar", "alcohol_lamp", "test_tube_holder", "retort_stand"],
    steps: [
      { title: "Setup", description: "Place 2–3 g of KMnO₄ in a large test tube. Insert a small plug of cotton wool near the mouth to prevent solid particles from entering the delivery tube.", safetyNote: "Wear goggles and gloves. KMnO₄ is a strong oxidizer." },
      { title: "Assemble", description: "Fit a one-hole rubber stopper with a bent glass delivery tube. Clamp the test tube at an angle of ~45° to the retort stand over the alcohol lamp." },
      { title: "Check Seal", description: "Before heating, check that all connections are airtight by placing the end of the delivery tube in water. No bubbles should appear before heating begins." },
      { title: "Heat", description: "Light the alcohol lamp and gently heat the test tube. Move the flame slowly up and down along the test tube.", safetyNote: "Never heat a sealed system. Ensure the tube is pointing away from people.", expectedObservation: "After ~1 minute, a stream of bubbles appears from the delivery tube." },
      { title: "Collect Gas", description: "Collect the gas in an upturned gas jar filled with water (water displacement method) or simply by upward displacement of air.", expectedObservation: "Gas collects and fills the jar." },
      { title: "Test Gas", description: "Test the collected gas with a glowing wooden splint.", expectedObservation: "The glowing splint relights — confirms oxygen." },
      { title: "Finish", description: "Remove the delivery tube from water BEFORE removing the flame, to prevent suck-back.", safetyNote: "Always remove delivery tube from water before stopping the heat." },
    ],
    questions: [
      { q: "Why is a glowing (not burning) splint used to test for oxygen?", a: "Because oxygen supports combustion. A glowing splint has just enough heat — oxygen will reignite it. A burning splint would not show this clearly." },
      { q: "Why must the delivery tube be removed before the flame is extinguished?", a: "To prevent suck-back: when the tube cools, it creates a partial vacuum that would suck water into the hot glass test tube, cracking it." },
      { q: "What does the purple colour of KMnO₄ indicate about its oxidation state?", a: "Mn is in the +7 oxidation state (the highest). This makes it a powerful oxidizer. After decomposition, MnO₂ (Mn = +4) and K₂MnO₄ (Mn = +6) are produced." },
    ],
  },
  "454": {
    objective: "Observe iron wire burning in pure oxygen and identify the product formed.",
    theory: "Iron burns vigorously in pure oxygen, producing sparks and bright light. The product is iron(II,III) oxide (Fe₃O₄, also called magnetic iron oxide or magnetite). Equation: 3Fe + 2O₂ → Fe₃O₄. The reaction is highly exothermic. In air, iron only rusts slowly, but in pure O₂ it burns dramatically.",
    materials: [
      { name: "Iron wire (thin, approx. 0.3 mm)", quantity: "15–20 cm" },
      { name: "Oxygen gas", quantity: "gas jar full" },
      { name: "Sand or water", quantity: "to cover base of jar" },
      { name: "Wooden splint", quantity: "1" },
    ],
    apparatus: ["gas_jar", "retort_stand", "goggles"],
    steps: [
      { title: "Prepare Jar", description: "Fill a wide-mouth gas jar with pure oxygen. Add a 2 cm layer of sand or water at the bottom to absorb hot particles.", safetyNote: "Wear goggles. Iron sparks are very hot." },
      { title: "Prepare Iron", description: "Coil 15–20 cm of fine iron wire into a loose spiral. Attach a small piece of dry wood (splint) to the end of the wire." },
      { title: "Ignite", description: "Light the wooden splint in a flame until it burns, then immediately blow it out so it glows. Quickly insert the glowing end into the oxygen jar.", expectedObservation: "Iron wire ignites and burns with brilliant white-blue sparks." },
      { title: "Observe", description: "Watch the iron burn. Observe the color, sparks, and residue.", expectedObservation: "Bright sparks fly out. Black/grey droplets form and fall to the bottom." },
      { title: "Analyze", description: "After cooling, examine the black solid at the bottom. Use a magnet — it is attracted, confirming Fe₃O₄ (magnetic).", expectedObservation: "Black solid is attracted to magnet — confirms Fe₃O₄." },
    ],
    questions: [
      { q: "Why does iron wire need pure oxygen to burn but only rusts in air?", a: "The concentration of O₂ is critical. Air is only 21% O₂, which is too dilute for rapid combustion. In pure O₂, enough molecules collide with Fe atoms to sustain rapid exothermic burning." },
      { q: "What is the purpose of sand or water at the bottom of the jar?", a: "To prevent the hot burning droplets of Fe₃O₄ from cracking the glass jar." },
      { q: "Why is Fe₃O₄ (not Fe₂O₃ or FeO) formed?", a: "Fe₃O₄ is a mixed oxide (FeO·Fe₂O₃) that forms at very high temperatures in excess O₂. It is thermodynamically the most stable product under these conditions." },
    ],
  },
  "461": {
    objective: "Demonstrate that water is composed of hydrogen and oxygen using electrolysis.",
    theory: "Electrolysis uses electrical energy to decompose water into its constituent elements. At the cathode (–): 2H₂O + 2e⁻ → H₂ + 2OH⁻. At the anode (+): 2H₂O → O₂ + 4H⁺ + 4e⁻. Overall: 2H₂O(l) → 2H₂(g) + O₂(g). The volume ratio of H₂:O₂ = 2:1, confirming the formula H₂O.",
    materials: [
      { name: "Distilled water", quantity: "300 mL" },
      { name: "Sodium sulfate (Na₂SO₄)", quantity: "1 g (electrolyte)" },
      { name: "DC power supply", quantity: "6–12 V" },
      { name: "Carbon or platinum electrodes", quantity: "2" },
    ],
    apparatus: ["beaker_250", "balance", "goggles", "gloves"],
    steps: [
      { title: "Prepare Solution", description: "Dissolve 1 g of Na₂SO₄ in 300 mL of distilled water in a beaker. This increases conductivity without being electrolyzed itself." },
      { title: "Set Up Electrodes", description: "Position two electrodes (carbon or platinum) in the solution, connected to a DC power supply at 6–12V." },
      { title: "Switch On", description: "Turn on the power supply.", expectedObservation: "Bubbles immediately form at both electrodes." },
      { title: "Observe Volumes", description: "Collect gases in inverted tubes over each electrode. Wait 5 minutes.", expectedObservation: "Volume at cathode (H₂) is exactly DOUBLE that at anode (O₂)." },
      { title: "Test H₂", description: "Test the gas at the cathode with a burning splint.", expectedObservation: "Makes a 'pop' sound — confirms hydrogen." },
      { title: "Test O₂", description: "Test the gas at the anode with a glowing splint.", expectedObservation: "Splint relights — confirms oxygen." },
    ],
    questions: [
      { q: "Why is Na₂SO₄ added to the water?", a: "Pure distilled water has very low conductivity. Na₂SO₄ dissociates into Na⁺ and SO₄²⁻ ions, greatly increasing conductivity to allow current to flow." },
      { q: "Why is the H₂:O₂ volume ratio 2:1?", a: "Water's formula H₂O means 2 H atoms for every O atom. Electrolysis splits each water molecule: 2H₂O → 2H₂ + O₂. So twice as many H₂ molecules are produced as O₂." },
    ],
  },
  "471": {
    objective: "Prepare CO₂ in the laboratory and investigate its chemical properties.",
    theory: "CO₂ is prepared by reacting calcium carbonate (CaCO₃) with dilute hydrochloric acid (HCl): CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑. CO₂ is denser than air and collected by upward displacement. Key properties: turns limewater milky (CaCO₃ precipitate), extinguishes flames, dissolves in water to form weak carbonic acid.",
    materials: [
      { name: "Marble chips / CaCO₃", quantity: "5–10 g" },
      { name: "Dilute HCl (1 mol/L)", quantity: "20 mL" },
      { name: "Limewater (Ca(OH)₂ solution)", quantity: "10 mL" },
      { name: "Litmus solution / Universal indicator", quantity: "a few drops" },
    ],
    apparatus: ["erlenmeyer", "long_neck_funnel", "rubber_stopper_2", "delivery_tube", "gas_jar", "test_tube", "graduated_cyl"],
    steps: [
      { title: "Setup Generator", description: "Place marble chips in the conical flask. Insert a two-hole rubber stopper with a long-neck funnel (for acid addition) and a delivery tube." },
      { title: "Add Acid", description: "Pour dilute HCl through the funnel into the flask.", expectedObservation: "Vigorous bubbling. Marble chips dissolve slowly." },
      { title: "Collect CO₂", description: "Collect CO₂ by upward displacement of air (CO₂ is denser than air). Hold the delivery tube at the bottom of the gas jar.", expectedObservation: "Gas fills the jar from bottom up." },
      { title: "Test with Limewater", description: "Pass CO₂ through limewater solution.", expectedObservation: "Limewater turns milky/cloudy — precipitate of CaCO₃ confirms CO₂." },
      { title: "Test Flame", description: "Lower a burning candle into a jar of collected CO₂.", expectedObservation: "Candle extinguishes — CO₂ does not support combustion." },
      { title: "Test Acid Properties", description: "Dissolve some CO₂ in water, add universal indicator.", expectedObservation: "Indicator turns yellow/orange — CO₂ makes carbonic acid (H₂CO₃), pH < 7." },
    ],
    questions: [
      { q: "Why can't concentrated HCl be used in this experiment?", a: "Concentrated HCl is volatile and produces HCl vapor that contaminates the CO₂, making results less accurate and increasing hazard." },
      { q: "Why is CO₂ collected by upward displacement of air rather than over water?", a: "CO₂ is moderately soluble in water. Collecting over water would lose a significant portion of the gas." },
      { q: "What is the equation when excess CO₂ is passed into limewater?", a: "CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂. The milky precipitate dissolves again because the insoluble CaCO₃ converts to soluble Ca(HCO₃)₂." },
    ],
  },
};

// Default fallback procedure
const defaultProcedure = (exp: Experiment) => ({
  objective: `Conduct and observe the experiment: ${exp.title}`,
  theory: `This experiment explores fundamental chemistry concepts. Following the standard laboratory protocol ensures accurate and repeatable results.`,
  materials: [
    { name: "Relevant chemicals", quantity: "as required" },
    { name: "Distilled water", quantity: "as needed" },
  ],
  apparatus: ["beaker_250", "test_tube", "alcohol_lamp", "goggles", "gloves"],
  steps: [
    { title: "Safety Check", description: "Review all safety procedures. Put on goggles and gloves. Ensure fire safety equipment is nearby.", safetyNote: "Safety first — always wear PPE." },
    { title: "Prepare Materials", description: "Measure and prepare all chemicals according to the procedure. Label all containers clearly." },
    { title: "Setup Apparatus", description: "Assemble the required glassware and instruments according to the diagram. Check all connections are secure." },
    { title: "Conduct Experiment", description: "Follow the experimental procedure carefully. Record all observations in real time." },
    { title: "Record Results", description: "Record all observations including colour changes, temperature changes, gas evolution, and precipitate formation." },
    { title: "Clean Up", description: "Dispose of chemicals safely according to instructions. Clean all glassware and return instruments.", safetyNote: "Dispose of chemicals responsibly." },
  ],
  questions: [
    { q: "What is the main observation in this experiment?", a: "Observations depend on the specific chemicals and conditions used." },
    { q: "What safety precautions should be followed?", a: "Always wear goggles and gloves, work in a well-ventilated area, know the location of fire safety equipment." },
  ],
});

export const ExperimentDetail: React.FC<ExperimentDetailProps> = ({ experiment, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showAnswer, setShowAnswer] = useState<Set<number>>(new Set());
  const [activeSection, setActiveSection] = useState<"overview" | "procedure" | "chemistry" | "quiz">("overview");
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const proc = experimentProcedures[experiment.id] || defaultProcedure(experiment);
  const relatedReactions = getReactionsByExperiment(experiment.id);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const markStep = (i: number) => {
    setCompletedSteps(prev => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i); else n.add(i);
      return n;
    });
  };

  const toggleAnswer = (i: number) => {
    setShowAnswer(prev => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i); else n.add(i);
      return n;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 p-5 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{experiment.type}</span>
                {experiment.isFree && <span className="text-[10px] bg-emerald-400 px-2 py-0.5 rounded-full font-bold">FREE</span>}
              </div>
              <h2 className="text-lg font-bold leading-tight">{experiment.title}</h2>
              <p className="text-blue-100 text-xs mt-1 line-clamp-1">{proc.objective}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm font-bold shrink-0 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {([
              { key: "overview", label: "📋 Overview" },
              { key: "procedure", label: "🔬 Procedure" },
              { key: "chemistry", label: "⚗️ Chemistry" },
              { key: "quiz", label: "❓ Quiz" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeSection === tab.key
                    ? "bg-white text-blue-600"
                    : "text-white/80 hover:bg-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {/* ── OVERVIEW ────────────────────────────────────────────────── */}
          {activeSection === "overview" && (
            <div className="space-y-4">
              {/* Objective */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 mb-1">🎯 Learning Objective</p>
                <p className="text-sm text-gray-700">{proc.objective}</p>
              </div>

              {/* Theory */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 mb-2">📖 Theory</p>
                <p className="text-xs text-gray-700 leading-relaxed">{proc.theory}</p>
              </div>

              {/* Materials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-2">🧴 Materials Required</p>
                  <div className="space-y-1.5">
                    {proc.materials.map((m, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-700">{m.name}</span>
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{m.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-2">🔬 Apparatus</p>
                  <div className="space-y-1.5">
                    {proc.apparatus.map((id) => {
                      const inst = allInstruments.find((i) => i.id === id);
                      return inst ? (
                        <div key={id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                          <span>{inst.emoji}</span>
                          <span className="text-xs text-gray-700">{inst.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              {/* Safety */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-bold text-red-600 mb-2">⚠️ Safety Precautions</p>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>• Always wear safety goggles and gloves</li>
                  <li>• Work in a well-ventilated area</li>
                  <li>• Know the location of the fire extinguisher and eyewash station</li>
                  <li>• Never heat a closed system</li>
                  <li>• Dispose of chemicals according to teacher instructions</li>
                  {proc.steps.filter(s => s.safetyNote).map((s, i) => (
                    <li key={i}>• {s.safetyNote}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── PROCEDURE ───────────────────────────────────────────────── */}
          {activeSection === "procedure" && (
            <div className="space-y-4">
              {/* Timer */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600">Lab Timer</p>
                  <p className="text-2xl font-mono font-bold text-gray-800">{formatTime(timer)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      timerRunning ? "bg-red-500 text-white" : "bg-green-500 text-white"
                    }`}
                  >
                    {timerRunning ? "⏸ Pause" : "▶ Start"}
                  </button>
                  <button
                    onClick={() => { setTimer(0); setTimerRunning(false); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-200 text-gray-600"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>

              {/* Step Navigator */}
              <div className="overflow-x-auto">
                <StepIndicator
                  steps={proc.steps.map(s => s.title)}
                  current={currentStep}
                />
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {proc.steps.map((step, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 transition-all ${
                      i === currentStep ? "border-blue-300 bg-blue-50 shadow-sm" :
                      completedSteps.has(i) ? "border-green-200 bg-green-50" :
                      "border-gray-100 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => markStep(i)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                          completedSteps.has(i)
                            ? "bg-green-500 border-green-500 text-white"
                            : i === currentStep
                            ? "border-blue-500 text-blue-500"
                            : "border-gray-200 text-gray-400"
                        }`}
                      >
                        {completedSteps.has(i) ? "✓" : i + 1}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{step.description}</p>
                        {step.safetyNote && (
                          <div className="mt-2 flex items-start gap-1.5 text-[10px] text-red-600 bg-red-50 rounded-lg px-2 py-1.5">
                            <span>⚠️</span>
                            <span>{step.safetyNote}</span>
                          </div>
                        )}
                        {step.expectedObservation && (
                          <div className="mt-2 flex items-start gap-1.5 text-[10px] text-green-700 bg-green-50 rounded-lg px-2 py-1.5">
                            <span>👁️</span>
                            <span><strong>Expected:</strong> {step.expectedObservation}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setCurrentStep(i)}
                        className={`text-[10px] px-2 py-1 rounded-lg shrink-0 ${
                          i === currentStep ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                        }`}
                      >
                        {i === currentStep ? "Current" : "Go"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  ← Previous Step
                </button>
                <button
                  onClick={() => {
                    markStep(currentStep);
                    setCurrentStep(Math.min(proc.steps.length - 1, currentStep + 1));
                  }}
                  disabled={currentStep === proc.steps.length - 1}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 transition-colors"
                >
                  Next Step →
                </button>
              </div>

              {completedSteps.size === proc.steps.length && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-green-700">🎉 Experiment Complete!</p>
                  <p className="text-xs text-green-600 mt-1">Time taken: {formatTime(timer)}</p>
                </div>
              )}
            </div>
          )}

          {/* ── CHEMISTRY ───────────────────────────────────────────────── */}
          {activeSection === "chemistry" && (
            <div className="space-y-4">
              {relatedReactions.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-sm">No specific reaction data for this experiment.</p>
                  <p className="text-xs mt-1">Check the Virtual Lab tab to explore reactions.</p>
                </div>
              ) : relatedReactions.map((rxn) => (
                <div key={rxn.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  {/* Equation header */}
                  <div className={`px-4 py-3 ${
                    rxn.energyChange === "exothermic" ? "bg-red-50 border-b border-red-100" :
                    rxn.energyChange === "endothermic" ? "bg-blue-50 border-b border-blue-100" :
                    "bg-gray-50 border-b border-gray-100"
                  }`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold font-mono text-gray-800">{rxn.equation}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        rxn.energyChange === "exothermic" ? "bg-red-100 text-red-700" :
                        rxn.energyChange === "endothermic" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {rxn.energyChange}
                      </span>
                    </div>
                    {rxn.conditions && (
                      <p className="text-[11px] text-purple-600 mt-1">Conditions: {rxn.conditions}</p>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-gray-600">{rxn.description}</p>

                    {/* Reactants → Products visual */}
                    <div className="flex items-center gap-2 overflow-x-auto">
                      <div className="flex flex-wrap gap-1.5 shrink-0">
                        {rxn.reactants.map((rid) => {
                          const c = getChemicalById(rid);
                          return c ? (
                            <div key={rid} className="flex flex-col items-center bg-red-50 border border-red-100 rounded-xl p-2 min-w-[70px]">
                              <div className="w-6 h-6 rounded-full border border-gray-200 mb-1" style={{ background: c.color }} />
                              <p className="text-[10px] font-mono font-bold text-gray-700">{c.formula}</p>
                              <p className="text-[9px] text-gray-500 text-center">{c.name}</p>
                              <span className={`text-[8px] mt-1 px-1 py-0.5 rounded ${hazardColors[c.hazard || "none"]}`}>
                                {hazardLabels[c.hazard || "none"].split(" ")[0]}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <div className="text-2xl text-gray-400 shrink-0">→</div>
                      <div className="flex flex-wrap gap-1.5">
                        {rxn.products.map((pid) => {
                          const c = getChemicalById(pid);
                          return c ? (
                            <div key={pid} className="flex flex-col items-center bg-green-50 border border-green-100 rounded-xl p-2 min-w-[70px]">
                              <div className="w-6 h-6 rounded-full border border-gray-200 mb-1" style={{ background: c.color }} />
                              <p className="text-[10px] font-mono font-bold text-gray-700">{c.formula}</p>
                              <p className="text-[9px] text-gray-500 text-center">{c.name}</p>
                              {rxn.gasProduced === pid && <span className="text-[8px] text-sky-600 font-bold">↑ gas</span>}
                              {rxn.precipitateFormed === pid && <span className="text-[8px] text-stone-600 font-bold">↓ ppt</span>}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {/* Observations */}
                    <div>
                      <p className="text-[11px] font-bold text-gray-600 mb-1.5">👁️ Observations:</p>
                      <ul className="space-y-1">
                        {rxn.observations.map((obs, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-700">
                            <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                            {obs}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {rxn.colorChange && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-gray-500">Color Change:</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700">{rxn.colorChange}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── QUIZ ────────────────────────────────────────────────────── */}
          {activeSection === "quiz" && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                <p className="text-xs font-bold text-purple-700">🧠 Check Your Understanding</p>
                <p className="text-[10px] text-purple-600 mt-0.5">Click on each question to reveal the answer.</p>
              </div>

              {proc.questions.map((qa, i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleAnswer(i)}
                    className="w-full flex items-start justify-between gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm font-medium text-gray-800">{qa.q}</p>
                    </div>
                    <span className={`text-lg transition-transform shrink-0 ${showAnswer.has(i) ? "rotate-180" : ""}`}>⌄</span>
                  </button>

                  {showAnswer.has(i) && (
                    <div className="px-4 pb-4">
                      <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-2">
                        <span className="text-green-500 shrink-0">💡</span>
                        <p className="text-xs text-gray-700 leading-relaxed">{qa.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 font-medium">
                  {completedSteps.size === proc.steps.length
                    ? "✅ Great work! You've completed all steps and reviewed all questions."
                    : `Complete the procedure steps (${completedSteps.size}/${proc.steps.length} done) before the quiz.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>👁️ {experiment.usageCount} views</span>
            <span>•</span>
            <span>{experiment.type}</span>
            <span>•</span>
            <span>{proc.steps.length} steps</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
