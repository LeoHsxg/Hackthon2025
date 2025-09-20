import React from "react";
import { Shield } from "lucide-react";

const Header = () => {
  return (
    <div className="bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500 rounded-lg p-2">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">道路安全回報系統</h1>
            <p className="text-sm text-gray-600">社群共享道路安全監控</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">📍 台灣新竹</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
