export default function RecentlyViewedFields({ values, onChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm text-slate-600">
        Max products
        <input
          type="number"
          min="1"
          max="24"
          value={values.limit}
          onChange={(event) => onChange("limit", event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
          placeholder="10"
        />
        <span className="mt-1 block text-xs text-slate-500">
          Number of recently viewed products to show on homepage.
        </span>
      </label>
    </div>
  );
}
