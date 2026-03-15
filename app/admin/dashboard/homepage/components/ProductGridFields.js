import { PRODUCT_GRID_SOURCES } from "../constants";

export default function ProductGridFields({ values, onChange }) {
  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
      <select
        value={values.source}
        onChange={(event) => onChange("source", event.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      >
        {PRODUCT_GRID_SOURCES.map((source) => (
          <option key={source.value} value={source.value}>{source.label}</option>
        ))}
      </select>
      <input
        type="number"
        min={1}
        value={values.limit}
        onChange={(event) => onChange("limit", Number(event.target.value || 0))}
        placeholder="Product limit"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <input
        value={values.productIds}
        onChange={(event) => onChange("productIds", event.target.value)}
        placeholder="Product IDs (comma separated)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
      />
      {values.source === "category" && (
        <input
          value={values.categoryId}
          onChange={(event) => onChange("categoryId", event.target.value)}
          placeholder="Category ID (required for category source)"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
        />
      )}
    </div>
  );
}
