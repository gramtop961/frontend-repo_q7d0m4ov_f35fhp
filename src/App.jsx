import { useMemo, useState } from "react";
import Header from "./components/Header";
import OffersBanner from "./components/OffersBanner";
import Menu from "./components/Menu";
import CartDrawer from "./components/CartDrawer";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState([]);

  const count = useMemo(() => items.reduce((n, it) => n + it.quantity, 0), [items]);

  const addToCart = (item) => {
    // If item exists, increase quantity
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
    const base = import.meta.env.VITE_BACKEND_URL;
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

    const res = await fetch(`${base}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || "Order failed");
    }
    return res.json();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-rose-50">
      <Header onCartClick={() => setCartOpen(true)} cartCount={count} />

      <OffersBanner />

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl p-4 bg-gradient-to-r from-pink-100 via-indigo-100 to-emerald-100 border border-white shadow-sm">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">
            Menu
          </h2>
          <p className="text-sm text-gray-600">Add items to your cart and checkout with Cash on Delivery or UPI.</p>
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
