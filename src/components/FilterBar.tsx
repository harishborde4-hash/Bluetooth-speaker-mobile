import React from "react";
import type { ResourceType, SortType } from "../data/experiments";

interface FilterBarProps {
  selectedType: ResourceType;
  setSelectedType: (t: ResourceType) => void;
  sortBy: SortType;
  setSortBy: (s: SortType) => void;
  newCurriculum: boolean;
  setNewCurriculum: (v: boolean) => void;
  freeOnly: boolean;
  setFreeOnly: (v: boolean) => void;
}

const types: ResourceType[] = [
  "All",
  "Inquiry Experiment",
  "3D Resource",
  "Video Resource",
  "Interactive Courseware",
  "Study Guide",
];

const sorts: SortType[] = ["Teaching Progress", "Most Used", "Latest"];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  newCurriculum,
  setNewCurriculum,
  freeOnly,
  setFreeOnly,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-5">
      <div className="flex flex-wrap items-center gap-y-3 justify-between">
        {/* Type filter */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-xs text-gray-400 mr-1 font-medium shrink-0">Resource Type:</span>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 text-xs rounded-full border transition-all font-medium ${
                selectedType === type
                  ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                  : "text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-500 bg-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-1 font-medium shrink-0">Sort:</span>
          {sorts.map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1 text-xs rounded-full border transition-all font-medium ${
                sortBy === s
                  ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                  : "text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-500 bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-50">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setNewCurriculum(!newCurriculum)}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
              newCurriculum ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                newCurriculum ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-xs text-gray-600 font-medium">New Curriculum</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setFreeOnly(!freeOnly)}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
              freeOnly ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                freeOnly ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-xs text-gray-600 font-medium">Free Only</span>
        </label>
      </div>
    </div>
  );
};
