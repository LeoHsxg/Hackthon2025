import React from "react";
import { MapPin, AlertTriangle, Clock, Users, Plus } from "lucide-react";

const MapView = ({ onShowReportModal }) => {
  return (
    <div className="h-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
        <div className="p-4 h-full flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Safety Map View
            </h3>
            <button
              onClick={onShowReportModal}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Report Issue
            </button>
          </div>

          {/* Map placeholder with reports overlay */}
          <div className="flex-1 bg-gray-200 rounded-lg relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Road Danger Level</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Low</span>
              </div>
            </div>

            {/* Sample map markers */}
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-red-500 rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-yellow-500 rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-yellow-500 rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="absolute bottom-4 left-4 text-gray-500 text-sm">📍 Interactive Google Maps integration would be loaded here</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
