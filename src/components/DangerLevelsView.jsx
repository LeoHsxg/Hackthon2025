import React from "react";

const DangerLevelsView = ({ roadDangerData, getSeverityColor, getRoadDangerColor }) => {
  return (
    <div className="h-full p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">道路危險評估</h3>
        <p className="text-sm text-gray-600">基於社群回報和事件頻率</p>
      </div>

      <div className="space-y-3 overflow-y-auto h-[calc(100%-50px)]">
        {Object.entries(roadDangerData).map(([road, data]) => (
          <div key={road} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900">{road}</h4>
              <div className={`w-3 h-3 rounded-full ${getRoadDangerColor(data.level)}`}></div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">危險等級：</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(data.level)}`}>{data.level.toUpperCase()}</span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">總事件數：</span>
              <span className="text-sm font-medium">{data.incidents}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">最後更新：</span>
              <span className="text-xs text-gray-500">{data.lastUpdate}</span>
            </div>

            {/* Safety score visualization */}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">安全分數</span>
                <span className="text-xs font-medium">{data.level === "low" ? "85/100" : data.level === "medium" ? "60/100" : "30/100"}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getRoadDangerColor(data.level)}`}
                  style={{
                    width: data.level === "low" ? "85%" : data.level === "medium" ? "60%" : "30%",
                  }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DangerLevelsView;
