import React from "react";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

const StatsDashboard = ({ reports }) => {
  // 計算不同狀態的報告數量
  const stats = React.useMemo(() => {
    const pending = reports.filter(report => report.status === "pending").length;
    const verified = reports.filter(report => report.status === "verified").length;
    const completed = reports.filter(report => report.status === "resolved").length;
    
    return { pending, verified, completed };
  }, [reports]);

  return (
    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-3 gap-4">
        {/* 待處理 */}
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</div>
          <div className="text-sm text-gray-600">待處理</div>
        </div>

        {/* 處理中 */}
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.verified}</div>
          <div className="text-sm text-gray-600">處理中</div>
        </div>

        {/* 本周已解決 */}
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.completed}</div>
          <div className="text-sm text-gray-600">已解決</div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
