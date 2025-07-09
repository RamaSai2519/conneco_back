// types/auth.ts
export interface LoginRequest {
    password: string;
}

export interface SignupRequest {
    name: string;
    pass: string;
}

export interface RefreshRequest {
    refresh: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface User {
    id: number;
    pass: string;
    name: string;
    [key: string]: any; // Allow for additional user fields
}

export interface LoginResponse {
    user: Omit<User, 'pass'>; // Return user data without password
    tokens: AuthTokens;
}

export interface JWTPayload {
    userId: string;
    userPass: string; // Include password in JWT for authentication
    exp?: number;
}
