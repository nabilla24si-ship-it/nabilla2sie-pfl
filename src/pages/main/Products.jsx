import PageHeader from "../../components/PageHeader";
import { Link } from "react-router-dom"; // Jangan lupa import Link untuk dynamic route

export default function Products() {
  // Membuat 30 data dummy produk
  const productsData = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1, // ID (1-30) ini penting untuk fetch axios ke dummyjson di halaman detail nanti
    code: `PRD-${1000 + i + 1}`,
    title: ["Laptop Gaming", "Smartphone", "Headphone", "Smartwatch"][i % 4] + ` V${i + 1}`,
    category: ["Elektronik", "Aksesoris", "Gadget"][i % 3],
    brand: ["TechCorp", "InnoBrand", "SoundMax", "WearPlus"][i % 4],
    price: (Math.floor(Math.random() * 150) + 10) * 100000, // Generate harga random
    stock: Math.floor(Math.random() * 50) + 1 // Generate stok random
  }));

  return (
    <div>
      <PageHeader title="Product List" breadcrumb="Products">
        <button className="bg-hijau text-white px-6 py-2 rounded-xl font-bold shadow-lg">
          + Add New Product
        </button>
      </PageHeader>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-gray-400">
              <th className="p-4 font-medium">Code</th>
              <th className="p-4 font-medium">Product Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Brand</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {productsData.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-500">{p.code}</td>
                
                {/* INI ADALAH BAGIAN DYNAMIC ROUTE-NYA */}
                <td className="p-4 font-semibold">
                  <Link 
                    to={`/products/${p.id}`} 
                    className="text-emerald-500 hover:text-emerald-700 underline"
                  >
                    {p.title}
                  </Link>
                </td>
                
                <td className="p-4 text-gray-700">{p.category}</td>
                <td className="p-4 text-gray-700">{p.brand}</td>
                <td className="p-4 font-bold text-gray-800">
                  Rp {p.price.toLocaleString("id-ID")}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                    p.stock > 10 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {p.stock}
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