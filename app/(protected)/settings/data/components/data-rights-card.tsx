import { Card, CardContent } from "@/components/ui/card"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import Link from "next/link"

export function DataRightsCard() {
  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Your Data Rights" />
      <Card className="max-w-2xl">
        <CardContent className="px-6 py-4 space-y-3 text-sm text-muted-foreground">
          <p>
            Under GDPR and applicable privacy laws, you have the right to
            access, correct, and delete your personal data.
          </p>
          <p>
            You can export all your data above. To permanently delete your
            account and all associated data, use the section below.
          </p>
          <p>
            For any other data-related requests, please review our{" "}
            <Link
              href="/privacy"
              className="text-foreground underline underline-offset-4"
            >
              Privacy Policy
            </Link>{" "}
            or contact us via the{" "}
            <Link
              href="/contact"
              className="text-foreground underline underline-offset-4"
            >
              contact page
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
