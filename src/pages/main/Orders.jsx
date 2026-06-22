import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { supabase } from "../../lib/supabase";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Failed to update status: ' + error.message);
      return;
    }

    // If status changed to Completed, award points to the member
    if (newStatus === 'Completed') {
      const order = orders.find(o => o.id === orderId);
      if (order && order.member_id) {
        const pointsEarned = Math.floor(Number(order.total_amount) / 10000);

        // Get current points
        const { data: profile } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', order.member_id)
          .single();

        if (profile) {
          // Update points (tier auto-updates via DB trigger)
          await supabase
            .from('profiles')
            .update({ points: profile.points + pointsEarned })
            .eq('id', order.member_id);

          // Update points_earned on the order
          await supabase
            .from('orders')
            .update({ points_earned: pointsEarned })
            .eq('id', orderId);
        }
      }
    }

    loadOrders();
  };

  return (
    <div>
      <PageHeader title="Order List" breadcrumb="Orders">
        <button className="bg-hijau text-white px-6 py-2 rounded-xl font-bold shadow-lg">
          + Add New Order
        </button>
      </PageHeader>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading orders...</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-400">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer Name</th>
                <th className="p-4 font-medium">Total Amount</th>
                <th className="p-4 font-medium">Discount</th>
                <th className="p-4 font-medium">Points Earned</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">No orders found</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold">#{o.id.slice(0, 8)}</td>
                    <td className="p-4 font-semibold text-gray-700">{o.profiles?.full_name || o.profiles?.email || 'Unknown'}</td>
                    <td className="p-4 font-bold text-gray-800">Rp {Number(o.total_amount).toLocaleString("id-ID")}</td>
                    <td className="p-4 text-gray-500">Rp {Number(o.discount_applied).toLocaleString("id-ID")}</td>
                    <td className="p-4 text-gray-500">{o.points_earned}</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`px-3 py-1 rounded-md text-xs font-bold border-0 cursor-pointer ${
                          o.status === 'Completed' ? 'bg-green-100 text-green-600' :
                          o.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}