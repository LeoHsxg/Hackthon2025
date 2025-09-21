import React from "react";
import { User, Edit, CheckCircle, Award, Heart, Trophy, ChevronRight } from "lucide-react";

const ProfileView = () => {
  // 模擬用戶數據
  const userData = {
    name: "陳大米",
    totalReports: 47,
    resolvedReports: 17,
    achievements: [
      {
        id: 1,
        title: "積極市民",
        description: "回報超過 10 個問題",
        icon: <Award className="w-6 h-6 text-yellow-500" />,
        completed: true,
        progress: 100
      },
      {
        id: 2,
        title: "貢獻者",
        description: "超過 5 個問題已被解決",
        icon: <Award className="w-6 h-6 text-blue-500" />,
        completed: true,
        progress: 100
      },
      {
        id: 3,
        title: "Community Supporter",
        description: "提供超過 20 個讚",
        icon: <Heart className="w-6 h-6 text-red-500" />,
        completed: true,
        progress: 100
      },
      {
        id: 4,
        title: "冠軍市民",
        description: "回報超過 50 個問題",
        icon: <Trophy className="w-6 h-6 text-purple-500" />,
        completed: false,
        progress: 94
      }
    ]
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header Section */}
      <div className="bg-teal-500 px-6 py-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hello! {userData.name}</h1>
            <p className="text-teal-100 text-sm">個人屬性與資料</p>
          </div>
          <button className="text-white hover:text-teal-100 transition-colors">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="px-6 -mt-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-gray-800">{userData.totalReports}</div>
              <div className="text-sm text-gray-600">回報總數</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-gray-800">{userData.resolvedReports}</div>
              <div className="text-sm text-gray-600">已解決</div>
            </div>
          </div>
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <span>查看所有陳情</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="px-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">成就與徽章</h2>
        <div className="space-y-3">
          {userData.achievements.map((achievement) => (
            <div key={achievement.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {achievement.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800 mb-1">
                        {achievement.progress}%
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default ProfileView;