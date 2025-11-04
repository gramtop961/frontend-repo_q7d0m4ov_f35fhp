import { ShoppingCart } from "lucide-react";

export default function Header({ onCartClick, cartCount }) {
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center font-bold">
            B&B
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Bits&Bites</h1>
            <p className="text-xs opacity-90">Tasty. Fast. Fun.</p>
          </div>
        </div>
        <button
          onClick={onCartClick}
          className="relative inline-flex items-center gap-2 bg-white text-indigo-600 rounded-full px-4 py-2 font-semibold shadow hover:shadow-md transition"
        >
          <ShoppingCart className="w-5 h-5" />
          Cart
          <span className="ml-1 inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-indigo-600 text-white">
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
}
