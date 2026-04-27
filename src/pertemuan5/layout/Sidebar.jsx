import { FaThLarge, FaList, FaHeadphonesAlt } from "react-icons/fa";

export default function Sidebar() {
    return (
        <div id="sidebar">
            <div id="sidebar-logo">
                <span id="logo-title">Sedap <b id="logo-dot">.</b></span>
                <span id="logo-subtitle">Modern Admin Dashboard</span>
            </div>

            <div id="sidebar-menu">
                <ul id="menu-list">
                    <li><div id="menu-1"><FaThLarge /><span>Dashboard</span></div></li>
                    <li><div id="menu-2"><FaList /><span>Orders</span></div></li>
                    <li><div id="menu-3"><FaHeadphonesAlt /><span>Customers</span></div></li>
                </ul>
            </div>

            <div id="sidebar-footer">
                <div id="footer-card">
                    <div id="footer-text">
                        <span>Please organize your menus through button below!</span>
                        <div id="add-menu-button"><span>Add Menus</span></div>
                    </div>
                    {/* IMPROVISASI 3: Status Indicator */}
                    <div className="relative">
                        <img id="footer-avatar" src="/img/logopcr.png" alt="Avatar" />
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>
                </div>
                <span id="footer-brand">Sedap Restaurant Admin Dashboard</span>
                <p id="footer-copyright">&copy; 2025 All Right Reserved</p>
            </div>
        </div>
    );
}