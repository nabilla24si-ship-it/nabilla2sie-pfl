import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        image_url: "",
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProducts(data);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            stock: Number(form.stock),
            image_url: form.image_url || null,
        };

        if (editingId) {
            await supabase.from('products').update(payload).eq('id', editingId);
        } else {
            await supabase.from('products').insert(payload);
        }

        setShowForm(false);
        setEditingId(null);
        setForm({ name: "", description: "", price: "", stock: "", image_url: "" });
        loadProducts();
    };

    const handleEdit = (product) => {
        setForm({
            name: product.name,
            description: product.description || "",
            price: String(product.price),
            stock: String(product.stock),
            image_url: product.image_url || "",
        });
        setEditingId(product.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;
        await supabase.from('products').delete().eq('id', id);
        loadProducts();
    };

    return (
        <div>
            <PageHeader title="Product List" breadcrumb="Products">
                <button
                    onClick={() => {
                        setForm({ name: "", description: "", price: "", stock: "", image_url: "" });
                        setEditingId(null);
                        setShowForm(!showForm);
                    }}
                    className="bg-hijau text-white px-6 py-2 rounded-xl font-bold shadow-lg"
                >
                    {showForm ? "Cancel" : "+ Add New Product"}
                </button>
            </PageHeader>

            {/* Form Card */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Product" : "Add New Product"}</h3>
                    <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required className="p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required className="p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" required className="p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Image URL (optional)" className="p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none col-span-2" />
                        <button type="submit" className="bg-hijau text-white px-6 py-3 rounded-xl font-bold shadow-lg col-span-2">
                            {editingId ? "Update Product" : "Save Product"}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                {loading ? (
                    <p className="text-gray-400 text-center py-8">Loading products...</p>
                ) : (
                    <table className="w-full text-left min-w-[640px]">
                        <thead className="bg-gray-50">
                            <tr className="text-gray-400">
                                <th className="p-4 font-medium">Code</th>
                                <th className="p-4 font-medium">Product Name</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Stock</th>
                                <th className="p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">No products found</td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-500">{p.id.slice(0, 8).toUpperCase()}</td>
                                        <td className="p-4 font-semibold">
                                            <Link
                                                to={`/products/${p.id}`}
                                                className="text-emerald-500 hover:text-emerald-700 underline"
                                            >
                                                {p.name}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-gray-700 truncate max-w-xs">{p.description || '-'}</td>
                                        <td className="p-4 font-bold text-gray-800">
                                            Rp {Number(p.price).toLocaleString("id-ID")}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                                                p.stock > 10 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700">
                                                    <AiFillEdit className="text-lg" />
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
                                                    <AiFillDelete className="text-lg" />
                                                </button>
                                            </div>
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