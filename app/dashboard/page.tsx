import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard.",
}

export default function DashboardPage() {
  return (
    <div className="container">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  )
}
