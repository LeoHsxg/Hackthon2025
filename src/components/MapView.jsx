import React, { useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin, AlertTriangle, Clock, Users, Plus } from "lucide-react";

const MapView = ({ onShowReportModal }) => {
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

  // 標記點數據
  const markers = [
    {
      id: 1,
      position: { lat: 24.800562, lng: 120.966711 },
      type: "high",
      title: "西大 - 林森路口",
      icon: "🔧",
    },
    {
      id: 2,
      position: { lat: 24.801772, lng: 120.965742 },
      type: "medium",
      title: "西大 - 文昌街口",
      icon: "⏰",
    },
    {
      id: 3,
      position: { lat: 24.802561, lng: 120.965179 },
      type: "medium",
      title: "西大 - 西門路口",
      icon: "👥",
    },
  ];

  // 自定義標記圖標
  const getMarkerIcon = type => {
    const colors = {
      high: "#ef4444", // red-500
      medium: "#eab308", // yellow-500
      low: "#22c55e", // green-500
    };

    return {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: colors[type],
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 1.5,
      anchor: new window.google.maps.Point(12, 24), // 設定錨點為圖標底部中心
    };
  };

  const onLoad = useCallback(() => {
    // 地圖載入完成後的處理
  }, []);

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
            <button
              onClick={onShowReportModal}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Report Issue
            </button>
          </div>

          {/* Google Maps */}
          <div className="flex-1 rounded-lg relative" style={{ zIndex: 0 }}>
            <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={center} zoom={16} onLoad={onLoad} options={mapOptions}>
              {/* 地圖標記點 */}
              {markers.map(marker => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  title={marker.title}
                  icon={getMarkerIcon(marker.type)}
                  onClick={() => {
                    console.log(`點擊了標記: ${marker.title}`);
                  }}
                />
              ))}
            </GoogleMap>

            {/* 危險等級圖例 - 移到地圖容器外 */}
            <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg p-2 pointer-events-none">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
