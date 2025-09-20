import React, { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle, Clock, Users, Star, Plus, Search, Filter, Navigation, Shield, Eye, MessageSquare } from 'lucide-react';

const RoadSafetyApp = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([
    {
      id: 1,
      type: 'traffic_light',
      title: 'Traffic Light Malfunction',
      description: 'Traffic light stuck on red for over 10 minutes',
      location: 'Main St & 1st Ave',
      coordinates: { lat: 25.0330, lng: 121.5654 },
      severity: 'high',
      status: 'pending',
      reportedBy: 'user123',
      reportedAt: new Date('2024-09-19'),
      upvotes: 12,
      downvotes: 1,
      comments: 3
    },
    {
      id: 2,
      type: 'vendor',
      title: 'Illegal Street Vendors',
      description: 'Multiple vendors blocking entire sidewalk and part of road',
      location: 'Market Street',
      coordinates: { lat: 25.0320, lng: 121.5644 },
      severity: 'medium',
      status: 'verified',
      reportedBy: 'safetywatch',
      reportedAt: new Date('2024-09-18'),
      upvotes: 8,
      downvotes: 0,
      comments: 5
    },
    {
      id: 3,
      type: 'timing',
      title: 'Short Crossing Time',
      description: 'Pedestrian crossing time too short for elderly and disabled',
      location: 'Central Plaza Intersection',
      coordinates: { lat: 25.0340, lng: 121.5634 },
      severity: 'medium',
      status: 'in_progress',
      reportedBy: 'concerned_citizen',
      reportedAt: new Date('2024-09-17'),
      upvotes: 15,
      downvotes: 2,
      comments: 7
    }
  ]);

  const [newReport, setNewReport] = useState({
    type: '',
    title: '',
    description: '',
    location: '',
    severity: 'medium'
  });

  const [roadDangerLevels] = useState({
    'Main St': { level: 'high', incidents: 23, lastUpdate: '2024-09-19' },
    'Market Street': { level: 'medium', incidents: 12, lastUpdate: '2024-09-18' },
    'Central Plaza': { level: 'medium', incidents: 8, lastUpdate: '2024-09-17' },
    'Riverside Ave': { level: 'low', incidents: 3, lastUpdate: '2024-09-16' },
    'Park Boulevard': { level: 'low', incidents: 1, lastUpdate: '2024-09-15' }
  });

  const reportTypes = [
    { id: 'traffic_light', label: 'Traffic Light Issues', icon: '🚦' },
    { id: 'timing', label: 'Signal Timing Problems', icon: '⏱️' },
    { id: 'vendor', label: 'Illegal Vendors/Blocking', icon: '🏪' },
    { id: 'pothole', label: 'Road Damage/Potholes', icon: '🕳️' },
    { id: 'visibility', label: 'Poor Visibility', icon: '👁️' },
    { id: 'construction', label: 'Unsafe Construction', icon: '🚧' },
    { id: 'other', label: 'Other Safety Issues', icon: '⚠️' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'verified': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-orange-600 bg-orange-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoadDangerColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSubmitReport = () => {
    if (!newReport.type || !newReport.title || !newReport.description) return;

    const report = {
      id: reports.length + 1,
      ...newReport,
      location: newReport.location || 'Current Location',
      coordinates: { lat: 25.0330 + Math.random() * 0.01, lng: 121.5654 + Math.random() * 0.01 },
      status: 'pending',
      reportedBy: 'current_user',
      reportedAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      comments: 0
    };

    setReports([report, ...reports]);
    setNewReport({ type: '', title: '', description: '', location: '', severity: 'medium' });
    setShowReportModal(false);
  };

  const handleVote = (reportId, voteType) => {
    setReports(reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          [voteType]: report[voteType] + 1
        };
      }
      return report;
    }));
  };

  const MapView = () => (
    <div className="h-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
        <div className="p-4 h-full flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Safety Map View
            </h3>
            <button 
              onClick={() => setShowReportModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
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
            
            <div className="absolute bottom-4 left-4 text-gray-500 text-sm">
              📍 Interactive Google Maps integration would be loaded here
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReportsView = () => (
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
                <span className="text-2xl">
                  {reportTypes.find(t => t.id === report.type)?.icon || '⚠️'}
                </span>
                <h4 className="font-semibold text-gray-900">{report.title}</h4>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                  {report.severity.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status.replace('_', ' ').toUpperCase()}
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
                <button 
                  onClick={() => handleVote(report.id, 'upvotes')}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                >
                  <span className="text-sm">👍</span>
                  <span className="text-xs">{report.upvotes}</span>
                </button>
                <button 
                  onClick={() => handleVote(report.id, 'downvotes')}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <span className="text-sm">👎</span>
                  <span className="text-xs">{report.downvotes}</span>
                </button>
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-xs">{report.comments}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(report)}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DangerLevelsView = () => (
    <div className="h-full p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Road Danger Assessment</h3>
        <p className="text-sm text-gray-600">Based on community reports and incident frequency</p>
      </div>

      <div className="space-y-3 overflow-y-auto h-96">
        {Object.entries(roadDangerLevels).map(([road, data]) => (
          <div key={road} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900">{road}</h4>
              <div className={`w-3 h-3 rounded-full ${getRoadDangerColor(data.level)}`}></div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Danger Level:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(data.level)}`}>
                {data.level.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Incidents:</span>
              <span className="text-sm font-medium">{data.incidents}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Updated:</span>
              <span className="text-xs text-gray-500">{data.lastUpdate}</span>
            </div>

            {/* Safety score visualization */}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Safety Score</span>
                <span className="text-xs font-medium">
                  {data.level === 'low' ? '85/100' : data.level === 'medium' ? '60/100' : '30/100'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getRoadDangerColor(data.level)}`}
                  style={{
                    width: data.level === 'low' ? '85%' : data.level === 'medium' ? '60%' : '30%'
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReportModal = () => (
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
                onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
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
                onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                className="w-full p-3 border rounded-lg"
                placeholder="Brief description of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Detailed Description</label>
              <textarea
                value={newReport.description}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                className="w-full p-3 border rounded-lg h-24 resize-none"
                placeholder="Provide more details about the safety issue..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={newReport.location}
                onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                className="w-full p-3 border rounded-lg"
                placeholder="Address or intersection (or use current location)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Severity Level</label>
              <select 
                value={newReport.severity}
                onChange={(e) => setNewReport({...newReport, severity: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="low">Low - Minor inconvenience</option>
                <option value="medium">Medium - Moderate safety concern</option>
                <option value="high">High - Immediate danger</option>
              </select>
            </div>
          </div>

          <div className="p-4 border-t flex space-x-3">
            <button 
              onClick={() => setShowReportModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmitReport}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="max-w-4xl mx-auto h-screen bg-gray-50 flex flex-col">
      {/* Header */}
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

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'map' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Safety Map
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'reports' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'danger' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Navigation className="w-4 h-4 inline mr-2" />
            Road Analysis
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'map' && <MapView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'danger' && <DangerLevelsView />}
      </div>

      {/* Report Modal */}
      <ReportModal />

      {/* Stats Footer */}
      <div className="bg-white border-t px-4 py-2">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>🏆 Community Reports: {reports.length}</span>
          <span>🔄 Last Update: {new Date().toLocaleDateString()}</span>
          <span>👥 Active Users: 1,234</span>
        </div>
      </div>
    </div>
  );
};

export default RoadSafetyApp;