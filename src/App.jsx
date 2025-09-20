import React, { useState } from "react";
import { MapPin, AlertTriangle, Clock, Users, Star, Plus, Search, Filter, Navigation, Shield, Eye, MessageSquare } from "lucide-react";
import Header from "./components/Header";
import StatsFooter from "./components/StatsFooter";
import MapView from "./components/MapView";
import ReportsView from "./components/ReportsView";
import DangerLevelsView from "./components/DangerLevelsView";
import { initialReports } from "./data/reports";
import { roadDangerLevels } from "./data/roadDangerLevels";
import { reportTypes } from "./data/reportTypes";
import "./App.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [showReportModal, setShowReportModal] = useState(false);
  const [_selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState(initialReports);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  const [newReport, setNewReport] = useState({
    type: "",
    title: "",
    description: "",
    location: "",
    severity: "medium",
  });

  const [roadDangerData] = useState(roadDangerLevels);

  // 生成分組報告數據
  const groupedReports = React.useMemo(() => {
    const locationGroups = {};
    
    reports.forEach(report => {
      const key = `${report.coordinates.lat.toFixed(5)},${report.coordinates.lng.toFixed(5)}`;
      if (!locationGroups[key]) {
        locationGroups[key] = {
          position: report.coordinates,
          reports: [],
          count: 0,
          location: report.location,
          severity: 'low'
        };
      }
      locationGroups[key].reports.push(report);
      locationGroups[key].count++;
      
      // 更新最高危險等級
      if (report.severity === 'high') {
        locationGroups[key].severity = 'high';
      } else if (report.severity === 'medium' && locationGroups[key].severity !== 'high') {
        locationGroups[key].severity = 'medium';
      }
    });

    return Object.values(locationGroups)
      .sort((a, b) => b.count - a.count)
      .map((group, index) => ({
        id: index + 1,
        position: group.position,
        count: group.count,
        reports: group.reports,
        location: group.location,
        severity: group.severity,
        title: `${group.count} report${group.count > 1 ? 's' : ''} at ${group.location}`
      }));
  }, [reports]);

  const toggleGroupExpansion = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // 處理地圖點擊事件
  const handleMapClick = (coordinates) => {
    setSelectedCoordinates(coordinates);
  };

  // 處理標記點擊事件 - 選擇該位置進行報告
  const handleMarkerClick = (coordinates) => {
    setSelectedCoordinates(coordinates);
  };

  // 處理報告提交
  const handleSubmitReport = () => {
    if (!newReport.type || !newReport.title || !newReport.description) {
      alert("Please fill in all required fields");
      return;
    }

    if (!selectedCoordinates) {
      alert("Please select a location on the map first");
      return;
    }

    const report = {
      id: reports.length + 1,
      ...newReport,
      coordinates: selectedCoordinates,
      location: newReport.location || `Location ${selectedCoordinates.lat.toFixed(4)}, ${selectedCoordinates.lng.toFixed(4)}`,
      status: "pending",
      reportedBy: "current_user",
      reportedAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      comments: 0,
    };

    setReports([...reports, report]);
    setNewReport({
      type: "",
      title: "",
      description: "",
      location: "",
      severity: "medium",
    });
    // Keep selectedCoordinates so user can add more reports at the same location
    setShowReportModal(false);
  };

  const getSeverityColor = severity => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case "pending":
        return "text-gray-600 bg-gray-100";
      case "verified":
        return "text-blue-600 bg-blue-100";
      case "in_progress":
        return "text-orange-600 bg-orange-100";
      case "resolved":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoadDangerColor = level => {
    switch (level) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };


  const handleVote = (reportId, voteType) => {
    setReports(
      reports.map(report => {
        if (report.id === reportId) {
          return {
            ...report,
            [voteType]: report[voteType] + 1,
          };
        }
        return report;
      })
    );
  };

  const ReportModal = () =>
    showReportModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Report Safety Issue</h3>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Issue Type</label>
              <select
                value={newReport.type}
                onChange={e => setNewReport({ ...newReport, type: e.target.value })}
                className="w-full p-3 border rounded-lg">
                <option value="">Select issue type...</option>
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={newReport.title}
                onChange={e => setNewReport({ ...newReport, title: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="Brief description of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Detailed Description</label>
              <textarea
                value={newReport.description}
                onChange={e => setNewReport({ ...newReport, description: e.target.value })}
                className="w-full p-3 border rounded-lg h-24 resize-none"
                placeholder="Provide more details about the safety issue..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              {selectedCoordinates ? (
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-green-800 font-medium">📍 Location Selected</div>
                        <div className="text-xs text-green-600 mt-1">
                          Lat: {selectedCoordinates.lat.toFixed(6)}, Lng: {selectedCoordinates.lng.toFixed(6)}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCoordinates(null)}
                        className="text-xs text-red-600 hover:text-red-700 underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={newReport.location}
                    onChange={e => setNewReport({ ...newReport, location: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Optional: Add address or intersection name"
                  />
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm text-yellow-800">⚠️ Please click on the map or existing markers to select a location first</div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Severity Level</label>
              <select
                value={newReport.severity}
                onChange={e => setNewReport({ ...newReport, severity: e.target.value })}
                className="w-full p-3 border rounded-lg">
                <option value="low">Low - Minor inconvenience</option>
                <option value="medium">Medium - Moderate safety concern</option>
                <option value="high">High - Immediate danger</option>
              </select>
            </div>
          </div>

          <div className="p-4 border-t flex space-x-3">
            <button
              onClick={() => setShowReportModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmitReport} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
              Submit Report
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "map" ? "border-red-500 text-red-600" : "border-transparent text-gray-600 hover:text-gray-900"
            }`}>
            <MapPin className="w-4 h-4 inline mr-2" />
            Safety Map
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "reports" ? "border-red-500 text-red-600" : "border-transparent text-gray-600 hover:text-gray-900"
            }`}>
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab("danger")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "danger" ? "border-red-500 text-red-600" : "border-transparent text-gray-600 hover:text-gray-900"
            }`}>
            <Navigation className="w-4 h-4 inline mr-2" />
            Road Analysis
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "map" && <MapView reports={reports} onShowReportModal={() => setShowReportModal(true)} onMapClick={handleMapClick} onMarkerClick={handleMarkerClick} />}
        {activeTab === "reports" && (
          <ReportsView
            groupedReports={groupedReports}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroupExpansion}
            onVote={handleVote}
            onSelectReport={setSelectedReport}
            getSeverityColor={getSeverityColor}
            getStatusColor={getStatusColor}
          />
        )}
        {activeTab === "danger" && (
          <DangerLevelsView roadDangerData={roadDangerData} getSeverityColor={getSeverityColor} getRoadDangerColor={getRoadDangerColor} />
        )}
      </div>

      {/* Report Modal */}
      <ReportModal />

      {/* Stats Footer */}
      <StatsFooter reportsCount={reports.length} />
    </div>
  );
};

export default App;

