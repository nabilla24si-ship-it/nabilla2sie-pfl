import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Loading from "./components/Loading";

// Lazy load pages
const Dashboard = React.lazy(() => import("./pages/main/Dashboard"));
const Orders = React.lazy(() => import("./pages/main/Orders"));
const Customers = React.lazy(() => import("./pages/main/Customers"));
const NotFound = React.lazy(() => import("./pages/main/NotFound"));
const Components = React.lazy(() => import("./pages/main/Components"));
const Products = React.lazy(() => import("./pages/main/Products")); 
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));

// 1. TAMBAHAN LAZY LOAD UNTUK FITUR XYZ
const FiturXyz = React.lazy(() => import("./pages/main/FiturXyz"));

const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} /> 
          <Route path="/products/:id" element={<ProductDetail />} /> 
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/components" element={<Components />} />
          
          {/* 2. TAMBAHAN ROUTE UNTUK FITUR XYZ */}
          <Route path="/fitur-xyz" element={<FiturXyz />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  );
}