import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@farmaciasmd.local");
  const [password, setPassword] = useState("Admin1234!");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await signIn(email, password);
      nav("/", { replace: true });
    } catch (ex) {
      setErr(ex?.response?.data?.message ?? "Error al iniciar sesión");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 16 }}>
      <h2>FarmaciasMD - Login</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} style={{ width:"100%", marginBottom: 12 }} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{ width:"100%", marginBottom: 12 }} />
        {err && <div style={{ color:"crimson", marginBottom: 12 }}>{err}</div>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}