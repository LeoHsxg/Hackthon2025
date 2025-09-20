import React from "react";

const StatsFooter = ({ reportsCount }) => {
  return (
    <div className="bg-white border-t px-4 py-2">
      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>🏆 Community Reports: {reportsCount}</span>
        <span>🔄 Last Update: {new Date().toLocaleDateString()}</span>
        <span>👥 Active Users: 1,234</span>
      </div>
    </div>
  );
};

export default StatsFooter;
