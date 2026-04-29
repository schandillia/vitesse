import Link from "next/link"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/50 p-6 md:p-10">
      <Card className="w-full max-w-md text-center shadow-sm">
        <CardHeader className="flex flex-col items-center gap-4 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Compass className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Page Not Found!
            </CardTitle>
            <CardDescription className="text-balance leading-relaxed">
              The page you are looking for seems to have vanished or was never
              here to begin with. Let’s get you back on the map.
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/">Back Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
