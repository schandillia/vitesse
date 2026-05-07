"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import { User } from "@/lib/auth/auth"
import { JobTitleField } from "@/app/(protected)/profile/professional/components/job-title-field"
import { CompanyField } from "@/app/(protected)/profile/professional/components/company-field"

interface WorkInfoCardProps {
  user: User
}

export function WorkInfoCard({ user }: WorkInfoCardProps) {
  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Work" />
      <Card className="max-w-2xl">
        <CardContent className="px-6 py-2">
          <div className="flex items-center justify-between gap-4 py-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wide w-28 shrink-0">
              Job Title
            </span>
            <div className="flex-1 min-w-0">
              <JobTitleField initialJobTitle={user.jobTitle} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wide w-28 shrink-0">
              Company
            </span>
            <div className="flex-1 min-w-0">
              <CompanyField initialCompany={user.company} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
