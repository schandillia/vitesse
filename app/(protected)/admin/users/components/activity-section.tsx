import {
  ActivityTable,
  type ActivityRow,
} from "@/app/(protected)/admin/activity/components/activity-table"
import { ActivityToolbar } from "@/app/(protected)/admin/activity/components/activity-toolbar"
import { Pagination } from "@/app/(protected)/admin/users/components/pagination"

interface ActivitySectionProps {
  rows: ActivityRow[]
  currentPage: number
  totalPages: number
}

export function ActivitySection({
  rows,
  currentPage,
  totalPages,
}: ActivitySectionProps) {
  return (
    <div className="space-y-2">
      <ActivityToolbar />
      <ActivityTable rows={rows} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
