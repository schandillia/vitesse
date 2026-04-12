import { Navbar } from "@/components/layout/navbar"
import { LoginModalProvider } from "@/components/auth/login-modal-provider"
import { Footer } from "@/components/layout/footer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LoginModalProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </LoginModalProvider>
  )
}
