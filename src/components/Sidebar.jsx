import { FaThLarge, FaList, FaHeadphonesAlt, FaBox, FaCogs, FaRegStickyNote, FaShoppingCart, FaPlusCircle, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { profile, signOut } = useAuth();
  const isAdmin = profile?.role === 'Admin';

  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-xl p-4 space-x-3 transition-all
    ${isActive ?
        (isAdmin
          ? "text-indigo-600 bg-indigo-100 font-extrabold shadow-sm"
          : "text-emerald-600 bg-emerald-100 font-extrabold shadow-sm") :
        "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`
          fixed md:static top-0 left-0 z-50 md:z-auto
          w-[280px] bg-white border-r min-h-screen p-6 flex flex-col gap-6
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 md:hidden"
        >
          <FaTimes className="text-gray-500" />
        </button>

        <div id="sidebar-logo" className="mb-8">
          <span id="logo-title" className="text-2xl font-bold">
            Sedap <b className={isAdmin ? "text-indigo-500" : "text-emerald-500"}>.</b>
          </span>
          <p className="text-gray-400 text-sm">
            {isAdmin ? "Admin Console" : "Member Portal"}
          </p>
        </div>

        {/* Role indicator badge */}
        <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
          isAdmin ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
        }`}>
          {isAdmin ? "ADMIN CONSOLE" : "MEMBER PORTAL"}
        </div>

        <nav className="flex-1">
          <ul className="space-y-2 list-none p-0">

            {isAdmin ? (
              <>
                <li className="mt-6 text-[10px] text-gray-400 uppercase font-bold px-4">Admin Menu</li>

                <li>
                  <NavLink to="/" className={menuClass} onClick={onClose}>
                    <FaThLarge /> <span>Dashboard</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/products" className={menuClass} onClick={onClose}>
                    <FaBox /> <span>Products</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/orders" className={menuClass} onClick={onClose}>
                    <FaList /> <span>Orders</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/customers" className={menuClass} onClick={onClose}>
                    <FaHeadphonesAlt /> <span>Customers</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/components" className={menuClass} onClick={onClose}>
                    <FaList /> <span>Components</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/fitur-xyz" className={menuClass} onClick={onClose}>
                    <FaCogs /> <span>Fitur Xyz</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/notes" className={menuClass} onClick={onClose}>
                    <FaRegStickyNote /> <span>Notes</span>
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="mt-6 text-[10px] text-gray-400 uppercase font-bold px-4">Member Menu</li>

                <li>
                  <NavLink to="/member/orders" className={menuClass} onClick={onClose}>
                    <FaShoppingCart /> <span>My Orders</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/member/new-order" className={menuClass} onClick={onClose}>
                    <FaPlusCircle /> <span>New Order</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => { onClose(); signOut(); }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>

        <div className="text-xs text-gray-400">
          &copy; 2026 Nabilla Suharman
        </div>
      </div>
    </>
  );
}