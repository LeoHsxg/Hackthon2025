import React from "react";
import { User, Settings, Bell, Shield, Star, MessageSquare } from "lucide-react";

const ProfileView = () => {
  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="w-6 h-6 mr-3 text-red-500" />
            Profile
          </h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
              <p className="text-gray-600">Safety Community Member</p>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">Trusted Contributor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-red-500">12</div>
            <div className="text-sm text-gray-600">Reports Submitted</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-green-500">48</div>
            <div className="text-sm text-gray-600">Upvotes Received</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">5</div>
            <div className="text-sm text-gray-600">Comments Made</div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-500" />
              Settings
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">Push Notifications</span>
                </div>
                <div className="w-12 h-6 bg-red-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">Privacy Mode</span>
                </div>
                <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">Email Updates</span>
                </div>
                <div className="w-12 h-6 bg-red-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-blue-600 text-lg font-medium mb-2">🚧 Coming Soon</div>
          <p className="text-blue-700">More profile features are being developed by the team. Stay tuned for updates!</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
