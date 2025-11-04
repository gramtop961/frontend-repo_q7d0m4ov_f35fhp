import { useEffect, useState } from "react";
import CategorySection from "./CategorySection";

function getBackendBase() {
  const envBase = import.meta.env.VITE_BACKEND_URL;
  if (envBase && typeof envBase === "string" && envBase.trim().length > 0) {
    return envBase.replace(/\/$/, "");
  }
  // Fallback: same host but backend port 8000
  try {
    const url = new URL(window.location.href);
    const host = url.host.replace(/:3000$/, ":8000");
    return `${url.protocol}//${host}`;
  } catch {
    return ""; // let fetch fail naturally if we truly can't determine
  }
}

export default function Menu({ onAdd }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const base = getBackendBase();
        const res = await fetch(`${base}/products`);
        if (!res.ok) throw new Error(`Failed to load menu (${res.status})`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e?.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-4">Loading menu...</p>;
  if (error) return <p className="p-4 text-rose-600">{error}</p>;

  return (
    <div className="space-y-6">
      {data.map((cat) => (
        <CategorySection
          key={cat.category}
          title={cat.category}
          items={cat.items}
          onAdd={onAdd}
        />)
      )}
    </div>
  );
}
