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
import ReportModal from "./components/ReportModal";
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
  
  // 用戶系統
  const [currentUser] = useState({
    id: "user_001",
    name: "陳大米",
    totalLikes: 25,
    communityHelps: 8
  });

  const [newReport, setNewReport] = useState({
    type: "",
    title: "",
    description: "",
    location: "",
    severity: "medium",
    photos: [],
  });
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  // Input handlers
  const handleTitleChange = (e) => {
    setNewReport(prev => ({ ...prev, title: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    setNewReport(prev => ({ ...prev, description: e.target.value }));
  };

  const handleLocationChange = (e) => {
    setNewReport(prev => ({ ...prev, location: e.target.value }));
  };

  const handleTypeChange = (e) => {
    setNewReport(prev => ({ ...prev, type: e.target.value }));
  };

  const handleSeverityChange = (e) => {
    setNewReport(prev => ({ ...prev, severity: e.target.value }));
  };

  const [roadDangerData] = useState(roadDangerLevels);

  // 計算用戶統計數據
  const userStats = React.useMemo(() => {
    const userReports = reports.filter(report => report.reportedBy === currentUser.id);
    const resolvedReports = userReports.filter(report => report.status === "resolved");
    
    return {
      totalReports: userReports.length,
      resolvedReports: resolvedReports.length,
      totalLikes: currentUser.totalLikes,
      communityHelps: currentUser.communityHelps
    };
  }, [reports, currentUser]);

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
      reportedBy: currentUser.id,
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
          {activeTab === "profile" && <ProfileView userStats={userStats} currentUser={currentUser} />}
        </div>

      {/* Report Modal */}
      <ReportModal 
        showReportModal={showReportModal}
        newReport={newReport}
        setNewReport={setNewReport}
        selectedCoordinates={selectedCoordinates}
        setSelectedCoordinates={setSelectedCoordinates}
        uploadingPhotos={uploadingPhotos}
        setUploadingPhotos={setUploadingPhotos}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
      />

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

