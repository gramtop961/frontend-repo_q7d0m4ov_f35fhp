import { useEffect, useState } from "react";
import CategorySection from "./CategorySection";

function getBackendBase() {
  const envBase = import.meta.env.VITE_BACKEND_URL;
  if (envBase && typeof envBase === "string" && envBase.trim().length > 0) {
    return envBase.replace(/\/$/, "");
  }
  const globalBase = typeof window !== "undefined" && window.__BACKEND_URL__;
  if (globalBase && typeof globalBase === "string" && globalBase.trim().length > 0) {
    return globalBase.replace(/\/$/, "");
  }
  // Fallback helpful in local dev
  try {
    const url = new URL(window.location.href);
    const host = url.host.replace(/:3000$/, ":8000");
    return `${url.protocol}//${host}`;
  } catch {
    return "";
  }
}

export default function Menu({ onAdd }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const base = getBackendBase();
        if (!base) {
          throw new Error(
            "Backend URL not configured. Set VITE_BACKEND_URL to your FastAPI base URL and reload."
          );
        }
        const res = await fetch(`${base}/products`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load menu (${res.status})`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        if (e?.name === "AbortError") return;
        const msg = e?.message || "Error";
        setError(
          msg.includes("Failed to fetch")
            ? "Could not reach the server. Ensure the backend is running and VITE_BACKEND_URL is set."
            : msg
        );
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  if (loading) return <p className="p-4">Loading menu...</p>;
  if (error)
    return (
      <div className="p-4">
        <p className="text-rose-600">{error}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {data.map((cat) => (
        <CategorySection key={cat.category} title={cat.category} items={cat.items} onAdd={onAdd} />
      ))}
    </div>
  );
}
