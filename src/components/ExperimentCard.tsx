import React, { useState } from "react";
import type { Experiment } from "../data/experiments";

interface ExperimentCardProps {
  experiment: Experiment;
}

const EyeIcon = () => (
  <svg width="14" height="10" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0.141257 5.98803C2.23446 9.30307 4.62155 11 7.29726 11C9.97296 11 12.3601 9.30307 14.4533 5.98803C14.6416 5.69021 14.6416 5.30979 14.4533 5.01197C12.3601 1.69693 9.97296 0 7.29726 0C4.62155 0 2.23446 1.69693 0.141257 5.01197C-0.0470858 5.30979 -0.0470858 5.69021 0.141257 5.98803ZM1.1383 5.5001C3.03083 2.54129 5.08226 1.10011 7.29732 1.10011C9.51239 1.10011 11.5638 2.54129 13.4563 5.5001C11.5638 8.45891 9.51239 9.90009 7.29732 9.90009C5.08226 9.90009 3.03083 8.45891 1.1383 5.5001ZM7.29728 8.06667C5.87414 8.06667 4.72046 6.91753 4.72046 5.5C4.72046 4.08247 5.87414 2.93333 7.29728 2.93333C8.72042 2.93333 9.8741 4.08247 9.8741 5.5C9.8741 6.91753 8.72042 8.06667 7.29728 8.06667ZM8.76984 5.5001C8.76984 6.31007 8.11054 6.96676 7.29726 6.96676C6.48399 6.96676 5.82469 6.31007 5.82469 5.5001C5.82469 4.69014 6.48399 4.03344 7.29726 4.03344C8.11054 4.03344 8.76984 4.69014 8.76984 5.5001Z" fill="currentColor" />
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5.14v14l11-7-11-7z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1C9.24 1 7 3.24 7 6v1H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-2V6c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v1H9V6c0-1.66 1.34-3 3-3zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
  </svg>
);

const typeColors: Record<string, string> = {
  "Inquiry Experiment": "bg-blue-100 text-blue-600",
  "3D Resource": "bg-purple-100 text-purple-600",
  "Video Resource": "bg-red-100 text-red-600",
  "Interactive Courseware": "bg-green-100 text-green-600",
  "Study Guide": "bg-orange-100 text-orange-600",
};

export const ExperimentCard: React.FC<ExperimentCardProps> = ({ experiment }) => {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 150));
  const [imageError, setImageError] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <div
      className={`group bg-white rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 ${
        hovered
          ? "border-blue-300 shadow-lg shadow-blue-100/50 -translate-y-0.5"
          : "border-gray-100 shadow-sm hover:shadow-md"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50" style={{ aspectRatio: "16/9" }}>
        {!imageError ? (
          <img
            src={experiment.image}
            alt={experiment.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${hovered ? "scale-105" : "scale-100"}`}
            draggable={false}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-gray-300">
              <path d="M9 3H15M9 3V13L4.5 20.5C4.5 20.5 4 21.5 5 22H19C20 21.5 19.5 20.5 19.5 20.5L15 13V3M9 3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
            <PlayIcon />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {experiment.isFree && (
            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow">FREE</span>
          )}
          {experiment.isNew && (
            <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full shadow">NEW</span>
          )}
          {!experiment.isFree && (
            <span className="px-1.5 py-0.5 bg-black/50 text-white text-[10px] rounded-full flex items-center gap-1 backdrop-blur-sm">
              <LockIcon />
            </span>
          )}
        </div>

        {/* Type badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${typeColors[experiment.type] || "bg-gray-100 text-gray-600"} opacity-90`}>
            {experiment.type}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {experiment.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-gray-400">
            <EyeIcon />
            <span className="text-[11px]">{experiment.usageCount} views</span>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-[11px] transition-colors ${
              liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
