import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin, AlertTriangle, Clock, Users, Plus, X, MessageSquare, Crosshair } from "lucide-react";

// 自定義圖標組件 - 可以切換使用 PNG 圖片或 CSS 繪製的圖案
const CustomIcon = ({ className = "w-4 h-4", isSpinning = false, useCustomImage = false }) => {
  if (useCustomImage) {
    // 使用自定義 PNG 圖片
    return (
      <img
        src="/your-custom-icon.png" // 將您的 PNG 圖片放在 public 資料夾中
        alt="Custom Icon"
        className={`${className} ${isSpinning ? "animate-spin" : ""}`}
        style={{ objectFit: "contain" }}
      />
    );
  }

  // 使用 CSS 繪製的貢丸圖案（備用方案）
  return (
    <div className={`relative ${className}`}>
      <div
        className={`w-full h-full rounded-full bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-800 shadow-sm ${
          isSpinning ? "animate-spin" : ""
        }`}>
        {/* 貢丸的紋理線條 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2/3 h-0.5 bg-amber-800 rounded-full opacity-70"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rotate-90">
          <div className="w-2/3 h-0.5 bg-amber-800 rounded-full opacity-70"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rotate-45">
          <div className="w-1/2 h-0.5 bg-amber-800 rounded-full opacity-50"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center -rotate-45">
          <div className="w-1/2 h-0.5 bg-amber-800 rounded-full opacity-50"></div>
        </div>
        {/* 貢丸中心的小點 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-amber-900 rounded-full"></div>
        {/* 高光效果 */}
        <div className="absolute top-1 left-1 w-1 h-1 bg-amber-300 rounded-full opacity-80"></div>
      </div>
    </div>
  );
};
import { initialReports } from "../data/reports";
import { reportTypes } from "../data/reportTypes";

const MapView = ({ onShowReportModal, onMapClick, onMarkerClick, reports = initialReports }) => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [popupMarker, setPopupMarker] = useState(null);

  // GPS 定位相關狀態
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [hasAutoLocated, setHasAutoLocated] = useState(false);

  // 道路驗證相關狀態
  const [isValidatingLocation, setIsValidatingLocation] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // 地圖引用
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  // Google Maps API 配置
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyArfTXU_iFH_PvWzXXpqP9jvuQw84Co4e4",
    language: "zh-TW",
    region: "TW",
  });

  // 地圖中心點（優先使用用戶位置，否則使用新竹市）
  const center = useMemo(() => {
    if (userLocation) {
      return userLocation;
    }
    // 預設中心點（新竹市）
    return {
      lat: 24.8066,
      lng: 120.9686,
    };
  }, [userLocation]);

  // 地圖選項
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      scrollwheel: true,
      mapTypeControl: true,
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
          severity: "low", // 預設為低危險
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
        title: `${group.location} 有 ${group.count} 個回報`,
      }));
  }, [reports]);

  // 根據報告數量確定顏色
  const getColorByCount = count => {
    if (count >= 5) return "#ef4444"; // 紅色 - 5+ 個回報
    if (count >= 3) return "#eab308"; // 黃色 - 3-4 個回報
    if (count >= 1) return "#22c55e"; // 綠色 - 1-2 個回報
    return "#6b7280"; // 灰色 - 無回報
  };

  // 創建帶數字的自定義標記圖標
  const getMarkerIcon = count => {
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
      size: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(28, 28),
    };
  };

  const onLoad = useCallback(map => {
    mapRef.current = map;
  }, []);

  // 使用 Google Roads API 驗證點擊位置是否在道路上
  const validateLocationOnRoad = useCallback(async (lat, lng) => {
    try {
      // 使用 Google Roads API 的 Snap to Roads 功能
      const response = await fetch(
        `https://roads.googleapis.com/v1/snapToRoads?path=${lat},${lng}&interpolate=true&key=AIzaSyArfTXU_iFH_PvWzXXpqP9jvuQw84Co4e4`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 如果 Roads API 返回了 snappedPoints，表示位置在道路上
      if (data.snappedPoints && data.snappedPoints.length > 0) {
        const snappedPoint = data.snappedPoints[0];

        // 計算與原始位置的距離
        const distance = calculateDistance(lat, lng, snappedPoint.location.latitude, snappedPoint.location.longitude);

        // 如果距離在合理範圍內（50米），認為是有效道路
        if (distance <= 50) {
          // 獲取地址信息
          if (!geocoderRef.current) {
            geocoderRef.current = new window.google.maps.Geocoder();
          }

          const geocodeResult = await geocoderRef.current.geocode({
            location: { lat: snappedPoint.location.latitude, lng: snappedPoint.location.longitude },
          });

          const address =
            geocodeResult.results && geocodeResult.results.length > 0
              ? geocodeResult.results[0].formatted_address
              : `${snappedPoint.location.latitude}, ${snappedPoint.location.longitude}`;

          return {
            isValid: true,
            address: address,
            snappedLocation: {
              lat: snappedPoint.location.latitude,
              lng: snappedPoint.location.longitude,
            },
            distance: distance,
          };
        }
      }

      return {
        isValid: false,
        reason: "不在道路範圍內",
        address: `${lat}, ${lng}`,
      };
    } catch (error) {
      console.error("Roads API 驗證錯誤:", error);

      // 如果 Roads API 失敗，回退到地理編碼驗證
      return await fallbackGeocodeValidation(lat, lng);
    }
  }, []);

  // 備用驗證方法（地理編碼）
  const fallbackGeocodeValidation = useCallback(async (lat, lng) => {
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    try {
      const result = await geocoderRef.current.geocode({
        location: { lat, lng },
      });

      if (result.results && result.results.length > 0) {
        const types = result.results[0].types || [];

        // 檢查是否為明顯的建築物或設施
        const buildingTypes = ["premise", "subpremise", "establishment"];
        const isBuilding = types.some(type => buildingTypes.includes(type));

        // 如果不在建築物內，允許回報
        if (!isBuilding) {
          return {
            isValid: true,
            address: result.results[0].formatted_address,
          };
        } else {
          return {
            isValid: false,
            reason: "建築物區域",
            address: result.results[0].formatted_address,
          };
        }
      }

      return { isValid: false, reason: "無法識別位置類型" };
    } catch (error) {
      console.error("備用驗證錯誤:", error);
      return { isValid: false, reason: "驗證失敗" };
    }
  }, []);

  // 計算兩點間距離（米）
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // 地球半徑（米）
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 距離（米）
  };

  // GPS 定位功能（通用）
  const performLocation = useCallback(
    (isAutoLocation = false) => {
      if (!navigator.geolocation) {
        if (!isAutoLocation) {
          setLocationError("此瀏覽器未支援定位功能。請使用現代瀏覽器（如 Chrome、Firefox、Safari）。");
        }
        return;
      }

      setIsLocating(true);
      if (!isAutoLocation) {
        setLocationError(null);
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const loc = { lat: latitude, lng: longitude };

          setUserLocation(loc);
          setClickedLocation(loc);
          setSelectedMarkerId(null);
          setPopupMarker(null);
          setIsLocating(false);
          setLocationError(null);

          // 如果是手動定位，才移動地圖（自動定位時地圖已經以用戶位置為中心）
          if (!isAutoLocation && mapRef.current) {
            mapRef.current.panTo(loc);
            mapRef.current.setZoom(17);
          }

          // 通知父組件
          if (onMapClick) {
            onMapClick(loc);
          }
        },
        error => {
          console.error("定位錯誤:", error);
          setIsLocating(false);

          // 自動定位失敗時不顯示錯誤訊息，手動定位時才顯示
          if (!isAutoLocation) {
            let errorMessage = "定位失敗。";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "定位權限被拒絕。請在瀏覽器設定中允許此網站存取您的位置。";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "無法取得位置資訊。請確認：1) GPS 功能已開啟 2) 您在室外環境 3) 網路連線正常";
                break;
              case error.TIMEOUT:
                errorMessage = "定位超時。請確認您在室外環境，並有良好的網路連線。";
                break;
              default:
                errorMessage = "定位失敗，請稍後再試。";
            }

            setLocationError(errorMessage);
          } else {
            // 自動定位失敗時，地圖會使用預設的台北市位置
            console.log("自動定位失敗，使用預設位置");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: isAutoLocation ? 10000 : 15000, // 自動定位超時時間較短
          maximumAge: 300000, // 5分鐘快取
        }
      );
    },
    [onMapClick]
  );

  // 手動定位按鈕觸發
  const handleLocateMe = useCallback(() => {
    performLocation(false);
  }, [performLocation]);

  // 頁面載入時立即開始定位
  useEffect(() => {
    // 組件載入時立即開始定位，不等待地圖載入
    if (!hasAutoLocated) {
      setHasAutoLocated(true);
      performLocation(true);
    }
  }, [hasAutoLocated, performLocation]);

  // 處理地圖點擊事件
  const handleMapClick = useCallback(
    async event => {
      // 檢查是否點擊在標記上，如果是則不處理地圖點擊
      if (event.placeId) {
        return;
      }

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const coordinates = { lat, lng };

      // 清除之前的驗證錯誤
      setValidationError(null);
      setIsValidatingLocation(true);

      // 使用 Roads API 驗證點擊位置是否在道路上
      const validation = await validateLocationOnRoad(lat, lng);
      setIsValidatingLocation(false);

      if (validation.isValid) {
        // 位置有效，設置點擊位置
        const finalCoordinates = validation.snappedLocation || coordinates;
        setClickedLocation(finalCoordinates);
        setSelectedMarkerId(null);
        setPopupMarker(null);

        // 通知父組件地圖被點擊
        if (onMapClick) {
          onMapClick(finalCoordinates);
        }
      } else {
        // 位置無效，顯示錯誤訊息
        setValidationError({
          message: `無法在此位置回報：${validation.reason}`,
          address: validation.address,
          coordinates: coordinates,
        });
      }
    },
    [onMapClick, validateLocationOnRoad]
  );

  if (!isLoaded) {
    return (
      <div className="h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
          <div className="p-4 h-full flex flex-col">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                安全地圖檢視
              </h3>
              <button
                onClick={onShowReportModal}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                回報問題
              </button>
            </div>
            <div className="flex-1 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-500 mb-2">載入地圖中...</div>
                {isLocating && (
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <CustomIcon className="w-4 h-4" isSpinning={true} useCustomImage={true} />
                    <span className="text-sm">正在定位您的位置...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <button
        onClick={onShowReportModal}
        className="absolute bottom-16 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors z-20">
        <Plus className="w-4 h-4 mr-2" />
        回報問題
      </button>

      {/* GPS 定位按鈕 */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        className={`absolute bottom-4 right-4 border border-gray-200 text-gray-800 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors z-20 ${
          isLocating ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:bg-gray-50"
        }`}>
        <CustomIcon className="w-4 h-4" isSpinning={isLocating} useCustomImage={true} />
        {isLocating ? "定位中..." : "定位我"}
      </button>

      {/* 自動定位提示 */}
      {isLocating && !hasAutoLocated && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md z-20">
          <div className="flex items-center gap-2">
            <CustomIcon className="w-4 h-4" isSpinning={true} useCustomImage={true} />
            <span className="text-sm">正在定位您的位置...</span>
          </div>
        </div>
      )}

      {/* 位置驗證中提示 */}
      {isValidatingLocation && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-2 rounded-lg shadow-md z-20">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">正在驗證道路位置...</span>
          </div>
        </div>
      )}

      {/* 位置驗證失敗提示 */}
      {validationError && (
        <div className="absolute top-2 left-2 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-md max-w-sm z-20">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">位置無效</div>
              <div className="text-xs leading-relaxed mb-2">{validationError.message}</div>
              {validationError.address && <div className="text-xs opacity-90 mb-2">地址：{validationError.address}</div>}
              <div className="text-xs opacity-75">請點擊道路區域進行回報</div>
            </div>
            <button onClick={() => setValidationError(null)} className="flex-shrink-0 text-white hover:text-gray-200">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 定位錯誤提示 */}
      {locationError && (
        <div className="absolute bottom-16 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-md max-w-sm z-20">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0">
              <X className="w-4 h-4 mt-0.5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">定位失敗</div>
              <div className="text-xs leading-relaxed">{locationError}</div>
            </div>
            <button onClick={() => setLocationError(null)} className="flex-shrink-0 text-red-600 hover:text-red-800">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Google Maps */}
      <div className="flex-1 rounded-lg relative h-full" style={{ zIndex: 0 }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={16}
          onLoad={onLoad}
          options={mapOptions}
          onClick={handleMapClick}>
          {/* 地圖標記點 */}
          {markers.map(marker => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.title}
              icon={getMarkerIcon(marker.count)}
              onClick={event => {
                // 阻止事件冒泡到地圖
                event.stop();
                console.log(`點擊了標記: ${marker.title}`, marker.reports);

                // 顯示彈出窗口
                setPopupMarker(marker);

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
              title="所選位置"
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="12" fill="#3b82f6" stroke="#ffffff" stroke-width="3"/>
                        <circle cx="15" cy="15" r="6" fill="#ffffff"/>
                      </svg>
                    `)}`,
                scaledSize: new window.google.maps.Size(30, 30),
                anchor: new window.google.maps.Point(15, 15),
              }}
            />
          )}

          {/* 用戶位置標記 - 自定義 PNG 圖片 */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="我的位置"
              icon={{
                // 方法 1: 使用 public 資料夾中的圖片
                url: "/your-custom-icon.png", // 將 your-custom-icon.png 放在 public 資料夾中

                // 方法 2: 使用 base64 編碼的圖片（如果您想直接嵌入）
                // url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...", // 您的 base64 編碼

                // 方法 3: 使用外部 URL
                // url: "https://example.com/your-icon.png",

                scaledSize: new window.google.maps.Size(32, 32), // 調整圖片大小
                anchor: new window.google.maps.Point(16, 16), // 調整錨點位置
              }}
            />
          )}

          {/* 無效位置標記 */}
          {validationError && (
            <Marker
              position={validationError.coordinates}
              title="無效位置"
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="3"/>
                    <path d="M10 10 L20 20 M20 10 L10 20" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                `)}`,
                scaledSize: new window.google.maps.Size(30, 30),
                anchor: new window.google.maps.Point(15, 15),
              }}
            />
          )}
        </GoogleMap>

        {/* 報告彈出窗口 */}
        {popupMarker && (
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 bg-white rounded-lg shadow-xl border max-h-[30rem] overflow-y-auto z-10">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{popupMarker.location}</h3>
                  <p className="text-sm text-gray-600">{popupMarker.count} 回報</p>
                </div>
                <button onClick={() => setPopupMarker(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {popupMarker.reports.map((report, index) => (
                <div key={report.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">{reportTypes.find(t => t.id === report.type)?.icon || "⚠️"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{report.title}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.severity === "high"
                              ? "bg-red-100 text-red-800"
                              : report.severity === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                          {report.severity === "high" ? "高度危險" : report.severity === "medium" ? "中度危險" : "低度危險"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>

                      {/* Photos in popup */}
                      {report.photos && report.photos.length > 0 && (
                        <div className="mb-2">
                          <div className="flex space-x-1 overflow-x-auto">
                            {report.photos.map((photo, photoIndex) => (
                              <img
                                key={photo.id}
                                src={photo.url}
                                alt={`Report photo ${photoIndex + 1}`}
                                className="w-16 h-16 object-cover rounded border flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(photo.url, "_blank")}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span>👍 {report.upvotes}</span>
                          <span>👎 {report.downvotes}</span>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{report.comments}</span>
                          </div>
                        </div>
                        <span>{new Date(report.reportedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 點擊位置信息 */}
        {clickedLocation && (
          <div className="absolute top-16 left-2 bg-blue-500 text-white rounded-lg shadow-lg p-3 pointer-events-none">
            <div className="text-xs font-semibold mb-1">{selectedMarkerId ? "📍 已選擇標記" : "📍 已選擇位置"}</div>
            <div className="text-xs">
              <div>Lat: {clickedLocation.lat.toFixed(6)}</div>
              <div>Lng: {clickedLocation.lng.toFixed(6)}</div>
            </div>
          </div>
        )}

        {/* 報告數量圖例 */}
        <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg p-3 pointer-events-none">
          <div className="text-xs text-gray-600 mb-2 font-semibold">回報數量</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">5+</span>
              </div>
              <span className="text-xs">5+ 個回報</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <span className="text-xs">3-4 個回報</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-xs">1-2 個回報</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
