import { FaThLarge, FaList, FaHeadphonesAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-xl p-4 space-x-3 transition-all
    ${isActive ? 
        "text-hijau bg-green-200 font-extrabold shadow-sm" : 
        "text-gray-500 hover:text-hijau hover:bg-green-100"
    }`;

  return (
    <div id="sidebar" className="w-[280px] bg-white border-r min-h-screen p-6 flex flex-column gap-6">
      <div id="sidebar-logo" className="mb-8">
        <span id="logo-title" className="text-2xl font-bold">Sedap <b className="text-hijau">.</b></span>
        <p className="text-gray-400 text-sm">Modern Admin Dashboard</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 list-none p-0">

            <li className="mt-10 text-[10px] text-gray-400 uppercase font-bold px-4">Test Errors</li>
<li><NavLink to="/error-400" className={menuClass}>Error 400</NavLink></li>
<li><NavLink to="/error-401" className={menuClass}>Error 401</NavLink></li>
<li><NavLink to="/error-403" className={menuClass}>Error 403</NavLink></li>
          <li>
            <NavLink to="/" className={menuClass}>
              <FaThLarge /> <span>Dashboard</span>
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
        </ul>
      </nav>
      
      <div className="text-xs text-gray-400">
        © 2026 Nabilla Suharman
      </div>
    </div>
  );
}