export const personas = [
  {
    id: "1",
    name: "知識型 YouTuber",
    emoji: "🎓",
    description: "專業、深度、有邏輯",
    tone: "專業嚴謹",
    opening: "大家好，今天我們來聊一個很多人都搞錯的概念——",
    closing: "如果覺得有幫助，記得訂閱！我們下期見。",
    color: "from-blue-500 to-indigo-600",
    voice: "voice-1",
  },
  {
    id: "2",
    name: "搞笑帶貨員",
    emoji: "🛍️",
    description: "活潑、幽默、接地氣",
    tone: "輕鬆幽默",
    opening: "天啊！這個東西我用了之後整個人都不一樣了！",
    closing: "連結在下方，手速要快，賣完不補！",
    color: "from-orange-500 to-pink-600",
    voice: "voice-3",
  },
  {
    id: "3",
    name: "美食探索者",
    emoji: "🍜",
    description: "感性、生動、有畫面感",
    tone: "溫暖感性",
    opening: "當那口湯進入喉嚨的瞬間，我整個人愣住了……",
    closing: "這家店的地址在簡介，你一定要去試試。",
    color: "from-yellow-500 to-red-500",
    voice: "voice-2",
  },
];

export const voices = [
  { id: "voice-1", name: "台灣女聲・小晴", lang: "繁體中文", mood: "專業沉穩", preview: "您好，這是小晴的聲音預覽。", waveform: [0.3, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6, 0.3, 0.7, 0.5] },
  { id: "voice-2", name: "台灣男聲・阿哲", lang: "繁體中文", mood: "活力陽光", preview: "嘿！大家好，我是阿哲！",       waveform: [0.5, 0.8, 0.6, 0.4, 0.9, 0.7, 0.5, 0.8, 0.3, 0.6] },
  { id: "voice-3", name: "活潑少女・Mia",  lang: "繁體中文", mood: "元氣可愛", preview: "哇！這個真的太棒了吧！",       waveform: [0.6, 0.4, 0.9, 0.7, 0.5, 0.8, 0.4, 0.7, 0.6, 0.9] },
];

export const subtitleTemplates = [
  { id: "mrbeast", name: "MrBeast 風格", fontFamily: "Impact, sans-serif",           fontSize: 32, color: "#FFFF00", stroke: "#000000", strokeWidth: 4, bg: "transparent",          animation: "pop",   preview: "震驚！這個結果讓我" },
  { id: "apple",   name: "Apple 發表會", fontFamily: "'SF Pro Display', sans-serif", fontSize: 28, color: "#FFFFFF", stroke: "transparent", strokeWidth: 0, bg: "rgba(0,0,0,0.4)", animation: "fade",  preview: "介紹全新一代" },
  { id: "neon",    name: "霓虹閃光",     fontFamily: "Arial Black, sans-serif",      fontSize: 30, color: "#00FFFF", stroke: "#FF00FF", strokeWidth: 2, bg: "transparent",          animation: "glow",  preview: "限時優惠！立刻搶購" },
  { id: "minimal", name: "極簡白底",     fontFamily: "Noto Sans TC, sans-serif",     fontSize: 26, color: "#1A1A1A", stroke: "transparent", strokeWidth: 0, bg: "rgba(255,255,255,0.92)", animation: "slide", preview: "今天分享一個小技巧" },
];

export const bgmTracks = [
  { id: "bgm-1", name: "Lo-Fi 輕鬆學習",    mood: "🎵 放鬆",  bpm: 85  },
  { id: "bgm-2", name: "電子節拍・活力",     mood: "⚡ 活力",  bpm: 128 },
  { id: "bgm-3", name: "鋼琴流水・感性",     mood: "🌊 感性",  bpm: 70  },
  { id: "bgm-4", name: "Upbeat Pop・輕快",  mood: "🌟 正能量", bpm: 110 },
];

export const trendTags = [
  "AI 科技", "省錢秘技", "早安例程", "職場觀察",
  "台灣美食", "減脂日記", "學習方法", "副業入門",
  "情感關係", "穿搭靈感", "心理健康", "程式教學",
];

export const platforms = [
  { id: "tiktok",         name: "TikTok",     icon: "🎵", ratio: "9:16",  maxDuration: 60  },
  { id: "ig-reels",       name: "IG Reels",   icon: "📸", ratio: "9:16",  maxDuration: 90  },
  { id: "youtube-shorts", name: "YT Shorts",  icon: "▶️", ratio: "9:16",  maxDuration: 60  },
  { id: "youtube",        name: "YouTube",    icon: "📺", ratio: "16:9",  maxDuration: 600 },
];

export const defaultScript = {
  opening: { text: "你知道嗎？90% 的人都不知道這個 AI 工具的存在，但它已經悄悄改變了所有創作者的工作方式。", duration: 8 },
  body: [
    { text: "這個工具叫做 Sora，是 OpenAI 最新推出的影片生成模型。只要輸入一段文字描述，它就能在幾秒內生成高品質的影片片段。", duration: 12 },
    { text: "而且不只這樣——它能理解物理規律、光影變化，生成的影片幾乎和真實拍攝無法分辨！", duration: 10 },
  ],
  closing: { text: "現在搶先掌握這項技術，你的競爭對手還不知道這個工具。追蹤我，下週我會教你具體怎麼用！", duration: 8 },
};

export function generateTopicScript(topic: string, personaId: string) {
  const persona = personas.find(p => p.id === personaId) ?? personas[0];
  const keyword = topic.length > 30 ? topic.substring(0, 30) + "…" : topic;
  return {
    opening: `${persona.opening.split("——")[0]}——關於「${keyword}」的真相！`,
    body0:   `說到「${keyword}」，你可能以為自己已經了解，但事實上 90% 的人都忽略了最關鍵的這一點：它不只是一個工具，它是一種全新的思維方式。`,
    body1:   `更重要的是，掌握「${keyword}」的人，在過去半年內平均效率提升了 3 倍。數據不說謊，而且這並不需要任何技術背景！`,
    closing: persona.closing,
  };
}

export const storyboardFrames = [
  { id: 1, thumbnail: "🤖", label: "AI 機器人特效", duration: 3 },
  { id: 2, thumbnail: "💻", label: "螢幕錄製畫面",  duration: 4 },
  { id: 3, thumbnail: "✨", label: "動態粒子效果",  duration: 3 },
  { id: 4, thumbnail: "📱", label: "產品展示特寫",  duration: 3 },
  { id: 5, thumbnail: "🌐", label: "全球資料視覺化", duration: 5 },
  { id: 6, thumbnail: "🚀", label: "未來科技場景",  duration: 4 },
];

export const analyticsData = {
  views7:      [12400, 18900, 24300, 31200, 28800, 42100, 58900],
  views30:     [8200, 11400, 15600, 12800, 18900, 22100, 19800, 24300, 28100, 31200, 29800, 35600, 38900, 42100, 44800, 48200, 46100, 51400, 54800, 58900, 61200, 64800, 62100, 67400, 71200, 68900, 74200, 78900, 82100, 87400],
  completionRate: [68, 71, 73, 70, 75, 78, 82],
  engagement:     [4.2, 5.1, 4.8, 6.3, 5.9, 7.2, 8.1],
  days7:  ["週一", "週二", "週三", "週四", "週五", "週六", "週日"],
  days30: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
  topVideo: { title: "你一定沒用過的 AI 工具！90% 的人都不知道", platform: "TikTok", views: 58900, completionRate: 82, engagement: 8.1 },
  abTest: {
    a: { title: "你一定沒用過的 AI 工具！",              views: 34200, ctr: 6.8  },
    b: { title: "震驚！這個 AI 已改變所有人的工作方式", views: 58900, ctr: 12.3 },
  },
  aiInsight: "你的受眾對「震驚型」開場白的完播率高出 23%，建議下次採用疑問式或驚嘆式標題。幽默語氣的影片平均互動率達 8.1%，優於知識型的 4.9%。",
};

export const scheduledPosts = [
  { id: "1", title: "你一定沒用過的 AI 工具！",    platform: "TikTok",   scheduledAt: "2026-03-27 18:00", status: "scheduled", thumbnail: "🤖", views: 0 },
  { id: "2", title: "5 個讓你效率翻倍的方法",       platform: "IG Reels", scheduledAt: "2026-03-28 12:00", status: "draft",      thumbnail: "⚡", views: 0 },
  { id: "3", title: "台北最值得去的隱藏咖啡廳",     platform: "YT Shorts",scheduledAt: "2026-03-25 09:00", status: "published",  thumbnail: "☕", views: 32100 },
];

export const historyVideos = [
  { id: "v1", title: "你一定沒用過的 AI 工具！90% 的人都不知道", platform: "TikTok",    status: "published", thumbnail: "🤖", views: 58900, completionRate: 82, createdAt: "2026-03-25", duration: 58 },
  { id: "v2", title: "台北最值得去的隱藏咖啡廳 TOP 5",           platform: "YT Shorts", status: "published", thumbnail: "☕", views: 32100, completionRate: 74, createdAt: "2026-03-24", duration: 45 },
  { id: "v3", title: "5 個讓你效率翻倍的冷門 App",               platform: "IG Reels",  status: "draft",     thumbnail: "⚡", views: 0,     completionRate: 0,  createdAt: "2026-03-23", duration: 60 },
  { id: "v4", title: "減脂期間這樣吃，一週瘦 2 公斤",            platform: "TikTok",    status: "published", thumbnail: "🥗", views: 48200, completionRate: 79, createdAt: "2026-03-22", duration: 30 },
  { id: "v5", title: "2026 最值得投資的 3 個技能",               platform: "YT Shorts", status: "published", thumbnail: "📈", views: 21400, completionRate: 68, createdAt: "2026-03-20", duration: 55 },
  { id: "v6", title: "工程師分享：我如何用 AI 把工作時間減半",    platform: "TikTok",    status: "scheduled", thumbnail: "💻", views: 0,     completionRate: 0,  createdAt: "2026-03-19", duration: 90 },
];

export const hashtagSuggestions: Record<string, string[]> = {
  default: ["#創作者日常", "#短影音", "#台灣", "#生活分享", "#漲粉技巧"],
  ai:      ["#AI工具", "#人工智慧", "#科技", "#ChatGPT", "#效率提升", "#程式設計"],
  food:    ["#台灣美食", "#餐廳推薦", "#吃貨", "#美食探索", "#食記"],
  fitness: ["#減脂", "#健身", "#健康生活", "#瘦身日記", "#運動"],
  finance: ["#副業", "#理財", "#投資", "#被動收入", "#財務自由"],
};
