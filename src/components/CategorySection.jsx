export default function CategorySection({ title, items, onAdd }) {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-indigo-700">
        {title}
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={`${title}-${item.name}`}
            className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <p className="text-indigo-600 font-bold mt-1">₹{item.price}</p>
              </div>
              <button
                onClick={() => onAdd({ name: item.name, price: item.price })}
                className="shrink-0 inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
