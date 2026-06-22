import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function MemberOrders() {
    const { user, profile } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        if (user) loadOrders();
    }, [user]);

    const loadOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, products(name, image_url))')
            .eq('member_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
        setLoading(false);
    };

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    // Tier discount info card
    const tierDiscount = {
        Bronze: 5,
        Silver: 10,
        Gold: 15,
        Platinum: 20,
    };

    return (
        <div>
            <PageHeader title="My Orders" breadcrumb="Member / Orders">
                <div className="flex items-center gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <span className="text-sm text-gray-500">Your Tier:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                            profile?.tier === 'Platinum' ? 'bg-purple-100 text-purple-600' :
                            profile?.tier === 'Gold' ? 'bg-yellow-100 text-yellow-600' :
                            profile?.tier === 'Silver' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                            {profile?.tier} ({tierDiscount[profile?.tier] || 5}% off)
                        </span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <span className="text-sm text-gray-500">Points:</span>
                        <span className="ml-2 font-bold text-hijau">{profile?.points || 0}</span>
                    </div>
                </div>
            </PageHeader>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                {loading ? (
                    <p className="text-gray-400 text-center py-8">Loading your orders...</p>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-400 text-lg mb-2">You haven't placed any orders yet</p>
                        <p className="text-gray-400 text-sm">Head to "New Order" to make your first purchase!</p>
                    </div>
                ) : (
                    <table className="w-full text-left min-w-[640px]">
                        <thead className="bg-gray-50">
                            <tr className="text-gray-400">
                                <th className="p-4 font-medium"></th>
                                <th className="p-4 font-medium">Order ID</th>
                                <th className="p-4 font-medium">Total Amount</th>
                                <th className="p-4 font-medium">Discount</th>
                                <th className="p-4 font-medium">Points Earned</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((o) => (
                                <>
                                    <tr key={o.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(o.id)}>
                                        <td className="p-4">
                                            {expandedOrder === o.id ?
                                                <FaChevronUp className="text-gray-400" /> :
                                                <FaChevronDown className="text-gray-400" />
                                            }
                                        </td>
                                        <td className="p-4 font-bold">#{o.id.slice(0, 8)}</td>
                                        <td className="p-4 font-bold text-gray-800">Rp {Number(o.total_amount).toLocaleString("id-ID")}</td>
                                        <td className="p-4 text-green-600">- Rp {Number(o.discount_applied).toLocaleString("id-ID")}</td>
                                        <td className="p-4">
                                            <span className="text-hijau font-bold">+{o.points_earned}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                o.status === 'Completed' ? 'bg-green-100 text-green-600' :
                                                o.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                                    </tr>

                                    {/* Expanded Order Items */}
                                    {expandedOrder === o.id && o.order_items && (
                                        <tr key={`${o.id}-items`}>
                                            <td colSpan="7" className="p-0">
                                                <div className="bg-gray-50 px-8 py-4">
                                                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Order Items:</h4>
                                                    <table className="w-full text-left">
                                                        <thead>
                                                            <tr className="text-gray-400 text-xs">
                                                                <th className="pb-2 font-medium">Product</th>
                                                                <th className="pb-2 font-medium">Price</th>
                                                                <th className="pb-2 font-medium">Qty</th>
                                                                <th className="pb-2 font-medium">Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {o.order_items.map((item) => (
                                                                <tr key={item.id}>
                                                                    <td className="py-2 font-medium text-gray-700">{item.products?.name || 'Product'}</td>
                                                                    <td className="py-2 text-gray-500">Rp {Number(item.price_at_purchase).toLocaleString("id-ID")}</td>
                                                                    <td className="py-2 text-gray-500">{item.quantity}</td>
                                                                    <td className="py-2 font-bold text-gray-700">Rp {(Number(item.price_at_purchase) * item.quantity).toLocaleString("id-ID")}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
