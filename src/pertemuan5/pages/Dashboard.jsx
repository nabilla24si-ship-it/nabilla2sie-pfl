import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaUserFriends } from "react-icons/fa";

export default function Dashboard() {
    // Data Dummy untuk Tabel
    const customers = [
        { id: "#001", name: "Nabilla Suharman", menu: "Nasi Goreng Spesial", status: "Success" },
        { id: "#002", name: "Andi Wijaya", menu: "Mie Ayam Bakso", status: "Pending" },
        { id: "#003", name: "Siti Aminah", menu: "Es Teh Manis", status: "Canceled" },
    ];

    return (
        <div id="dashboard-container">
            {/* Stats Cards */}
            <div id="dashboard-grid">
                <div id="dashboard-orders">
                    <div id="orders-icon"><FaShoppingCart /></div>
                    <div id="orders-info">
                        <span id="orders-count">75</span>
                        <span id="orders-text">Total Orders</span>
                    </div>
                </div>
                <div id="dashboard-delivered">
                    <div id="delivered-icon"><FaTruck /></div>
                    <div id="delivered-info">
                        <span id="delivered-count">175</span>
                        <span id="delivered-text">Total Delivered</span>
                    </div>
                </div>
                <div id="dashboard-canceled">
                    <div id="canceled-icon"><FaBan /></div>
                    <div id="canceled-info">
                        <span id="canceled-count">40</span>
                        <span id="canceled-text">Total Canceled</span>
                    </div>
                </div>
                <div id="dashboard-revenue">
                    <div id="revenue-icon"><FaDollarSign /></div>
                    <div id="revenue-info">
                        <span id="revenue-amount">Rp.128</span>
                        <span id="revenue-text">Total Revenue</span>
                    </div>
                </div>
            </div>

            {/* TABEL RECENT CUSTOMERS (IMPROVISASI 2) */}
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <FaUserFriends className="text-hijau text-xl" />
                    <h3 className="text-xl font-bold">Recent Customers Activity</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-50">
                                <th className="pb-4 font-medium">Customer Name</th>
                                <th className="pb-4 font-medium">Order ID</th>
                                <th className="pb-4 font-medium">Menu Item</th>
                                <th className="pb-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {customers.map((c, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 font-semibold">{c.name}</td>
                                    <td className="py-4 text-gray-500">{c.id}</td>
                                    <td className="py-4 text-gray-500">{c.menu}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            c.status === 'Success' ? 'bg-green-100 text-green-600' : 
                                            c.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}