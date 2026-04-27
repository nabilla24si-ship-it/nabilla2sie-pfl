import PageHeader from "../../components/PageHeader";

export default function Customers() {
  // Generate 30 Data JSON
  const customersData = Array.from({ length: 30 }).map((_, i) => ({
    id: `CUS-2026${String(i + 1).padStart(3, '0')}`,
    name: ["Nabilla Suharman", "Andi Wijaya", "Siti Aminah", "Budi Santoso", "Rian Hidayat"][i % 5],
    email: `customer${i + 1}@example.com`,
    phone: `0812-7000-${String(100 + i)}`,
    loyalty: i % 3 === 0 ? "Gold" : i % 3 === 1 ? "Silver" : "Bronze",
  }));

  return (
    <div>
      <PageHeader title="Customer List" breadcrumb="Customers">
        <button className="bg-hijau text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg">
          + Add New Customer
        </button>
      </PageHeader>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-gray-400 font-medium">Customer ID</th>
              <th className="p-4 text-gray-400 font-medium">Customer Name</th>
              <th className="p-4 text-gray-400 font-medium">Email</th>
              <th className="p-4 text-gray-400 font-medium">Phone</th>
              <th className="p-4 text-gray-400 font-medium">Loyalty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customersData.map((item) => (
              <tr key={item.id} className="hover:bg-green-50/30 transition-colors">
                <td className="p-4 font-bold text-hijau">{item.id}</td>
                <td className="p-4 font-semibold text-gray-700">{item.name}</td>
                <td className="p-4 text-gray-500">{item.email}</td>
                <td className="p-4 text-gray-500">{item.phone}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.loyalty === 'Gold' ? 'bg-yellow-100 text-yellow-600' : 
                    item.loyalty === 'Silver' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {item.loyalty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}