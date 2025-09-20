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
            <h1 className="text-xl font-bold text-gray-900">Road Safety Reporter</h1>
            <p className="text-sm text-gray-600">Community-driven road safety monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">📍 Hsinchu, Taiwan</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
