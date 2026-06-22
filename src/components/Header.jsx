import { useState } from "react";
import { FaBell, FaSearch, FaTimes } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { profile } = useAuth();

    const displayName = profile?.full_name || profile?.email || 'User';
    const roleBadge = profile?.role || 'Guest';

    return (
        <div id="header-container">
            {/* Search Bar - Trigger Modal */}
            <div id="search-bar" onClick={() => setIsSearchOpen(true)} className="cursor-pointer">
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search Here..."
                    readOnly
                />
                <FaSearch id="search-icon" />
            </div>

            {/* MODAL SEARCH (IMPROVISASI 1) */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Quick Search</h3>
                            <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-red-500">
                                <FaTimes />
                            </button>
                        </div>
                        <input 
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-hijau outline-none" 
                            placeholder="Type menu, customer name, or order ID..."
                            autoFocus
                        />
                        <div className="mt-4 text-sm text-gray-400">Press Esc to close</div>
                    </div>
                </div>
            )}

            <div id="icons-container">
                <div id="notification-icon">
                    <FaBell />
                    <span id="notification-badge">50</span>
                </div>
                <div id="chart-icon">
                    <FcAreaChart />
                </div>
                <div id="settings-icon">
                    <SlSettings />
                </div>

                <div id="profile-container">
                    <span id="profile-text">
                        Hello, <b>{displayName}</b>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        roleBadge === 'Admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                        {roleBadge}
                    </span>
                    <img
                        id="profile-avatar"
                        src="/img/logopcr.png"
                        alt="Profile"
                    />
                </div>
            </div>
        </div>
    );
}