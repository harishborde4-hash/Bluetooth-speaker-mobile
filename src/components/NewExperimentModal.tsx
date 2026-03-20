import React, { useState } from "react";

interface NewExperimentModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  { label: "Basic Info", icon: "📝" },
  { label: "Select Type", icon: "🔬" },
  { label: "Configure", icon: "⚙️" },
];

export const NewExperimentModal: React.FC<NewExperimentModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", type: "", description: "" });

  if (!open) return null;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-w-[95vw] overflow-hidden animate-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Create New Experiment</h2>
            <p className="text-blue-100 text-xs mt-0.5">Set up your virtual lab experiment</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step ? "bg-green-500 text-white" : i === step ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-blue-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 rounded-full ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Experiment Name *</label>
                <input
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Enter experiment name..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <textarea
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  placeholder="Describe the experiment purpose..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🔭", label: "Inquiry Experiment", desc: "Hands-on lab simulation" },
                { icon: "🧊", label: "3D Resource", desc: "Interactive 3D model" },
                { icon: "🎬", label: "Video Resource", desc: "Educational video content" },
                { icon: "🖥️", label: "Interactive Courseware", desc: "Slide-based interactive" },
              ].map((t) => (
                <button
                  key={t.label}
                  onClick={() => setForm({ ...form, type: t.label })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.type === t.label
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-xs font-semibold text-gray-700">{t.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm font-semibold text-green-700">Ready to Create!</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div><span className="font-medium">Name:</span> {form.name || "—"}</div>
                  <div><span className="font-medium">Type:</span> {form.type || "—"}</div>
                  {form.description && <div><span className="font-medium">Description:</span> {form.description}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-blue-400 text-sm">ℹ️</span>
                <p className="text-xs text-blue-600">Your experiment will be saved to "My Experiments" and ready for customization.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-between items-center">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            {step > 0 ? "Back" : "Cancel"}
          </button>
          <button
            onClick={() => {
              if (step < steps.length - 1) setStep(step + 1);
              else onClose();
            }}
            className="px-5 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            {step < steps.length - 1 ? "Next →" : "Create Experiment 🎉"}
          </button>
        </div>
      </div>
    </div>
  );
};
