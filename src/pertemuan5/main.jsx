import { createRoot } from "react-dom/client";
import "./assets/tailwind.css";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import PageHeader from "./components/PageHeader";
import Dashboard from "./pages/Dashboard";

createRoot(document.getElementById("root"))
    .render(
        <div className="min-h-screen bg-latar font-poppins text-teks">
            <div className="flex min-h-screen flex-col lg:flex-row">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6 xl:p-8">
                    <Header />
                    <div className="mt-6 space-y-6">
                        <PageHeader
                            title="Dashboard"
                            subtitle="Home / Dashboard"
                            actionLabel="Download Report"
                        />
                        <Dashboard />
                    </div>
                </main>
            </div>
        </div>,
    )
