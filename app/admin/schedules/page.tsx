import { AdminSidebar } from "@/components/admin-sidebar"
import { ScheduleManagementTable } from "@/components/schedule-management-table"

export default function AdminSchedulesPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <ScheduleManagementTable />
      </main>
    </div>
  )
}
