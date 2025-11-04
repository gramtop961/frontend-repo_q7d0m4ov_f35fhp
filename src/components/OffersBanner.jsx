export default function OffersBanner() {
  return (
    <section className="bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-500 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Offers & Discount Coupons
          </h2>
          <p className="mt-2 text-white/90">
            Sweet deals are cooking! A dedicated discounts section is coming soon
            to help you save on your favorite dishes. No coupon input required for now.
          </p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
          <ul className="text-sm space-y-1">
            <li>• Festival specials</li>
            <li>• Combo meal offers</li>
            <li>• Student savings</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
