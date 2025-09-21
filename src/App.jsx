import React, { useState } from "react";
import { MapPin, AlertTriangle, Clock, Users, Star, Plus, Search, Filter, Navigation, Shield, Eye, MessageSquare, User } from "lucide-react";
import mascotImage from "./assets/墨鏡比v.png";
import Header from "./components/Header";
import StatsFooter from "./components/StatsFooter";
import StatsDashboard from "./components/StatsDashboard";
import MapView from "./components/MapView";
import ReportsView from "./components/ReportsView";
import DangerLevelsView from "./components/DangerLevelsView";
import CommunityView from "./components/CommunityView";
import ProfileView from "./components/ProfileView";
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
    photos: [],
  });
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  // Memoized input handlers to prevent re-renders
  const handleTitleChange = React.useCallback((e) => {
    setNewReport(prev => ({ ...prev, title: e.target.value }));
  }, []);

  const handleDescriptionChange = React.useCallback((e) => {
    setNewReport(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleLocationChange = React.useCallback((e) => {
    setNewReport(prev => ({ ...prev, location: e.target.value }));
  }, []);

  const handleTypeChange = React.useCallback((e) => {
    setNewReport(prev => ({ ...prev, type: e.target.value }));
  }, []);

  const handleSeverityChange = React.useCallback((e) => {
    setNewReport(prev => ({ ...prev, severity: e.target.value }));
  }, []);

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
          severity: "low",
        };
      }
      locationGroups[key].reports.push(report);
      locationGroups[key].count++;

      // 更新最高危險等級
      if (report.severity === "high") {
        locationGroups[key].severity = "high";
      } else if (report.severity === "medium" && locationGroups[key].severity !== "high") {
        locationGroups[key].severity = "medium";
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
        title: `${group.location} 有 ${group.count} 個回報`,
      }));
  }, [reports]);

  const toggleGroupExpansion = groupId => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // 處理地圖點擊事件
  const handleMapClick = coordinates => {
    setSelectedCoordinates(coordinates);
  };

  // 處理標記點擊事件 - 選擇該位置進行報告
  const handleMarkerClick = coordinates => {
    setSelectedCoordinates(coordinates);
  };

  // 處理報告提交
  const handleSubmitReport = React.useCallback(() => {
    if (!newReport.type || !newReport.title || !newReport.description) {
      alert("請填寫所有必填欄位");
      return;
    }

    if (!selectedCoordinates) {
      alert("請先在地圖上選擇位置");
      return;
    }

    const report = {
      id: reports.length + 1,
      ...newReport,
      coordinates: selectedCoordinates,
      location: newReport.location || `位置 ${selectedCoordinates.lat.toFixed(4)}, ${selectedCoordinates.lng.toFixed(4)}`,
      status: "pending",
      reportedBy: "current_user",
      reportedAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      photos: newReport.photos.map(photo => ({
        id: photo.id,
        url: photo.base64, // Using base64 data URL
        filename: photo.file.name
      }))
    };

    setReports([...reports, report]);
    
    setNewReport({
      type: "",
      title: "",
      description: "",
      location: "",
      severity: "medium",
      photos: [],
    });
    // Keep selectedCoordinates so user can add more reports at the same location
    setShowReportModal(false);
  }, [newReport, selectedCoordinates, reports]);

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

  const ReportModal = React.memo(() => {
    if (!showReportModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-lg max-h-[95vh] overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">回報安全問題</h3>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">問題類型</label>
              <select
                value={newReport.type}
                onChange={handleTypeChange}
                className="w-full p-3 border rounded-lg">
                <option value="">選擇問題類型...</option>
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">標題</label>
              <input
                type="text"
                value={newReport.title}
                onChange={handleTitleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="問題的簡要描述"
                maxLength={200}
              />
              <div className="text-xs text-gray-500 mt-1">
                {newReport.title.length}/200 字元
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">詳細描述</label>
              <textarea
                value={newReport.description}
                onChange={handleDescriptionChange}
                className="w-full p-3 border rounded-lg min-h-32 resize-y"
                placeholder="提供更多關於安全問題的詳細資訊..."
                maxLength={1000}
                rows={4}
              />
              <div className="text-xs text-gray-500 mt-1">
                {newReport.description.length}/1000 字元
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">位置</label>
              {selectedCoordinates ? (
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-green-800 font-medium">📍 已選擇位置</div>
                        <div className="text-xs text-green-600 mt-1">
                          Lat: {selectedCoordinates.lat.toFixed(6)}, Lng: {selectedCoordinates.lng.toFixed(6)}
                        </div>
                      </div>
                      <button onClick={() => setSelectedCoordinates(null)} className="text-xs text-red-600 hover:text-red-700 underline">
                        清除
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={newReport.location}
                    onChange={handleLocationChange}
                    className="w-full p-3 border rounded-lg"
                    placeholder="選填：新增地址或路口名稱"
                    maxLength={150}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {newReport.location.length}/150 字元
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm text-yellow-800">⚠️ 請先點擊地圖或現有標記來選擇位置</div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">嚴重程度</label>
              <select
                value={newReport.severity}
                onChange={handleSeverityChange}
                className="w-full p-3 border rounded-lg">
                <option value="low">低 - 輕微不便</option>
                <option value="medium">中 - 中等安全疑慮</option>
                <option value="high">高 - 立即危險</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">照片 (選填)</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    if (files.length === 0) return;
                    
                    setUploadingPhotos(true);
                    let processedCount = 0;
                    
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const newPhoto = {
                          id: Date.now() + Math.random(),
                          file: file,
                          preview: event.target.result,
                          base64: event.target.result
                        };
                        setNewReport(prev => ({ ...prev, photos: [...prev.photos, newPhoto] }));
                        
                        processedCount++;
                        if (processedCount === files.length) {
                          setUploadingPhotos(false);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  className="w-full p-3 border rounded-lg"
                />
                
                {uploadingPhotos && (
                  <div className="text-center py-2">
                    <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      <span>正在處理照片...</span>
                    </div>
                  </div>
                )}
                
                {newReport.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {newReport.photos.map((photo, index) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewReport(prev => ({
                              ...prev,
                              photos: prev.photos.filter(p => p.id !== photo.id)
                            }));
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t flex space-x-3">
            <button
              onClick={() => setShowReportModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              取消
            </button>
            <button onClick={handleSubmitReport} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
              提交回報
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="mx-auto h-screen bg-gray-50 flex flex-col overflow-hidden lg:flex-row">
      {/* Header */}
      {/* <Header /> */}

      {/* Desktop Navigation - Vertical */}
      <div className="hidden lg:flex lg:flex-col lg:h-full">
        <button
          onClick={() => setActiveTab("map")}
          className={`flex flex-col items-center py-4 px-2 text-xs font-medium border-r-2 transition-colors ${
            activeTab === "map" ? "border-red-500 text-red-600 bg-red-50" : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}>
          <MapPin className="w-6 h-6 mb-1" />
          <span className="text-center">安全地圖</span>
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex flex-col items-center py-4 px-2 text-xs font-medium border-r-2 transition-colors ${
            activeTab === "community"
              ? "border-red-500 text-red-600 bg-red-50"
              : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}>
          <Users className="w-6 h-6 mb-1" />
          <span className="text-center">社群回報</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center py-4 px-2 text-xs font-medium border-r-2 transition-colors ${
            activeTab === "profile"
              ? "border-red-500 text-red-600 bg-red-50"
              : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}>
          <User className="w-6 h-6 mb-1" />
          <span className="text-center">個人檔案</span>
        </button>
      </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "map" && (
            <MapView
              reports={reports}
              onShowReportModal={() => setShowReportModal(true)}
              onMapClick={handleMapClick}
              onMarkerClick={handleMarkerClick}
            />
          )}
          {activeTab === "reports" && (
            <ReportsView
              reports={reports}
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
          {activeTab === "community" && <CommunityView />}
          {activeTab === "profile" && <ProfileView />}
        </div>

      {/* Report Modal */}
      <ReportModal />

      {/* Stats Footer */}
      {/* <StatsFooter reportsCount={reports.length} /> */}

      {/* Navigation - Mobile: Bottom, Desktop: Left Side */}
      <div className="bg-white border-b lg:border-b-0 lg:border-r lg:w-20 lg:flex-shrink-0 lg:hidden relative">
        {/* Mascot */}
        <div className="absolute top-0 left-0 pointer-events-none z-10">
          <img
            src={mascotImage}
            alt="吉祥物"
            className="w-20 h-auto"
            style={{
              transformOrigin: "bottom left",
              transform: "translateX(20px) translateY(-120px)",
            }}
          />
        </div>

        {/* Mobile Navigation - Horizontal */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "map" ? "border-red-500 text-red-600" : "border-transparent text-gray-600 hover:text-gray-900"
            }`}>
            <MapPin className="w-4 h-4 inline mr-2" />
            安全地圖
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "community" ? "border-red-500 text-red-600" : "border-transparent text-gray-600 hover:text-gray-900"
            }`}>
            <Users className="w-4 h-4 inline mr-2" />
            社群回報
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "profile" ? "border-red-500 text-red-600" : "border-transparent text-gray-600 hover:text-gray-900"
            }`}>
            <User className="w-4 h-4 inline mr-2" />
            個人檔案
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

