import Link from "next/link"
import { ShieldBanIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/50 p-6 md:p-10">
      <Card className="w-full max-w-md text-center shadow-sm">
        <CardHeader className="flex flex-col items-center gap-4 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ShieldBanIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Access Restricted
            </CardTitle>
            <CardDescription className="text-balance leading-relaxed">
              Looks like you’re not authorized to be here. Please log in with an
              account that has the necessary permissions to access this page.
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button
            asChild
            size="lg"
            variant="default"
            className="w-full sm:w-auto"
          >
            <Link href="/">Back Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
