import { SQLOutputValue } from "node:sqlite";

export interface User {
  userId: string;
  name: string;
  lastName: string;
  password: string;
  email: string;
  role: string;
}

export interface UserRow {
  user_id: string;
  name: string;
  last_name: string;
  password: string;
  email: string;
  role: string;
  [key: string]: SQLOutputValue;
}

export function isUserRow(obj: Record<string, SQLOutputValue>): obj is UserRow {
  return (
    "user_id" in obj &&
    typeof obj.user_id === "string" &&
    "name" in obj &&
    obj.name === "string" &&
    "last_name" in obj &&
    obj.last_name === "string" &&
    "password" in obj &&
    obj.password === "string" &&
    "email" in obj &&
    obj.email === "string" &&
    "role" in obj &&
    obj.role === "string"
  );
}