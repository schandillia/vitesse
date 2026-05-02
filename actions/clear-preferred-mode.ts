"use server"

import { cookies } from "next/headers"

export async function clearPreferredMode() {
  const cookieStore = await cookies()
  cookieStore.delete("preferred-mode")
}
