import React from "react";

const chapters = [
  "Unit 1: Introduction to Chemistry",
  "Unit 2: Composition of Matter",
  "Unit 3: Molecules and Atoms",
  "Unit 4: Water and Hydrogen",
  "Unit 5: Law of Mass Conservation",
  "Unit 6: Carbon and its Compounds",
  "Unit 7: Combustion and Fuels",
  "Unit 8: Metals",
  "Unit 9: Solutions",
  "Unit 10: Acids, Bases & Salts",
];

export const Sidebar: React.FC = () => {
  const [active, setActive] = React.useState(0);

  return (
    <aside className="w-[220px] shrink-0 hidden lg:block">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-400">
          <p className="text-white text-xs font-semibold tracking-wider uppercase">Table of Contents</p>
        </div>
        <ul className="divide-y divide-gray-50">
          {chapters.map((chapter, i) => (
            <li key={i}>
              <button
                onClick={() => setActive(i)}
                className={`w-full text-left px-4 py-2.5 text-[12.5px] transition-colors ${
                  active === i
                    ? "text-blue-600 bg-blue-50 font-medium border-l-2 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-500 border-l-2 border-transparent"
                }`}
              >
                {chapter}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
