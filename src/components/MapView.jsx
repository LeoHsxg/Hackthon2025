import React, { useCallback, useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin, AlertTriangle, Clock, Users, Plus } from "lucide-react";
import { initialReports } from "../data/reports";

const MapView = ({ onShowReportModal, onMapClick, onMarkerClick, reports = initialReports }) => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  // Google Maps API 配置
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyArfTXU_iFH_PvWzXXpqP9jvuQw84Co4e4",
  });

  // 地圖中心點（台北市）
  const center = useMemo(
    () => ({
      lat: 24.8004,
      lng: 120.966,
    }),
    []
  );

  // 地圖選項
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    []
  );

  // 根據報告數據生成標記點
  const markers = useMemo(() => {
    // 將報告按位置分組 - 使用更精確的分組
    const locationGroups = {};
    
    reports.forEach(report => {
      // 使用5位小數進行更精確的分組 (約11米精度)
      const key = `${report.coordinates.lat.toFixed(5)},${report.coordinates.lng.toFixed(5)}`;
      if (!locationGroups[key]) {
        locationGroups[key] = {
          position: report.coordinates,
          reports: [],
          count: 0,
          location: report.location,
          severity: 'low' // 預設為低危險
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

    // 轉換為標記點數組，按報告數量排序
    return Object.values(locationGroups)
      .sort((a, b) => b.count - a.count) // 按報告數量降序排列
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

  // 根據報告數量確定顏色
  const getColorByCount = (count) => {
    if (count >= 5) return "#ef4444"; // red - 5+ reports
    if (count >= 3) return "#eab308"; // yellow - 3-4 reports  
    if (count >= 1) return "#22c55e"; // green - 1-2 reports
    return "#6b7280"; // gray - no reports
  };

  // 創建帶數字的自定義標記圖標
  const getMarkerIcon = (count) => {
    const color = getColorByCount(count);
    
    // 創建 SVG 圖標
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="${color}" stroke="#ffffff" stroke-width="3"/>
        <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${count}</text>
      </svg>
    `;
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20)
    };
  };

  const onLoad = useCallback(() => {
    // 地圖載入完成後的處理
  }, []);

  // 處理地圖點擊事件
  const handleMapClick = useCallback((event) => {
    // 檢查是否點擊在標記上，如果是則不處理地圖點擊
    if (event.placeId) {
      return;
    }
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const coordinates = { lat, lng };
    
    setClickedLocation(coordinates);
    setSelectedMarkerId(null); // 清除選中的標記
    
    // 通知父組件地圖被點擊
    if (onMapClick) {
      onMapClick(coordinates);
    }
  }, [onMapClick]);

  if (!isLoaded) {
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
            <div className="flex-1 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-gray-500">載入地圖中...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
        <div className="p-4 h-full flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Safety Map View
            </h3>
            <div className="flex flex-col items-end space-y-2">
              <button
                onClick={onShowReportModal}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Report Issue
              </button>
              <div className="text-xs text-gray-500 text-right">
                Click on map or existing markers<br/>to select location
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="flex-1 rounded-lg relative" style={{ zIndex: 0 }}>
            <GoogleMap 
              mapContainerStyle={{ width: "100%", height: "100%" }} 
              center={center} 
              zoom={16} 
              onLoad={onLoad} 
              options={mapOptions}
              onClick={handleMapClick}
            >
              {/* 地圖標記點 */}
              {markers.map(marker => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  title={marker.title}
                  icon={getMarkerIcon(marker.count)}
                  onClick={(event) => {
                    // 阻止事件冒泡到地圖
                    event.stop();
                    console.log(`點擊了標記: ${marker.title}`, marker.reports);
                    
                    // 更新本地狀態
                    setClickedLocation(marker.position);
                    setSelectedMarkerId(marker.id);
                    
                    // 選擇該位置進行報告
                    if (onMarkerClick) {
                      onMarkerClick(marker.position);
                    }
                  }}
                />
              ))}
              
              {/* 點擊位置標記 */}
              {clickedLocation && (
                <Marker
                  position={clickedLocation}
                  title="Selected Location"
                  icon={{
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="12" fill="#3b82f6" stroke="#ffffff" stroke-width="3"/>
                        <circle cx="15" cy="15" r="6" fill="#ffffff"/>
                      </svg>
                    `)}`,
                    scaledSize: new window.google.maps.Size(30, 30),
                    anchor: new window.google.maps.Point(15, 15)
                  }}
                />
              )}
            </GoogleMap>

            {/* 點擊位置信息 */}
            {clickedLocation && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-lg shadow-lg p-3 pointer-events-none">
                <div className="text-xs font-semibold mb-1">
                  {selectedMarkerId ? "📍 Marker Selected" : "📍 Location Selected"}
                </div>
                <div className="text-xs">
                  <div>Lat: {clickedLocation.lat.toFixed(6)}</div>
                  <div>Lng: {clickedLocation.lng.toFixed(6)}</div>
                </div>
              </div>
            )}

            {/* 報告數量圖例 */}
            <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg p-3 pointer-events-none">
              <div className="text-xs text-gray-600 mb-2 font-semibold">Reports Count</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">5+</span>
                  </div>
                  <span className="text-xs">5+ Reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <span className="text-xs">3-4 Reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <span className="text-xs">1-2 Reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
