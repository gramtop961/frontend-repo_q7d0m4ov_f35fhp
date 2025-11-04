import { useMemo, useState } from "react";
import Header from "./components/Header";
import OffersBanner from "./components/OffersBanner";
import Menu from "./components/Menu";
import CartDrawer from "./components/CartDrawer";

// Resolve backend base URL with strong preference for environment variable.
function getBackendBase() {
  // Highest priority: explicit env var
  const envBase = import.meta.env.VITE_BACKEND_URL;
  if (envBase && typeof envBase === "string" && envBase.trim().length > 0) {
    return envBase.replace(/\/$/, "");
  }
  // Optional global override if someone injected it via index.html
  const globalBase = typeof window !== "undefined" && window.__BACKEND_URL__;
  if (globalBase && typeof globalBase === "string" && globalBase.trim().length > 0) {
    return globalBase.replace(/\/$/, "");
  }
  // Fallback: same host with port swap (works in local dev)
  try {
    const url = new URL(window.location.href);
    const host = url.host.replace(/:3000$/, ":8000");
    return `${url.protocol}//${host}`;
  } catch {
    return ""; // Unable to resolve automatically in this hosting setup
  }
}

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState([]);

  const count = useMemo(() => items.reduce((n, it) => n + it.quantity, 0), [items]);

  const addToCart = (item) => {
    const idx = items.findIndex((it) => it.name === item.name);
    if (idx >= 0) {
      const next = items.slice();
      next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
      setItems(next);
    } else {
      setItems([...items, { ...item, quantity: 1 }]);
    }
  };

  const submitOrder = async ({ name, phone, method, note, items, subtotal, discount, total }) => {
    const base = getBackendBase();
    if (!base) {
      throw new Error(
        "Backend URL not configured. Set VITE_BACKEND_URL to your FastAPI base URL and reload."
      );
    }

    const body = {
      customer_name: name,
      contact_number: phone,
      payment_method: method,
      items: items.map((it) => ({ name: it.name, price: it.price, quantity: it.quantity })),
      subtotal,
      discount,
      total,
      notes: note,
    };

    // Add a fetch timeout to avoid hanging requests that surface as generic errors
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(`${base}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Order failed (${res.status})`);
      }
      return res.json();
    } catch (err) {
      if (err?.name === "AbortError") {
        throw new Error("Request timed out. Please check your connection and try again.");
      }
      // Surface clearer network guidance when fetch cannot connect
      if (String(err?.message || "").includes("Failed to fetch")) {
        throw new Error(
          "Could not reach the server. Ensure the backend is running and VITE_BACKEND_URL points to it."
        );
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-rose-50">
      <Header onCartClick={() => setCartOpen(true)} cartCount={count} />

      <OffersBanner />

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl p-4 bg-gradient-to-r from-pink-100 via-indigo-100 to-emerald-100 border border-white shadow-sm">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">Menu</h2>
          <p className="text-sm text-gray-600">
            Add items to your cart and checkout with Cash on Delivery or UPI.
          </p>
        </div>
      </section>

      <Menu onAdd={addToCart} />

      <CartDrawer
        open={cartOpen}
        items={items}
        setItems={setItems}
        onClose={() => setCartOpen(false)}
        onSubmit={submitOrder}
      />

      <footer className="mt-16 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Bits&Bites. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
