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
      <main className="flex-1 text-foreground py-10 max-w-6xl mx-auto px-4 md:px-8">
        {children}
      </main>
      <Footer />
    </LoginModalProvider>
  )
}
