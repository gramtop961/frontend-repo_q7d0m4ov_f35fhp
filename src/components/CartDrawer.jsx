import { useMemo, useState } from "react";

export default function CartDrawer({ open, items, setItems, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("COD"); // COD or UPI
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );
  const discount = 0;
  const total = Math.max(subtotal - discount, 0);

  const updateQty = (idx, delta) => {
    const next = items.map((it, i) =>
      i === idx ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it
    );
    setItems(next);
  };

  const removeItem = (idx) => {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
  };

  const handleSubmit = async () => {
    setMessage(null);
    if (!name.trim() || !phone.trim()) {
      setMessage({ type: "error", text: "Please enter your name and contact number." });
      return;
    }
    if (items.length === 0) {
      setMessage({ type: "error", text: "Your cart is empty." });
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name, phone, method, note, items, subtotal, discount, total });
      setMessage({ type: "success", text: "Order placed! We'll contact you shortly." });
      // Clear cart and form
      setItems([]);
      setName("");
      setPhone("");
      setMethod("COD");
      setNote("");
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "Failed to place order" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-30 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">Your Cart</h3>
          <button onClick={onClose} className="text-indigo-600 font-semibold">Close</button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto max-h-[40vh]">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            items.map((it, idx) => (
              <div key={`${it.name}-${idx}`} className="flex items-center justify-between gap-3 border rounded-xl p-3">
                <div>
                  <p className="font-semibold text-gray-900">{it.name}</p>
                  <p className="text-indigo-600 font-bold">₹{it.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded bg-gray-100"
                    onClick={() => updateQty(idx, -1)}
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{it.quantity}</span>
                  <button
                    className="px-2 py-1 rounded bg-gray-100"
                    onClick={() => updateQty(idx, 1)}
                  >
                    +
                  </button>
                  <button
                    className="ml-2 text-sm text-rose-600 font-semibold"
                    onClick={() => removeItem(idx)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Subtotal</div>
            <div className="text-right font-semibold">₹{subtotal.toFixed(2)}</div>
            <div className="text-gray-500">Discount</div>
            <div className="text-right font-semibold text-emerald-600">₹{discount.toFixed(2)}</div>
            <div className="text-gray-900 font-bold">Total</div>
            <div className="text-right font-extrabold text-indigo-600">₹{total.toFixed(2)}</div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold">Your details</h4>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="tel"
              placeholder="Contact number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            <textarea
              placeholder="Optional notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">Payment method</h4>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={method === "COD"}
                  onChange={() => setMethod("COD")}
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={method === "UPI"}
                  onChange={() => setMethod("UPI")}
                />
                <span>UPI</span>
              </label>
            </div>
          </div>

          {message && (
            <div
              className={`${
                message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              } px-3 py-2 rounded-lg text-sm`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || items.length === 0}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Placing order..." : `Place Order (₹${total.toFixed(2)})`}
          </button>
        </div>
      </aside>
    </div>
  );
}
