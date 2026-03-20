import React, { useMemo, useState } from "react";
import { experiments } from "../data/experiments";
import type { ResourceType, SortType, Experiment } from "../data/experiments";
import { ExperimentCard } from "./ExperimentCard";
import { FilterBar } from "./FilterBar";
import { VirtualLabSimulator } from "./VirtualLabSimulator";
import { ExperimentDetail } from "./ExperimentDetail";

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 9.90039H14.7996" stroke="currentColor" strokeLinecap="round" />
    <path d="M10.8997 14L10.8997 6.0002" stroke="currentColor" strokeLinecap="round" />
    <path d="M8.40044 13.6002H3.20044C2.09587 13.6002 1.20044 12.7047 1.20044 11.6002V3.60016C1.20044 2.49559 2.09587 1.60016 3.20044 1.60016H11.5505C12.3513 1.60016 13.0004 2.24932 13.0004 3.05011V3.05011C13.0004 3.8509 12.3513 4.50006 11.5505 4.50006H2.40044" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

interface ExperimentGridProps {
  onNewExperiment: () => void;
}

type MainView = "experiments" | "virtuallab";

export const ExperimentGrid: React.FC<ExperimentGridProps> = ({ onNewExperiment }) => {
  const [mainView, setMainView] = useState<MainView>("experiments");
  const [selectedType, setSelectedType] = useState<ResourceType>("All");
  const [sortBy, setSortBy] = useState<SortType>("Teaching Progress");
  const [newCurriculum, setNewCurriculum] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openExperiment, setOpenExperiment] = useState<Experiment | null>(null);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let list = [...experiments];
    if (selectedType !== "All") list = list.filter((e) => e.type === selectedType);
    if (freeOnly) list = list.filter((e) => e.isFree);
    if (newCurriculum) list = list.filter((e) => e.isNew || e.isFree);
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
  }, [selectedType, freeOnly, newCurriculum, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleTypeChange = (t: ResourceType) => { setSelectedType(t); setPage(1); };

  return (
    <div className="flex-1 min-w-0">
      {/* Title bar */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-sm font-bold text-gray-800">
            NB Chemistry Lab · <span className="text-blue-500">Premium Experiments</span>
          </h1>
          {mainView === "experiments" && (
            <p className="text-xs text-gray-400 mt-0.5">
              <span className="font-semibold text-gray-600">{filtered.length}</span> experiments available
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setMainView("experiments")}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                mainView === "experiments" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📚 Experiments
            </button>
            <button
              onClick={() => setMainView("virtuallab")}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                mainView === "virtuallab" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🧪 Virtual Lab
            </button>
          </div>

          {/* Search */}
          {mainView === "experiments" && (
            <div className="relative hidden sm:block">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 w-44 transition-all"
                placeholder="Search experiments..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          )}

          <button
            onClick={onNewExperiment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
          >
            <PlusIcon />
            <span className="hidden sm:inline">New Experiment</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Virtual Lab View */}
      {mainView === "virtuallab" && (
        <>
          {/* Mobile toggle for lab */}
          <div className="sm:hidden flex items-center bg-gray-100 rounded-lg p-0.5 mb-3">
            <button
              onClick={() => setMainView("experiments")}
              className="flex-1 px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 rounded-md"
            >
              📚 Experiments
            </button>
            <button
              className="flex-1 px-2.5 py-1.5 text-[11px] font-semibold bg-white text-blue-600 shadow-sm rounded-md"
            >
              🧪 Virtual Lab
            </button>
          </div>
          <VirtualLabSimulator />
        </>
      )}

      {/* Experiments View */}
      {mainView === "experiments" && (
        <>
          {/* Mobile search */}
          <div className="sm:hidden mb-3">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="Search experiments..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* Mobile virtual lab toggle */}
          <div className="sm:hidden mb-3">
            <button
              onClick={() => setMainView("virtuallab")}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-xs font-semibold rounded-xl"
            >
              🧪 Open Virtual Lab Simulator
            </button>
          </div>

          {/* Virtual Lab Banner */}
          <div className="mb-4 bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-xl shrink-0">
                🧪
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Interactive Virtual Lab</p>
                <p className="text-[10px] text-gray-500">Mix chemicals · Apply heat · Watch reactions · 50+ chemicals · 35+ instruments</p>
              </div>
            </div>
            <button
              onClick={() => setMainView("virtuallab")}
              className="shrink-0 px-3 py-1.5 bg-blue-500 text-white text-[11px] font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Launch →
            </button>
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {paginated.map((exp) => (
                  <ExperimentCard
                    key={exp.id}
                    experiment={exp}
                    onOpen={setOpenExperiment}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-8">
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
              <p className="text-xs mt-1">Try adjusting your filters or search</p>
            </div>
          )}
        </>
      )}

      {/* Experiment Detail Modal */}
      {openExperiment && (
        <ExperimentDetail
          experiment={openExperiment}
          onClose={() => setOpenExperiment(null)}
        />
      )}
    </div>
  );
};
