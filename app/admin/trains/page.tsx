import { Header } from "@/components/header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { TrainManagementTable } from "@/components/train-management-table"

export default function AdminTrainsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Manage Trains</h1>
            <p className="mt-2 text-muted-foreground">Add, edit, or remove trains from your fleet</p>
          </div>

          <TrainManagementTable />
        </main>
      </div>
    </div>
  )
}
