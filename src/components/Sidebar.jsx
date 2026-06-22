import { FaThLarge, FaList, FaHeadphonesAlt, FaBox, FaCogs, FaRegStickyNote, FaShoppingCart, FaPlusCircle, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { profile, signOut } = useAuth();
  const isAdmin = profile?.role === 'Admin';

  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-xl p-4 space-x-3 transition-all
    ${isActive ?
        "text-hijau bg-green-200 font-extrabold shadow-sm" :
        "text-gray-500 hover:text-hijau hover:bg-green-100"
    }`;

  return (
    <div id="sidebar" className="w-[280px] bg-white border-r min-h-screen p-6 flex flex-col gap-6">
      <div id="sidebar-logo" className="mb-8">
        <span id="logo-title" className="text-2xl font-bold">Sedap <b className="text-hijau">.</b></span>
        <p className="text-gray-400 text-sm">Modern Admin Dashboard</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 list-none p-0">

          {isAdmin ? (
            <>
              <li className="mt-10 text-[10px] text-gray-400 uppercase font-bold px-4">Admin Menu</li>

              <li>
                <NavLink to="/" className={menuClass}>
                  <FaThLarge /> <span>Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/products" className={menuClass}>
                  <FaBox /> <span>Products</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/orders" className={menuClass}>
                  <FaList /> <span>Orders</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/customers" className={menuClass}>
                  <FaHeadphonesAlt /> <span>Customers</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/components" className={menuClass}>
                  <FaList /> <span>Components</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/fitur-xyz" className={menuClass}>
                  <FaCogs /> <span>Fitur Xyz</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/notes" className={menuClass}>
                  <FaRegStickyNote /> <span>Notes</span>
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="mt-10 text-[10px] text-gray-400 uppercase font-bold px-4">Member Menu</li>

              <li>
                <NavLink to="/member/orders" className={menuClass}>
                  <FaShoppingCart /> <span>My Orders</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/member/new-order" className={menuClass}>
                  <FaPlusCircle /> <span>New Order</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Logout Button */}
      <button
        onClick={signOut}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold"
      >
        <FaSignOutAlt /> <span>Logout</span>
      </button>

      <div className="text-xs text-gray-400">
        &copy; 2026 Nabilla Suharman
      </div>
    </div>
  );
}