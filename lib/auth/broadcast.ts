export const authChannel =
  typeof window !== "undefined" ? new BroadcastChannel("auth") : null
