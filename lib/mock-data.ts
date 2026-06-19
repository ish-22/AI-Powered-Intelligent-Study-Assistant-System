import type { DashboardStats, Document, Quiz, Question, ChatSession, AnalyticsData, Recommendation, Achievement, User } from "@/types";

export const mockUser: User = {
  id: "1",
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  avatar: "https://avatars.githubusercontent.com/u/1?v=4",
  role: "student",
  joinDate: "2024-09-01",
  studyStreak: 12,
};

export const mockStats: DashboardStats = {
  documentsUploaded: 24,
  summariesGenerated: 18,
  quizzesCompleted: 47,
  avgQuizScore: 82,
  studyTimeHours: 156,
  learningStreak: 12,
};

export const mockDocuments: Document[] = [
  { id: "1", title: "Advanced Calculus Notes", subject: "Mathematics", fileType: "pdf", fileSize: 2457600, uploadDate: "2024-12-10", status: "ready" },
  { id: "2", title: "Organic Chemistry Chapter 5", subject: "Chemistry", fileType: "pdf", fileSize: 1843200, uploadDate: "2024-12-08", status: "ready" },
  { id: "3", title: "World History Essay", subject: "History", fileType: "docx", fileSize: 524288, uploadDate: "2024-12-05", status: "ready" },
  { id: "4", title: "Python Programming Basics", subject: "Computer Science", fileType: "pdf", fileSize: 3145728, uploadDate: "2024-12-03", status: "ready" },
  { id: "5", title: "Economics Lecture Notes", subject: "Economics", fileType: "txt", fileSize: 204800, uploadDate: "2024-12-01", status: "processing" },
  { id: "6", title: "Biology Cell Structure", subject: "Biology", fileType: "pdf", fileSize: 4194304, uploadDate: "2024-11-28", status: "ready" },
];

export const mockQuizzes: Quiz[] = [
  { id: "1", title: "Calculus Derivatives", subject: "Mathematics", questionCount: 20, difficulty: "hard", timeLimit: 30, score: 85, completedAt: "2024-12-10" },
  { id: "2", title: "Organic Reactions", subject: "Chemistry", questionCount: 15, difficulty: "medium", timeLimit: 20, score: 73, completedAt: "2024-12-08" },
  { id: "3", title: "WWII Key Events", subject: "History", questionCount: 10, difficulty: "easy", timeLimit: 15, score: 90, completedAt: "2024-12-05" },
  { id: "4", title: "Python Functions", subject: "Computer Science", questionCount: 25, difficulty: "medium", timeLimit: 35 },
  { id: "5", title: "Market Economics", subject: "Economics", questionCount: 12, difficulty: "easy", timeLimit: 18, score: 78, completedAt: "2024-12-01" },
];

export const mockQuestions: Question[] = [
  {
    id: "1",
    text: "What is the derivative of sin(x)?",
    type: "mcq",
    options: ["cos(x)", "-cos(x)", "tan(x)", "-sin(x)"],
    correctAnswer: 0,
    explanation: "The derivative of sin(x) is cos(x), which can be derived from the limit definition.",
  },
  {
    id: "2",
    text: "The integral of a constant is always zero.",
    type: "true-false",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "The integral of a constant c is cx + C, not zero.",
  },
  {
    id: "3",
    text: "What rule is used to differentiate a product of two functions?",
    type: "fill-blank",
    correctAnswer: "product rule",
    explanation: "The product rule states: d/dx[f(x)g(x)] = f'(x)g(x) + f(x)g'(x).",
  },
  {
    id: "4",
    text: "What is the second derivative of x³?",
    type: "mcq",
    options: ["3x²", "6x", "x²", "6"],
    correctAnswer: 1,
    explanation: "First derivative is 3x², and second derivative is 6x.",
  },
  {
    id: "5",
    text: "Chain rule is used when differentiating composite functions.",
    type: "true-false",
    options: ["True", "False"],
    correctAnswer: 0,
    explanation: "Correct. The chain rule: d/dx[f(g(x))] = f'(g(x)) · g'(x).",
  },
];

export const mockChatSessions: ChatSession[] = [
  {
    id: "1",
    title: "Calculus Help",
    createdAt: "2024-12-10T10:00:00",
    messages: [
      { id: "1", role: "user", content: "Can you explain the chain rule in calculus?", timestamp: "2024-12-10T10:00:00" },
      { id: "2", role: "assistant", content: "The **chain rule** is a formula for computing the derivative of a composite function.\n\nIf `y = f(g(x))`, then:\n\n```\ndy/dx = f'(g(x)) · g'(x)\n```\n\n**Example:** Find the derivative of `sin(x²)`\n- Let `f(u) = sin(u)` and `g(x) = x²`\n- `f'(u) = cos(u)` and `g'(x) = 2x`\n- So `d/dx[sin(x²)] = cos(x²) · 2x`\n\nWould you like more examples?", timestamp: "2024-12-10T10:00:05", sources: ["Advanced Calculus Notes.pdf"] },
    ],
  },
  {
    id: "2",
    title: "Python Loops",
    createdAt: "2024-12-09T14:30:00",
    messages: [
      { id: "1", role: "user", content: "What's the difference between for and while loops?", timestamp: "2024-12-09T14:30:00" },
      { id: "2", role: "assistant", content: "Great question! Here's a breakdown:\n\n**For Loop** — used when you know the number of iterations:\n```python\nfor i in range(5):\n    print(i)\n```\n\n**While Loop** — used when the condition determines iteration:\n```python\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n```\n\nUse `for` for sequences, `while` for conditional repetition.", timestamp: "2024-12-09T14:30:08" },
    ],
  },
];

export const mockAnalytics: AnalyticsData[] = [
  { date: "Mon", studyTime: 2.5, quizScore: 78, documentsRead: 2 },
  { date: "Tue", studyTime: 3.0, quizScore: 82, documentsRead: 3 },
  { date: "Wed", studyTime: 1.5, quizScore: 75, documentsRead: 1 },
  { date: "Thu", studyTime: 4.0, quizScore: 88, documentsRead: 4 },
  { date: "Fri", studyTime: 2.0, quizScore: 80, documentsRead: 2 },
  { date: "Sat", studyTime: 5.0, quizScore: 91, documentsRead: 5 },
  { date: "Sun", studyTime: 3.5, quizScore: 85, documentsRead: 3 },
];

export const mockMonthlyAnalytics = [
  { month: "Jul", avgScore: 72, studyHours: 45 },
  { month: "Aug", avgScore: 75, studyHours: 52 },
  { month: "Sep", avgScore: 78, studyHours: 61 },
  { month: "Oct", avgScore: 80, studyHours: 58 },
  { month: "Nov", avgScore: 83, studyHours: 70 },
  { month: "Dec", avgScore: 82, studyHours: 65 },
];

export const mockSubjectPerformance = [
  { subject: "Math", score: 85, quizzes: 12 },
  { subject: "Chemistry", score: 73, quizzes: 8 },
  { subject: "History", score: 90, quizzes: 6 },
  { subject: "CS", score: 88, quizzes: 15 },
  { subject: "Economics", score: 76, quizzes: 6 },
  { subject: "Biology", score: 79, quizzes: 9 },
];

export const mockRecommendations: Recommendation[] = [
  { id: "1", title: "Integration by Parts", type: "topic", subject: "Mathematics", priority: "high", confidenceScore: 92, estimatedTime: 45, reason: "Frequently tested, low recent quiz score" },
  { id: "2", title: "Organic Chemistry Quiz", type: "quiz", subject: "Chemistry", priority: "high", confidenceScore: 87, estimatedTime: 20, reason: "Score below class average" },
  { id: "3", title: "Cold War Documents", type: "document", subject: "History", priority: "medium", confidenceScore: 78, estimatedTime: 30, reason: "Upcoming exam topic" },
  { id: "4", title: "Data Structures Review", type: "topic", subject: "Computer Science", priority: "medium", confidenceScore: 81, estimatedTime: 60, reason: "Strong foundation, deepen knowledge" },
  { id: "5", title: "Supply & Demand", type: "quiz", subject: "Economics", priority: "low", confidenceScore: 65, estimatedTime: 15, reason: "Maintain current understanding" },
];

export const mockAchievements: Achievement[] = [
  { id: "1", title: "Quick Learner", description: "Completed 10 quizzes", icon: "⚡", earnedAt: "2024-11-15", category: "quiz" },
  { id: "2", title: "7-Day Streak", description: "Studied 7 days in a row", icon: "🔥", earnedAt: "2024-11-20", category: "streak" },
  { id: "3", title: "Document Master", description: "Uploaded 20 documents", icon: "📚", earnedAt: "2024-12-01", category: "study" },
  { id: "4", title: "Perfect Score", description: "Got 100% on a quiz", icon: "🏆", earnedAt: "2024-12-05", category: "quiz" },
  { id: "5", title: "Night Owl", description: "Studied past midnight 5 times", icon: "🦉", earnedAt: "2024-12-08", category: "study" },
  { id: "6", title: "Top Performer", description: "Ranked in top 10%", icon: "🌟", earnedAt: "2024-12-10", category: "quiz" },
];

export const mockAdminUsers: Array<User & { status: string; lastActive: string; quizzes: number; documents: number }> = [
  { id: "1", name: "Alex Johnson", email: "alex@uni.edu", role: "student", joinDate: "2024-09-01", studyStreak: 12, status: "active", lastActive: "2 min ago", quizzes: 47, documents: 24 },
  { id: "2", name: "Sarah Chen", email: "sarah@uni.edu", role: "student", joinDate: "2024-09-05", studyStreak: 8, status: "active", lastActive: "1 hr ago", quizzes: 32, documents: 18 },
  { id: "3", name: "Mike Brown", email: "mike@uni.edu", role: "student", joinDate: "2024-09-10", studyStreak: 3, status: "inactive", lastActive: "2 days ago", quizzes: 15, documents: 9 },
  { id: "4", name: "Emily Davis", email: "emily@uni.edu", role: "student", joinDate: "2024-09-12", studyStreak: 21, status: "active", lastActive: "30 min ago", quizzes: 63, documents: 31 },
  { id: "5", name: "James Wilson", email: "james@uni.edu", role: "admin", joinDate: "2024-08-01", studyStreak: 0, status: "active", lastActive: "5 min ago", quizzes: 0, documents: 0 },
];

export const mockActivityLog = [
  { id: "1", user: "Alex Johnson", action: "Completed Quiz", detail: "Calculus Derivatives — 85%", time: "2 min ago", type: "quiz" },
  { id: "2", user: "Sarah Chen", action: "Uploaded Document", detail: "Organic Chemistry Chapter 6.pdf", time: "15 min ago", type: "upload" },
  { id: "3", user: "Emily Davis", action: "Generated Summary", detail: "Biology Cell Structure", time: "32 min ago", type: "summary" },
  { id: "4", user: "Mike Brown", action: "AI Chat Session", detail: "Asked 12 questions about History", time: "1 hr ago", type: "chat" },
  { id: "5", user: "Alex Johnson", action: "Uploaded Document", detail: "Advanced Calculus Notes.pdf", time: "2 hr ago", type: "upload" },
];
