import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Auctions from "./pages/auctions/Auctions";
import AuctionRoom from "./pages/auctions/AuctionRoom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/auctions" element={
        <ProtectedRoute>
          <Layout><Auctions /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/auction/:id" element={
        <ProtectedRoute>
          <Layout><AuctionRoom /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout><Profile /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <AdminRoute>
          <Layout><AdminDashboard /></Layout>
        </AdminRoute>
      } />

      <Route path="/" element={<Navigate to="/auctions" replace />} />
    </Routes>
  );
}

export default App;