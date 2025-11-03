import { Outlet } from "react-router"
import { Sidebar } from "@/components/Sidebar"

export function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  )
}
