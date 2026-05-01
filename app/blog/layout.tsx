import { getServerSession } from "@/lib/auth/get-server-session"
import { Navbar } from "@/components/layout/navbar"
import { LoginModalProvider } from "@/components/auth/login-modal-provider"
import { Footer } from "@/components/layout/footer"

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  return (
    <LoginModalProvider>
      <Navbar session={session} />
      <main className="flex-1 text-foreground">{children}</main>
      <Footer />
    </LoginModalProvider>
  )
}
