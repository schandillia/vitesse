import { type Role } from "@/lib/auth/roles"

export type UserRow = {
  id: string
  name: string
  username: string
  email: string
  image: string | null
  role: Role
  emailVerified: boolean
  createdAt: Date
}
