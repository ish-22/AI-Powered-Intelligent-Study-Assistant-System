export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "admin";
  joinDate: string;
  studyStreak: number;
}

export interface Document {
  id: string;
  title: string;
  subject: string;
  fileType: "pdf" | "docx" | "txt";
  fileSize: number;
  uploadDate: string;
  status: "processing" | "ready" | "error";
  summary?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
  score?: number;
  completedAt?: string;
}

export interface Question {
  id: string;
  text: string;
  type: "mcq" | "true-false" | "short-answer" | "fill-blank";
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface AnalyticsData {
  date: string;
  studyTime: number;
  quizScore: number;
  documentsRead: number;
}

export interface Recommendation {
  id: string;
  title: string;
  type: "topic" | "quiz" | "document";
  subject: string;
  priority: "high" | "medium" | "low";
  confidenceScore: number;
  estimatedTime: number;
  reason: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: "streak" | "quiz" | "study" | "social";
}

export interface DashboardStats {
  documentsUploaded: number;
  summariesGenerated: number;
  quizzesCompleted: number;
  avgQuizScore: number;
  studyTimeHours: number;
  learningStreak: number;
}
