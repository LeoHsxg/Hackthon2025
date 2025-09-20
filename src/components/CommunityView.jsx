import React, { useState } from "react";
import { Users, MessageSquare, Star, TrendingUp, Award, Heart, Filter, Search } from "lucide-react";

const CommunityView = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const mockUsers = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Safety Advocate",
      avatar: "SC",
      reports: 23,
      upvotes: 156,
      joined: "2 months ago",
      badge: "verified",
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      role: "Community Helper",
      avatar: "MR",
      reports: 18,
      upvotes: 89,
      joined: "1 month ago",
      badge: "contributor",
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Safety Expert",
      avatar: "EW",
      reports: 31,
      upvotes: 234,
      joined: "4 months ago",
      badge: "expert",
    },
    {
      id: 4,
      name: "David Kim",
      role: "New Member",
      avatar: "DK",
      reports: 5,
      upvotes: 23,
      joined: "2 weeks ago",
      badge: "newbie",
    },
  ];

  const mockDiscussions = [
    {
      id: 1,
      title: "Best practices for reporting road hazards",
      author: "Sarah Chen",
      replies: 12,
      likes: 28,
      time: "2 hours ago",
      category: "Safety Tips",
    },
    {
      id: 2,
      title: "New dangerous intersection on Main St",
      author: "Mike Rodriguez",
      replies: 8,
      likes: 15,
      time: "4 hours ago",
      category: "Report Discussion",
    },
    {
      id: 3,
      title: "Community cleanup event this weekend",
      author: "Emma Wilson",
      replies: 24,
      likes: 45,
      time: "1 day ago",
      category: "Events",
    },
  ];

  const getBadgeColor = badge => {
    switch (badge) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "expert":
        return "bg-purple-100 text-purple-800";
      case "contributor":
        return "bg-blue-100 text-blue-800";
      case "newbie":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-3 text-red-500" />
            Community
          </h1>
          <p className="text-gray-600 mt-1">Connect with fellow safety advocates</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">89</div>
            <div className="text-sm text-gray-600">Discussions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">2,156</div>
            <div className="text-sm text-gray-600">Reports This Month</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">45</div>
            <div className="text-sm text-gray-600">Verified Reports</div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Top Contributors
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center font-semibold text-red-600">{user.avatar}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(user.badge)}`}>{user.badge}</span>
                      </div>
                      <p className="text-sm text-gray-600">{user.role}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>{user.reports} reports</span>
                        <span>{user.upvotes} upvotes</span>
                        <span>Joined {user.joined}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Discussions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
              Recent Discussions
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockDiscussions.map(discussion => (
                <div key={discussion.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <h4 className="font-semibold text-gray-900 mb-2 hover:text-red-600 cursor-pointer">{discussion.title}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>by {discussion.author}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">{discussion.category}</span>
                      <span>{discussion.time}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {discussion.replies}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {discussion.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-blue-600 text-lg font-medium mb-2">🚧 Coming Soon</div>
          <p className="text-blue-700">More community features are being developed by the team. Stay tuned for updates!</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
