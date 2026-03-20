import React, { useMemo, useState } from "react";
import { experiments } from "../data/experiments";
import type { ResourceType, SortType } from "../data/experiments";
import { ExperimentCard } from "./ExperimentCard";
import { FilterBar } from "./FilterBar";

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 9.90039H14.7996" stroke="currentColor" strokeLinecap="round" />
    <path d="M10.8997 14L10.8997 6.0002" stroke="currentColor" strokeLinecap="round" />
    <path d="M8.40044 13.6002H3.20044C2.09587 13.6002 1.20044 12.7047 1.20044 11.6002V3.60016C1.20044 2.49559 2.09587 1.60016 3.20044 1.60016H11.5505C12.3513 1.60016 13.0004 2.24932 13.0004 3.05011V3.05011C13.0004 3.8509 12.3513 4.50006 11.5505 4.50006H2.40044" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

interface ExperimentGridProps {
  onNewExperiment: () => void;
}

export const ExperimentGrid: React.FC<ExperimentGridProps> = ({ onNewExperiment }) => {
  const [selectedType, setSelectedType] = useState<ResourceType>("All");
  const [sortBy, setSortBy] = useState<SortType>("Teaching Progress");
  const [newCurriculum, setNewCurriculum] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let list = [...experiments];
    if (selectedType !== "All") {
      list = list.filter((e) => e.type === selectedType);
    }
    if (freeOnly) {
      list = list.filter((e) => e.isFree);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q));
    }
    if (sortBy === "Most Used") {
      list.sort((a, b) => {
        const parse = (s: string) => parseFloat(s.replace("k", "")) * (s.includes("k") ? 1000 : 1);
        return parse(b.usageCount) - parse(a.usageCount);
      });
    } else if (sortBy === "Latest") {
      list = [...list].reverse();
    }
    return list;
  }, [selectedType, freeOnly, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleTypeChange = (t: ResourceType) => {
    setSelectedType(t);
    setPage(1);
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Title bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-bold text-gray-800">
            NB Chemistry Lab · <span className="text-blue-500">Premium Experiments</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            <span className="font-semibold text-gray-600">{filtered.length}</span> experiments available
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden sm:block">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 w-48 transition-all"
              placeholder="Search experiments..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button
            id="createNewPriment"
            onClick={onNewExperiment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
          >
            <PlusIcon />
            New Experiment
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar
        selectedType={selectedType}
        setSelectedType={handleTypeChange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        newCurriculum={newCurriculum}
        setNewCurriculum={setNewCurriculum}
        freeOnly={freeOnly}
        setFreeOnly={setFreeOnly}
      />

      {/* Grid */}
      {paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((exp) => (
              <ExperimentCard key={exp.id} experiment={exp} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors ${
                    p === page ? "bg-blue-500 text-white" : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-30">
            <path d="M9 3H15M9 3V13L4.5 20.5C4.5 20.5 4 21.5 5 22H19C20 21.5 19.5 20.5 19.5 20.5L15 13V3M9 3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="text-sm font-medium">No experiments found</p>
          <p className="text-xs mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};
