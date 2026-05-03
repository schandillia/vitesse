import { type Role } from "@/db/types/roles"

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
