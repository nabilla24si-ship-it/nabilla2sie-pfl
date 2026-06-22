import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaBars } from "react-icons/fa";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full md:pl-0 p-4 md:p-8">
        {/* Mobile hamburger button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-4 p-3 rounded-xl bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <FaBars className="text-gray-600 text-lg" />
        </button>
        <Header />
        <div className="mt-6 md:mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}