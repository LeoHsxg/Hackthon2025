import React from "react";
import { Users, MessageSquare, Heart, TrendingUp } from "lucide-react";

const CommunityView = () => {
  return (
    <div className="h-full p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">社群動態</h3>
        <p className="text-sm text-gray-600">查看社群成員的活動和互動</p>
      </div>

      <div className="space-y-4">
        {/* 社群統計 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">1,234</div>
                <div className="text-sm text-gray-600">活躍用戶</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">567</div>
                <div className="text-sm text-gray-600">今日討論</div>
              </div>
            </div>
          </div>
        </div>

        {/* 熱門話題 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3">熱門話題</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">🚦</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">交通號誌故障</div>
                  <div className="text-sm text-gray-600">西大路路口</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Heart className="w-4 h-4" />
                <span>23</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">🏪</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">非法攤販問題</div>
                  <div className="text-sm text-gray-600">市場區域</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Heart className="w-4 h-4" />
                <span>18</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">🕳️</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">道路坑洞</div>
                  <div className="text-sm text-gray-600">建國路</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Heart className="w-4 h-4" />
                <span>15</span>
              </div>
            </div>
          </div>
        </div>

        {/* 社群貢獻者 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3">本月貢獻者</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">A</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">安全守護者</div>
                  <div className="text-sm text-gray-600">12 個回報</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-yellow-500">
                <TrendingUp className="w-4 h-4" />
                <span>+5</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">B</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">道路觀察員</div>
                  <div className="text-sm text-gray-600">8 個回報</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-yellow-500">
                <TrendingUp className="w-4 h-4" />
                <span>+3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;