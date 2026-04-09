export default function TrendingProductsFields({ values, onChange }) {
  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
      <input
        type="number"
        min={1}
        value={values.limit}
        onChange={(event) => onChange("limit", Number(event.target.value || 0))}
        placeholder="Product limit"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <input
        type="number"
        min={1}
        value={values.windowDays}
        onChange={(event) => onChange("windowDays", Number(event.target.value || 0))}
        placeholder="Window days"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <input
        value={values.categoryId}
        onChange={(event) => onChange("categoryId", event.target.value)}
        placeholder="Category ID (optional)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
      />

      <input
        type="number"
        min={0}
        step="0.1"
        value={values.salesWeight}
        onChange={(event) => onChange("salesWeight", event.target.value === "" ? "" : Number(event.target.value))}
        placeholder="Sales weight"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <input
        type="number"
        min={0}
        step="0.1"
        value={values.wishlistWeight}
        onChange={(event) => onChange("wishlistWeight", event.target.value === "" ? "" : Number(event.target.value))}
        placeholder="Wishlist weight"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <input
        type="number"
        min={0}
        step="0.1"
        value={values.viewWeight}
        onChange={(event) => onChange("viewWeight", event.target.value === "" ? "" : Number(event.target.value))}
        placeholder="View weight"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
      />
    </div>
  );
}
