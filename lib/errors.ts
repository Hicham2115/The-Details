import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error;
    if (typeof message === "string") return message;
    if (error.code === "ECONNABORTED") return "The request timed out. Please try again.";
    if (!error.response) return "Network error. Check your connection and try again.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
