import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/AdminSidebar";
import { Header } from "../components/Header";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <Header />
      <div className="lg:flex">
        <AdminSidebar />
        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

