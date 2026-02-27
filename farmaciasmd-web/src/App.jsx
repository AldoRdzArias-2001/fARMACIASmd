import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductsList from "./pages/ProductsList";
import ProductForm from "./pages/ProductForm";

function Layout({ children }) {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: "1px solid #333", display: "flex", gap: 10 }}>
        <Link to="/">Dashboard</Link>
        <Link to="/products">Productos</Link>
      </nav>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout><Dashboard /></Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/products"
            element={
              <RequireAuth>
                <Layout><ProductsList /></Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/products/new"
            element={
              <RequireAuth>
                <Layout><ProductForm /></Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/products/:id/edit"
            element={
              <RequireAuth>
                <Layout><ProductForm /></Layout>
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}