const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const TOKEN_KEY = "learnquest_token";
const USER_KEY = "learnquest_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: unknown) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser<T = any>(): T | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(
      "Can't reach the LearnQuest server. Is the backend running on http://localhost:8080?",
      0
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  }
  return data as T;
}

// ---------- Auth ----------
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "student" | "teacher";
  classLevel: string;
  verified: boolean;
  xp: number;
  streak: number;
}

export const signup = (name: string, email: string, password: string) =>
  request<{ message: string; email: string; devOtp?: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const verifyOtp = (email: string, code: string) =>
  request<{ token: string; user: AuthUser }>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });

export const resendOtp = (email: string) =>
  request<{ message: string; devOtp?: string }>("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const login = (email: string, password: string) =>
  request<{ token: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// ---------- Curriculum ----------
export interface CurriculumSubject {
  name: string;
  classes: string[];
  topics: string[];
}
export interface CurriculumData {
  classes: string[];
  terms: string[];
  subjects: CurriculumSubject[];
}
export const getCurriculum = () => request<CurriculumData>("/curriculum");

export interface LibraryNote {
  title: string;
  topic: string;
  content: string;
}
export interface LibrarySubject {
  name: string;
  notes: LibraryNote[];
}
export const getLibrary = () => request<LibrarySubject[]>("/library");

// ---------- Practice ----------
export interface PracticeQuestion {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}
export const getPracticeQuestions = (subject: string, topic: string) =>
  request<PracticeQuestion[]>(
    `/practice/questions?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`
  );

export const submitPracticeAnswer = (questionId: number, answer: string) =>
  request<{ correct: boolean; feedback: string; xpEarned: number }>("/practice/submit", {
    method: "POST",
    body: JSON.stringify({ questionId, answer }),
  });

// ---------- Theory ----------
export interface TheoryQuestion {
  id: number;
  prompt: string;
}
export const getTheoryQuestions = (subject: string, topic: string) =>
  request<TheoryQuestion[]>(
    `/theory/questions?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`
  );

export const gradeTheoryAnswer = (questionId: number, answer: string) =>
  request<{ verdict: "correct" | "partial" | "incorrect"; feedback: string; xpEarned: number }>(
    "/theory/grade",
    { method: "POST", body: JSON.stringify({ questionId, answer }) }
  );

// ---------- AI Tutor ----------
export const chatWithTutor = (message: string, subject: string, topic: string) =>
  request<{ reply: string }>("/tutor/chat", {
    method: "POST",
    body: JSON.stringify({ message, subject, topic }),
  });

// ---------- Dashboard / Leaderboard ----------
export interface DashboardSummary {
  user: AuthUser & { lastActiveAt: string };
  subjects: { subject: string; attempts: number; correct: number; progress: number }[];
  weekly: { day: string; questions: number }[];
}
export const getDashboardSummary = () => request<DashboardSummary>("/dashboard/summary");

export interface LeaderboardEntry {
  name: string;
  xp: number;
  streak: number;
}
export const getLeaderboard = () => request<LeaderboardEntry[]>("/leaderboard");

// ---------- Teacher ----------
export interface TeacherStudent {
  id: number;
  name: string;
  classLevel: string;
  avgScore: number;
  weakTopics: string[];
}
export const getTeacherStudents = () => request<TeacherStudent[]>("/teacher/students");
