import React from "react";
import { MapPin, Filter, Search, MessageSquare } from "lucide-react";
import { reportTypes } from "../data/reportTypes";

const ReportsView = ({ reports, onVote, onSelectReport, getSeverityColor, getStatusColor }) => {
  return (
    <div className="h-full p-4">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Community Reports</h3>
        <div className="flex space-x-2">
          <button className="p-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2 border rounded-lg hover:bg-gray-50">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto h-96">
        {reports.map(report => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{reportTypes.find(t => t.id === report.type)?.icon || "⚠️"}</span>
                <h4 className="font-semibold text-gray-900">{report.title}</h4>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                  {report.severity.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-2">{report.description}</p>

            <div className="flex items-center text-xs text-gray-500 mb-3">
              <MapPin className="w-3 h-3 mr-1" />
              {report.location} • {report.reportedAt.toLocaleDateString()}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button onClick={() => onVote(report.id, "upvotes")} className="flex items-center space-x-1 text-green-600 hover:text-green-700">
                  <span className="text-sm">👍</span>
                  <span className="text-xs">{report.upvotes}</span>
                </button>
                <button onClick={() => onVote(report.id, "downvotes")} className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                  <span className="text-sm">👎</span>
                  <span className="text-xs">{report.downvotes}</span>
                </button>
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-xs">{report.comments}</span>
                </div>
              </div>
              <button onClick={() => onSelectReport(report)} className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsView;
