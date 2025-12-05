// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    [key: string]: any;
}

// User Types
export interface User {
    id: number;
    email: string;
    name: string;
    created_at?: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse extends ApiResponse {
    access_token?: string;
    user?: User;
}

// Assessment History Types
export interface AssessmentAnswer {
    questionId: number;
    emoji: string;
    score: number;
}

export interface AssessmentHistory {
    id: number;
    total_score: number;
    max_score: number;
    level: string;
    percentage: number;
    answers: AssessmentAnswer[];
    completed_at: string;
}

export interface SaveHistoryRequest {
    total_score: number;
    max_score: number;
    level: string;
    answers: AssessmentAnswer[];
}

export interface HistoryResponse extends ApiResponse {
    history?: AssessmentHistory[];
    history_id?: number;
}
