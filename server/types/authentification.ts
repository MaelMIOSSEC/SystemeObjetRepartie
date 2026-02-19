export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  isAdmin?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Côté serveur
export interface AuthPayload {
  userId: string;
  username: string;
  isAdmin: boolean;
  exp: number;
}

export function isAuthPayload(obj: AuthPayload): obj is AuthPayload {
  return (
    "userId" in obj && typeof obj.userId === "string" &&
    "username" in obj && typeof obj.username === "string" &&
    "isAdmin" in obj && typeof obj.isAdmin === "boolean" &&
    "exp" in obj && typeof obj.exp === "number"
  );
}
