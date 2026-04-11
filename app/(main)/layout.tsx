import { Navbar } from "@/components/layout/navbar"
import { LoginModalProvider } from "@/components/auth/login-modal-provider"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LoginModalProvider>
      <Navbar />
      {children}
    </LoginModalProvider>
  )
}
