import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div style={{ padding: 16 }}>Cargando...</div>;
  return user ? children : <Navigate to="/login" replace />;
}