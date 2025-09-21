export const initialReports = [
  // 位置 1: 5 個回報 (紅色標記) - 新竹火車站前圓環
  {
    id: 1,
    type: "traffic_light",
    title: "交通號誌故障",
    description: "火車站前圓環交通號誌卡在紅燈超過 10 分鐘",
    location: "中正路 & 中華路口",
    coordinates: { lat: 24.8066, lng: 120.9686 },
    severity: "high",
    status: "pending",
    reportedBy: "user_001",
    reportedAt: new Date("2024-09-19"),
    upvotes: 12,
    downvotes: 1,
    comments: 3,
    photos: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_light_broken.jpg"
      }
    ],
  },
  {
    id: 2,
    type: "vendor",
    title: "非法攤販",
    description: "火車站前多個攤販阻擋整個人行道和部分道路",
    location: "中正路 & 中華路口",
    coordinates: { lat: 24.8066, lng: 120.9686 },
    severity: "medium",
    status: "verified",
    reportedBy: "user_001",
    reportedAt: new Date("2024-09-18"),
    upvotes: 8,
    downvotes: 0,
    comments: 5,
    photos: [
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_vendors.jpg"
      }
    ],
  },
  {
    id: 3,
    type: "timing",
    title: "行人通行時間過短",
    description: "火車站前綠燈時間只有 15 秒，老人無法安全通過",
    location: "中正路 & 中華路口",
    coordinates: { lat: 24.8066, lng: 120.9686 },
    severity: "medium",
    status: "verified",
    reportedBy: "user_001",
    reportedAt: new Date("2024-09-17"),
    upvotes: 15,
    downvotes: 2,
    comments: 8,
    photos: [
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_crossing.jpg"
      }
    ],
  },
  {
    id: 4,
    type: "pothole",
    title: "大型坑洞",
    description: "火車站前道路中央有直徑約 1 公尺的深坑",
    location: "中正路 & 中華路口",
    coordinates: { lat: 24.8066, lng: 120.9686 },
    severity: "high",
    status: "resolved",
    reportedBy: "user_001",
    reportedAt: new Date("2024-09-16"),
    upvotes: 20,
    downvotes: 1,
    comments: 12,
    photos: [
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        filename: "traffic_pothole.jpg"
      }
    ],
  },
  {
    id: 5,
    type: "signage",
    title: "停車標誌遺失",
    description: "停車標誌被車輛撞倒",
    location: "西大路 & 林森路口",
    coordinates: { lat: 24.800574, lng: 120.9667005 },
    severity: "high",
    status: "resolved",
    reportedBy: "user_001",
    reportedAt: new Date("2024-09-15"),
    upvotes: 5,
    downvotes: 0,
    comments: 2,
    photos: [
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_signage.jpg"
      }
    ],
  },

  // 位置 2: 3 個回報 (黃色標記) - 清華大學附近
  {
    id: 6,
    type: "crossing",
    title: "斑馬線褪色",
    description: "清大門口的斑馬線幾乎看不見",
    location: "光復路 & 大學路口",
    coordinates: { lat: 24.8076, lng: 120.9696 },
    severity: "medium",
    status: "resolved",
    reportedBy: "user_001",
    reportedAt: new Date("2024-09-19"),
    upvotes: 18,
    downvotes: 2,
    comments: 6,
    photos: [
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_crosswalk.jpg"
      }
    ],
  },
  {
    id: 7,
    type: "parking",
    title: "違規停車",
    description: "清大附近車輛停在人行道上，阻擋學生通行",
    location: "光復路 & 大學路口",
    coordinates: { lat: 24.8076, lng: 120.9696 },
    severity: "medium",
    status: "verified",
    reportedBy: "user_001",
    reportedAt: new Date("2024-09-18"),
    upvotes: 14,
    downvotes: 1,
    comments: 3,
    photos: [
      {
        id: 7,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_parking.jpg"
      }
    ],
  },
  {
    id: 8,
    type: "lighting",
    title: "路燈故障",
    description: "清大附近夜間路燈不亮，學生放學很危險",
    location: "光復路 & 大學路口",
    coordinates: { lat: 24.8076, lng: 120.9696 },
    severity: "high",
    status: "resolved",
    reportedBy: "user_001",
    reportedAt: new Date("2024-09-17"),
    upvotes: 7,
    downvotes: 0,
    comments: 6,
    photos: [
      {
        id: 8,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_lighting.jpg"
      }
    ],
  },

  // 位置 3: 2 個回報 (綠色標記) - 新竹科學園區
  {
    id: 9,
    type: "speed_bump",
    title: "減速帶損壞",
    description: "科學園區減速帶部分脫落，可能造成車輛損壞",
    location: "園區一路 & 園區二路口",
    coordinates: { lat: 24.8086, lng: 120.9706 },
    severity: "low",
    status: "pending",
    reportedBy: "user_002",
    reportedAt: new Date("2024-09-11"),
    upvotes: 3,
    downvotes: 0,
    comments: 1,
    photos: [
      {
        id: 9,
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        filename: "traffic_speed_bump.jpg"
      }
    ],
  },
  {
    id: 10,
    type: "drainage",
    title: "排水溝堵塞",
    description: "科學園區下雨時積水嚴重，影響行人通行",
    location: "園區一路 & 園區二路口",
    coordinates: { lat: 24.8086, lng: 120.9706 },
    severity: "medium",
    status: "verified",
    reportedBy: "user_002",
    reportedAt: new Date("2024-09-18"),
    upvotes: 6,
    downvotes: 0,
    comments: 2,
    photos: [
      {
        id: 10,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_drainage.jpg"
      }
    ],
  },

  // 位置 4: 4 個回報 (黃色標記) - 新竹城隍廟商圈
  {
    id: 11,
    type: "construction",
    title: "施工區域標示不清",
    description: "城隍廟商圈施工圍籬沒有明顯警告標誌",
    location: "中山路 & 東門街口",
    coordinates: { lat: 24.8056, lng: 120.9676 },
    severity: "high",
    status: "pending",
    reportedBy: "user_003",
    reportedAt: new Date("2024-09-09"),
    upvotes: 8,
    downvotes: 0,
    comments: 4,
    photos: [
      {
        id: 11,
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        filename: "traffic_construction.jpg"
      }
    ],
  },
  {
    id: 12,
    type: "bus_stop",
    title: "公車站牌損壞",
    description: "城隍廟前站牌傾斜，可能倒塌傷人",
    location: "中山路 & 東門街口",
    coordinates: { lat: 24.8056, lng: 120.9676 },
    severity: "medium",
    status: "verified",
    reportedBy: "user_004",
    reportedAt: new Date("2024-09-08"),
    upvotes: 5,
    downvotes: 0,
    comments: 2,
    photos: [
      {
        id: 12,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_bus_stop.jpg"
      }
    ],
  },
  {
    id: 13,
    type: "sidewalk",
    title: "人行道破損",
    description: "城隍廟商圈地磚翹起，容易絆倒行人",
    location: "中山路 & 東門街口",
    coordinates: { lat: 24.8056, lng: 120.9676 },
    severity: "medium",
    status: "resolved",
    reportedBy: "user_005",
    reportedAt: new Date("2024-09-07"),
    upvotes: 7,
    downvotes: 0,
    comments: 3,
    photos: [
      {
        id: 13,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_sidewalk.jpg"
      }
    ],
  },
  {
    id: 14,
    type: "drainage",
    title: "排水溝阻塞",
    description: "雨水排水溝被垃圾阻塞",
    location: "西大路 & 建國路口",
    coordinates: { lat: 24.8, lng: 120.965 },
    severity: "low",
    status: "verified",
    reportedBy: "user_006",
    reportedAt: new Date("2024-09-18"),
    upvotes: 5,
    downvotes: 0,
    comments: 1,
  },

  // 位置 5: 1 個回報 (綠色標記) - 公園區域
  {
    id: 15,
    type: "pathway",
    title: "步道損壞",
    description: "公園內步道有裂縫且不平整",
    location: "西大路 & 公園路口",
    coordinates: { lat: 24.8015, lng: 120.967 },
    severity: "low",
    status: "resolved",
    reportedBy: "user_001",
    reportedAt: new Date("2024-09-19"),
    upvotes: 8,
    downvotes: 0,
    comments: 2,
  },

  // 位置 6: 6 個回報 (紅色標記) - 繁忙商業區域
  {
    id: 16,
    type: "traffic_light",
    title: "號誌燈故障",
    description: "城隍廟商圈黃燈閃爍不停，造成交通混亂",
    location: "中山路 & 東門街口",
    coordinates: { lat: 24.8056, lng: 120.9676 },
    severity: "high",
    status: "pending",
    reportedBy: "user_007",
    reportedAt: new Date("2024-09-19"),
    upvotes: 22,
    downvotes: 1,
    comments: 5,
    photos: [
      {
        id: 14,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_light_faulty.jpg"
      }
    ],
  },

  // 位置 5: 1 個回報 (綠色標記) - 新竹公園
  {
    id: 15,
    type: "crossing",
    title: "斑馬線需要重畫",
    description: "新竹公園前斑馬線模糊，建議重新標示",
    location: "公園路 & 東大路口",
    coordinates: { lat: 24.8046, lng: 120.9696 },
    severity: "low",
    status: "verified",
    reportedBy: "jogger101",
    reportedAt: new Date("2024-09-05"),
    upvotes: 4,
    downvotes: 0,
    comments: 1,
    photos: [
      {
        id: 15,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_crosswalk_park.jpg"
      }
    ],
  },

  // 位置 6: 6 個回報 (紅色標記) - 新竹交流道
  {
    id: 16,
    type: "pothole",
    title: "多個坑洞",
    description: "交流道附近道路上有 3-4 個大小不一的坑洞",
    location: "經國路 & 中華路口",
    coordinates: { lat: 24.8036, lng: 120.9666 },
    severity: "high",
    status: "pending",
    reportedBy: "motorist202",
    reportedAt: new Date("2024-09-04"),
    upvotes: 18,
    downvotes: 2,
    comments: 9,
    photos: [
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        filename: "traffic_potholes.jpg"
      }
    ],
  },
  {
    id: 17,
    type: "traffic_light",
    title: "號誌不同步",
    description: "交流道附近相鄰路口的號誌時間不協調",
    location: "經國路 & 中華路口",
    coordinates: { lat: 24.8036, lng: 120.9666 },
    severity: "medium",
    status: "verified",
    reportedBy: "traffic203",
    reportedAt: new Date("2024-09-03"),
    upvotes: 9,
    downvotes: 1,
    comments: 4,
    photos: [
      {
        id: 17,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_lights_sync.jpg"
      }
    ],
  },
  {
    id: 18,
    type: "signage",
    title: "路標錯誤",
    description: "交流道附近路標指向錯誤方向",
    location: "經國路 & 中華路口",
    coordinates: { lat: 24.8036, lng: 120.9666 },
    severity: "medium",
    status: "pending",
    reportedBy: "tourist304",
    reportedAt: new Date("2024-09-02"),
    upvotes: 6,
    downvotes: 0,
    comments: 3,
    photos: [
      {
        id: 18,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_sign_direction.jpg"
      }
    ],
  },
  {
    id: 19,
    type: "parking",
    title: "違規停車嚴重",
    description: "交流道附近整排車輛違規停車，影響交通",
    location: "經國路 & 中華路口",
    coordinates: { lat: 24.8036, lng: 120.9666 },
    severity: "high",
    status: "verified",
    reportedBy: "user_009",
    reportedAt: new Date("2024-09-16"),
    upvotes: 16,
    downvotes: 0,
    comments: 7,
    photos: [
      {
        id: 19,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_parking_row.jpg"
      }
    ],
  },
  {
    id: 20,
    type: "construction",
    title: "施工影響交通",
    description: "交流道附近施工區域佔用過多車道",
    location: "經國路 & 中華路口",
    coordinates: { lat: 24.8036, lng: 120.9666 },
    severity: "medium",
    status: "resolved",
    reportedBy: "user_10",
    reportedAt: new Date("2024-09-15"),
    upvotes: 14,
    downvotes: 1,
    comments: 4,
    photos: [
      {
        id: 20,
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        filename: "traffic_construction_zone.jpg"
      }
    ],
  },
  {
    id: 21,
    type: "lighting",
    title: "路燈不足",
    description: "交流道附近夜間照明不足，視線不良",
    location: "經國路 & 中華路口",
    coordinates: { lat: 24.8036, lng: 120.9666 },
    severity: "medium",
    status: "pending",
    reportedBy: "night607",
    reportedAt: new Date("2024-08-30"),
    upvotes: 7,
    downvotes: 0,
    comments: 3,
    photos: [
      {
        id: 21,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        filename: "traffic_lighting_insufficient.jpg"
      }
    ],
  },
];