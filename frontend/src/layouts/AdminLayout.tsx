import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/AdminSidebar";
import { Header } from "../components/Header";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-700">
      <Header />

      <div className="lg:flex lg:items-start">
        <AdminSidebar />

        <main
          className="min-w-0 w-full flex-1 px-4 py-6 sm:px-6 lg:px-8"
          style={{ colorScheme: "light" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}