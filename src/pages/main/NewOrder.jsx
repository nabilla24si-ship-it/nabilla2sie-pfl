import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineShoppingCart } from "react-icons/ai";

const TIER_DISCOUNT = {
    Bronze: 0.05,
    Silver: 0.10,
    Gold: 0.15,
    Platinum: 0.20,
};

export default function NewOrder() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({}); // { productId: quantity }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .gt('stock', 0)
            .order('name', { ascending: true });

        if (!error && data) {
            setProducts(data);
        }
        setLoading(false);
    };

    const updateQuantity = (productId, delta) => {
        setCart((prev) => {
            const currentQty = prev[productId] || 0;
            const newQty = Math.max(0, currentQty + delta);
            const product = products.find(p => p.id === productId);
            const maxStock = product?.stock || 0;

            if (newQty === 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }

            if (newQty > maxStock) return prev;

            return { ...prev, [productId]: newQty };
        });
    };

    const cartItems = Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return { product, quantity, subtotal: Number(product.price) * quantity };
    });

    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountRate = TIER_DISCOUNT[profile?.tier] || 0.05;
    const discountAmount = Math.floor(subtotal * discountRate);
    const grandTotal = subtotal - discountAmount;
    const pointsToEarn = Math.floor(grandTotal / 10000);

    const handleSubmit = async () => {
        if (cartItems.length === 0) {
            setError("Your cart is empty. Add at least one product.");
            return;
        }

        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            // 1. Create the order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    member_id: user.id,
                    total_amount: grandTotal,
                    discount_applied: discountAmount,
                    points_earned: pointsToEarn,
                    status: 'Completed',
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create order items
            const orderItems = cartItems.map((item) => ({
                order_id: order.id,
                product_id: item.product.id,
                quantity: item.quantity,
                price_at_purchase: Number(item.product.price),
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Reduce product stock
            for (const item of cartItems) {
                await supabase
                    .from('products')
                    .update({ stock: item.product.stock - item.quantity })
                    .eq('id', item.product.id);
            }

            // 4. Award points to member (tier auto-updates via DB trigger)
            const { data: currentProfile } = await supabase
                .from('profiles')
                .select('points')
                .eq('id', user.id)
                .single();

            if (currentProfile) {
                await supabase
                    .from('profiles')
                    .update({ points: currentProfile.points + pointsToEarn })
                    .eq('id', user.id);
            }

            setSuccess(`Order placed successfully! You earned ${pointsToEarn} points.`);
            setCart({});

            setTimeout(() => navigate("/member/orders"), 2000);
        } catch (err) {
            setError("Failed to place order: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader title="New Order" breadcrumb="Member / New Order" />

            {/* Tier Info Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-2xl mb-6 flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-80">Your Tier Discount</p>
                    <p className="text-xl font-bold">{profile?.tier} ({(discountRate * 100).toFixed(0)}% off)</p>
                </div>
                <div className="text-right">
                    <p className="text-sm opacity-80">Current Points</p>
                    <p className="text-xl font-bold">{profile?.points || 0}</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-200 mb-4 p-4 text-sm rounded-xl text-red-700">{error}</div>
            )}
            {success && (
                <div className="bg-green-200 mb-4 p-4 text-sm rounded-xl text-green-700">{success}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product List */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-700">Available Products</h3>
                    </div>
                    {loading ? (
                        <p className="text-gray-400 text-center py-8">Loading products...</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {products.map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{product.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Rp {Number(product.price).toLocaleString("id-ID")} &middot; Stock: {product.stock}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {cart[product.id] ? (
                                            <>
                                                <button
                                                    onClick={() => updateQuantity(product.id, -1)}
                                                    className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
                                                >
                                                    <AiOutlineMinus />
                                                </button>
                                                <span className="font-bold w-6 text-center">{cart[product.id]}</span>
                                                <button
                                                    onClick={() => updateQuantity(product.id, 1)}
                                                    className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                                                >
                                                    <AiOutlinePlus />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => updateQuantity(product.id, 1)}
                                                className="px-4 py-2 rounded-xl bg-hijau text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AiOutlineShoppingCart className="text-hijau text-xl" />
                        <h3 className="font-bold text-gray-700">Cart Summary</h3>
                    </div>

                    {cartItems.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">Cart is empty</p>
                    ) : (
                        <div className="space-y-3 mb-4">
                            {cartItems.map((item) => (
                                <div key={item.product.id} className="flex justify-between text-sm">
                                    <span className="text-gray-600 truncate mr-2">
                                        {item.product.name} x{item.quantity}
                                    </span>
                                    <span className="font-semibold text-gray-800 whitespace-nowrap">
                                        Rp {item.subtotal.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-semibold">Rp {subtotal.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Discount ({profile?.tier} {(discountRate * 100).toFixed(0)}%)</span>
                            <span className="font-semibold text-green-600">- Rp {discountAmount.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2">
                            <span>Total</span>
                            <span className="text-hijau">Rp {grandTotal.toLocaleString("id-ID")}</span>
                        </div>
                        <p className="text-xs text-gray-400 text-right">
                            You will earn <span className="font-bold text-hijau">{pointsToEarn}</span> points
                        </p>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting || cartItems.length === 0}
                        className="w-full mt-6 bg-hijau text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Processing..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
}
