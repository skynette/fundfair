import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 3600000 // 1 hr before data goes stale
    },
  },
};

export const userLoggedIn = (user: any) => {
  return Object.keys(user ?? {}).length > 0;
}