import React from "react";
import { User, MapPin, Award, Settings, LogOut } from "lucide-react";

const ProfileView = () => {
  return (
    <div className="h-full p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">個人檔案</h3>
        <p className="text-sm text-gray-600">管理您的個人資訊和設定</p>
      </div>

      <div className="space-y-6">
        {/* 用戶資訊 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">安全守護者</h4>
              <p className="text-sm text-gray-600">社群成員</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-sm text-gray-600">總回報數</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">18</div>
              <div className="text-sm text-gray-600">已解決</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-600">獲得讚數</div>
            </div>
          </div>
        </div>

        {/* 成就徽章 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            成就徽章
          </h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">🥇</span>
              </div>
              <div className="text-xs text-gray-600">首次回報</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">🎯</span>
              </div>
              <div className="text-xs text-gray-600">精準定位</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">🏆</span>
              </div>
              <div className="text-xs text-gray-600">社群貢獻者</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">⭐</span>
              </div>
              <div className="text-xs text-gray-600">活躍用戶</div>
            </div>
          </div>
        </div>

        {/* 最近活動 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-red-500" />
            最近活動
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🚦</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">回報交通號誌故障</div>
                <div className="text-xs text-gray-600">2 小時前</div>
              </div>
              <div className="text-xs text-green-600">已解決</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🏪</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">回報非法攤販</div>
                <div className="text-xs text-gray-600">1 天前</div>
              </div>
              <div className="text-xs text-yellow-600">處理中</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🕳️</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">回報道路坑洞</div>
                <div className="text-xs text-gray-600">3 天前</div>
              </div>
              <div className="text-xs text-green-600">已解決</div>
            </div>
          </div>
        </div>

        {/* 設定選項 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-500" />
            設定
          </h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-sm text-gray-700">通知設定</span>
              <span className="text-xs text-gray-500">></span>
            </button>
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-sm text-gray-700">隱私設定</span>
              <span className="text-xs text-gray-500">></span>
            </button>
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-sm text-gray-700">語言設定</span>
              <span className="text-xs text-gray-500">></span>
            </button>
            <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600">
              <span className="text-sm flex items-center">
                <LogOut className="w-4 h-4 mr-2" />
                登出
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;