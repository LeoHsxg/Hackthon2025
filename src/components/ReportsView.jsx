import React from "react";
import { MapPin, Filter, Search, MessageSquare, ChevronDown, ChevronRight, Users } from "lucide-react";
import { reportTypes } from "../data/reportTypes";
import StatsDashboard from "./StatsDashboard";

const ReportsView = ({ reports, groupedReports, expandedGroups, onToggleGroup, onVote, onSelectReport, getSeverityColor, getStatusColor }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Stats Dashboard */}
      <div className="p-4 bg-gray-50">
        <StatsDashboard reports={reports} />
      </div>
      
      {/* Reports Content */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">社群回報</h3>
          <div className="flex space-x-2">
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto h-[calc(100%-50px)]">
          {groupedReports.map(group => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Group Header */}
              <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => onToggleGroup(group.id)}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {expandedGroups.has(group.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            group.count >= 5 ? "bg-red-500" : group.count >= 3 ? "bg-yellow-500" : "bg-green-500"
                          }`}>
                          {group.count}
                        </div>
                        <Users className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{group.location}</h4>
                      <p className="text-sm text-gray-600">
                        {group.count} 個回報
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(group.severity)}`}>
                      {group.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Reports */}
              {expandedGroups.has(group.id) && (
                <div className="border-t bg-gray-50">
                  {group.reports.map(report => (
                    <div key={report.id} className="p-4 border-b last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{reportTypes.find(t => t.id === report.type)?.icon || "⚠️"}</span>
                          <h5 className="font-medium text-gray-900">{report.title}</h5>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-2">{report.description}</p>

                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <MapPin className="w-3 h-3 mr-1" />
                        {report.reportedAt.toLocaleDateString()} • by {report.reportedBy}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => onVote(report.id, "upvotes")}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-700">
                            <span className="text-sm">👍</span>
                            <span className="text-xs">{report.upvotes}</span>
                          </button>
                          <button
                            onClick={() => onVote(report.id, "downvotes")}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                            <span className="text-sm">👎</span>
                            <span className="text-xs">{report.downvotes}</span>
                          </button>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <MessageSquare className="w-3 h-3" />
                            <span className="text-xs">{report.comments}</span>
                          </div>
                        </div>
                        <button onClick={() => onSelectReport(report)} className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                          查看詳情
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
