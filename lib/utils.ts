import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRequestKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local-client";
}

export function makeTitle(content: string) {
  const normalized = content.replace(/\\s+/g, " ").trim();
  return normalized.length > 52 ? `${normalized.slice(0, 52).trimEnd()}…` : normalized;
}
