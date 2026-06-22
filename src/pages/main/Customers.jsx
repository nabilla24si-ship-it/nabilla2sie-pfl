import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { supabase } from "../../lib/supabase";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCustomers(data);
    }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Customer List" breadcrumb="Customers">
        <button className="bg-hijau text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg">
          + Add New Customer
        </button>
      </PageHeader>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading customers...</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-gray-400 font-medium">Customer ID</th>
                <th className="p-4 text-gray-400 font-medium">Full Name</th>
                <th className="p-4 text-gray-400 font-medium">Email</th>
                <th className="p-4 text-gray-400 font-medium">Role</th>
                <th className="p-4 text-gray-400 font-medium">Points</th>
                <th className="p-4 text-gray-400 font-medium">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">No customers found</td>
                </tr>
              ) : (
                customers.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50/30 transition-colors">
                    <td className="p-4 font-bold text-hijau">{item.id.slice(0, 8).toUpperCase()}</td>
                    <td className="p-4 font-semibold text-gray-700">{item.full_name || '-'}</td>
                    <td className="p-4 text-gray-500">{item.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.role === 'Admin' ? 'bg-red-100 text-red-600' :
                        item.role === 'Member' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-700">{item.points}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.tier === 'Platinum' ? 'bg-purple-100 text-purple-600' :
                        item.tier === 'Gold' ? 'bg-yellow-100 text-yellow-600' :
                        item.tier === 'Silver' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {item.tier}
                      </span>
                    </td>
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