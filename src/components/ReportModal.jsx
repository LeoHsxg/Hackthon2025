import React from "react";
import { reportTypes } from "../data/reportTypes";

const ReportModal = React.memo(({ 
  showReportModal, 
  newReport, 
  setNewReport, 
  selectedCoordinates, 
  setSelectedCoordinates, 
  uploadingPhotos, 
  setUploadingPhotos, 
  onClose, 
  onSubmit 
}) => {
  if (!showReportModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[95vh] overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">回報安全問題</h3>
        </div>

        <div className="p-4 space-y-4">
          {/* 類型 */}
          <div>
            <label className="block text-sm font-medium mb-2">問題類型</label>
            <select
              value={newReport.type}
              onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">選擇問題類型...</option>
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 標題 */}
          <div>
            <label className="block text-sm font-medium mb-2">標題</label>
            <input
              type="text"
              value={newReport.title}
              onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              placeholder="問題的簡要描述"
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1">
              {newReport.title.length}/200 字元
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium mb-2">詳細描述</label>
            <textarea
              value={newReport.description}
              onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border rounded-lg min-h-32 resize-y"
              placeholder="提供更多關於安全問題的詳細資訊..."
              maxLength={1000}
              rows={4}
            />
            <div className="text-xs text-gray-500 mt-1">
              {newReport.description.length}/1000 字元
            </div>
          </div>

          {/* 位置（永遠渲染輸入框；未選地圖時 disabled） */}
          <div>
            <label className="block text-sm font-medium mb-2">位置</label>

            {selectedCoordinates ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-green-800 font-medium">📍 已選擇位置</div>
                    <div className="text-xs text-green-600 mt-1">
                      Lat: {selectedCoordinates.lat.toFixed(6)}, Lng: {selectedCoordinates.lng.toFixed(6)}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCoordinates(null)}
                    className="text-xs text-red-600 hover:text-red-700 underline"
                    type="button"
                  >
                    清除
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-2">
                <div className="text-sm text-yellow-800">⚠️ 請先點擊地圖或現有標記來選擇位置</div>
              </div>
            )}

            <input
              type="text"
              value={newReport.location}
              onChange={(e) => setNewReport(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              placeholder="選填：新增地址或路口名稱"
              maxLength={150}
              disabled={!selectedCoordinates}
            />
            <div className="text-xs text-gray-500 mt-1">
              {newReport.location.length}/150 字元
            </div>
          </div>

          {/* 嚴重程度 */}
          <div>
            <label className="block text-sm font-medium mb-2">嚴重程度</label>
            <select
              value={newReport.severity}
              onChange={(e) => setNewReport(prev => ({ ...prev, severity: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            >
              <option value="low">低 - 輕微不便</option>
              <option value="medium">中 - 中等安全疑慮</option>
              <option value="high">高 - 立即危險</option>
            </select>
          </div>

          {/* 照片（維持你原本流程） */}
          <div>
            <label className="block text-sm font-medium mb-2">照片 (選填)</label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={e => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;

                  setUploadingPhotos(true);
                  let processedCount = 0;

                  files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const newPhoto = {
                        id: Date.now() + Math.random(),
                        file,
                        preview: event.target.result,
                        base64: event.target.result
                      };
                      setNewReport(prev => ({ ...prev, photos: [...prev.photos, newPhoto] }));
                      processedCount++;
                      if (processedCount === files.length) setUploadingPhotos(false);
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
                        onClick={() =>
                          setNewReport(prev => ({
                            ...prev,
                            photos: prev.photos.filter(p => p.id !== photo.id)
                          }))
                        }
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
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            type="button"
          >
            取消
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            type="button"
          >
            提交回報
          </button>
        </div>
      </div>
    </div>
  );
});

ReportModal.displayName = 'ReportModal';

export default ReportModal;
