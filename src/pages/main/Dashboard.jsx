import { useState, useEffect } from "react";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaUserFriends } from "react-icons/fa";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalDelivered: 0,
        totalCanceled: 0,
        totalRevenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);

        // Fetch all orders for stats
        const { data: orders } = await supabase
            .from('orders')
            .select('total_amount, status');

        if (orders) {
            const totalOrders = orders.length;
            const totalDelivered = orders.filter(o => o.status === 'Completed').length;
            const totalCanceled = orders.filter(o => o.status === 'Cancelled').length;
            const totalRevenue = orders
                .filter(o => o.status === 'Completed')
                .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

            setStats({ totalOrders, totalDelivered, totalCanceled, totalRevenue });
        }

        // Fetch recent orders with profile info
        const { data: recent } = await supabase
            .from('orders')
            .select('id, status, total_amount, created_at, profiles(full_name)')
            .order('created_at', { ascending: false })
            .limit(5);

        if (recent) {
            setRecentOrders(recent);
        }

        setLoading(false);
    };

    return (
        <div id="dashboard-container">
            {/* Stats Cards */}
            <div id="dashboard-grid">
                <div id="dashboard-orders">
                    <div id="orders-icon"><FaShoppingCart /></div>
                    <div id="orders-info">
                        <span id="orders-count">{stats.totalOrders}</span>
                        <span id="orders-text">Total Orders</span>
                    </div>
                </div>
                <div id="dashboard-delivered">
                    <div id="delivered-icon"><FaTruck /></div>
                    <div id="delivered-info">
                        <span id="delivered-count">{stats.totalDelivered}</span>
                        <span id="delivered-text">Total Delivered</span>
                    </div>
                </div>
                <div id="dashboard-canceled">
                    <div id="canceled-icon"><FaBan /></div>
                    <div id="canceled-info">
                        <span id="canceled-count">{stats.totalCanceled}</span>
                        <span id="canceled-text">Total Canceled</span>
                    </div>
                </div>
                <div id="dashboard-revenue">
                    <div id="revenue-icon"><FaDollarSign /></div>
                    <div id="revenue-info">
                        <span id="revenue-amount">Rp {stats.totalRevenue.toLocaleString("id-ID")}</span>
                        <span id="revenue-text">Total Revenue</span>
                    </div>
                </div>
            </div>

            {/* TABEL RECENT CUSTOMERS */}
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <FaUserFriends className="text-hijau text-xl" />
                    <h3 className="text-xl font-bold">Recent Orders Activity</h3>
                </div>

                {loading ? (
                    <p className="text-gray-400 text-center py-8">Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-50">
                                    <th className="pb-4 font-medium">Order ID</th>
                                    <th className="pb-4 font-medium">Customer</th>
                                    <th className="pb-4 font-medium">Total Amount</th>
                                    <th className="pb-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-gray-400">
                                            No orders yet
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((o) => (
                                        <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 font-semibold">#{o.id.slice(0, 8)}</td>
                                            <td className="py-4 text-gray-500">{o.profiles?.full_name || 'Unknown'}</td>
                                            <td className="py-4 text-gray-500">Rp {Number(o.total_amount).toLocaleString("id-ID")}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    o.status === 'Completed' ? 'bg-green-100 text-green-600' :
                                                    o.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}