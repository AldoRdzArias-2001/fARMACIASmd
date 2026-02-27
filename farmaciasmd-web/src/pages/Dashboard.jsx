import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>
      <p>Sesión: {user?.name} ({user?.email})</p>
      <button onClick={signOut}>Cerrar sesión</button>
    </div>
  );
}