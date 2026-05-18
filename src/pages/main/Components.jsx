import { useState } from "react";
import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import Badge from "../../components/Badge";
import Avatar from "../../components/Avatar";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ProductCard from "../../components/ProductCard";
import Table from "../../components/Table";

export default function Components() {
  const headers = ["No", "Nama Produk", "Kategori", "Harga", "Aksi"];
  const products = [
    { id: 1, name: "Laptop Asus", category: "Elektronik", price: "Rp 8.000.000" },
    { id: 2, name: "Sepatu Sport", category: "Fashion", price: "Rp 450.000" },
    { id: 3, name: "Jam Tangan", category: "Aksesoris", price: "Rp 799.000" }
  ];

  return (
    <div id="dashboard-container" className="min-h-screen flex flex-col justify-between bg-gray-50">
      
      <Container>
        {/* <PageHeader title="Components" /> */}
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Katalog Komponen</h1>
        <p className="mb-6 text-gray-600">Kumpulan komponen UI dari Basic, Layout, hingga Data Display.</p>

        <hr className="mb-8 border-gray-200" />

        {/* SECTION 1: BASIC COMPONENTS */}
        <section className="mb-10">
          
          <div className="grid gap-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Buttons</h3>
              <div className="flex gap-2 flex-wrap">
                <Button>Simpan</Button>
                <Button type="danger">Hapus</Button>
                <Button type="secondary">Edit</Button>
                <Button type="warning">Cetak</Button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Badges (Status)</h3>
              <div className="flex gap-2">
                <Badge type="success">Aktif</Badge>
                <Badge type="warning">Pending</Badge>
                <Badge type="danger">Batal</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Avatars</h3>
              <div className="flex gap-2">
                <Avatar name="Fikri" />
                <Avatar name="Surya" />
                <Avatar name="Ningsih" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: DATA DISPLAY - CARDS */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductCard
              image="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
              title="Sepatu Sport"
              category="Fashion"
              price="Rp 450.000"
              description="Sepatu sport modern dengan desain nyaman dan ringan untuk aktivitas sehari-hari."
            />

            <ProductCard
              image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
              title="Smartphone"
              category="Elektronik"
              price="Rp 4.500.000"
              description="Smartphone dengan performa cepat, kamera jernih, dan baterai tahan lama."
            />
          </div>
        </section>

        {/* SECTION 3: DATA DISPLAY - TABLE */}
        <section className="mb-6">
          
          <Table headers={headers}>
            {products.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 border-r border-gray-200">{index + 1}</td>
                <td className="px-6 py-4 border-r border-gray-200 font-medium text-gray-800">{product.name}</td>
                <td className="px-6 py-4 border-r border-gray-200">
                  <Badge type={product.category === "Elektronik" ? "primary" : "secondary"}>
                    {product.category}
                  </Badge>
                </td>
                <td className="px-6 py-4 border-r border-gray-200 font-semibold">{product.price}</td>
                <td className="px-6 py-4">
                  <Button type="primary">Detail</Button>
                </td>
              </tr>
            ))}
          </Table>
        </section>

      </Container>

      <Footer />
      
    </div>
  );
}