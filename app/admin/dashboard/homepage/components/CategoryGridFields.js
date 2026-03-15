export default function CategoryGridFields({ values, onChange }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <input
        type="number"
        min={1}
        value={values.limit}
        onChange={(event) => onChange("limit", Number(event.target.value || 0))}
        placeholder="Category limit"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
