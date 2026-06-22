import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages - Admin
const Dashboard = React.lazy(() => import("./pages/main/Dashboard"));
const Orders = React.lazy(() => import("./pages/main/Orders"));
const Customers = React.lazy(() => import("./pages/main/Customers"));
const NotFound = React.lazy(() => import("./pages/main/NotFound"));
const Components = React.lazy(() => import("./pages/main/Components"));
const Products = React.lazy(() => import("./pages/main/Products"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const FiturXyz = React.lazy(() => import("./pages/main/FiturXyz"));
const Notes = React.lazy(() => import("./pages/main/Notes"));

// Lazy load pages - Member
const MemberOrders = React.lazy(() => import("./pages/main/MemberOrders"));
const NewOrder = React.lazy(() => import("./pages/main/NewOrder"));

// Lazy load pages - Auth
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Admin Routes (require Admin role) */}
        <Route element={<ProtectedRoute requiredRole="Admin" />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/components" element={<Components />} />
            <Route path="/fitur-xyz" element={<FiturXyz />} />
            <Route path="/notes" element={<Notes />} />
          </Route>
        </Route>

        {/* Member Routes (require Member role) */}
        <Route element={<ProtectedRoute requiredRole="Member" />}>
          <Route element={<MainLayout />}>
            <Route path="/member/orders" element={<MemberOrders />} />
            <Route path="/member/new-order" element={<NewOrder />} />
          </Route>
        </Route>

        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}