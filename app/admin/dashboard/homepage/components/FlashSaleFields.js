export default function FlashSaleFields({ values, onChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Mode</label>
        <select
          value={values.mode}
          onChange={(event) => onChange("mode", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
        >
          <option value="active">Active flash sale</option>
          <option value="manual">Manual flash sale</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Product limit</label>
        <input
          type="number"
          min="1"
          value={values.limit}
          onChange={(event) => onChange("limit", event.target.value)}
          placeholder="e.g. 8"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
        />
      </div>

      {values.mode === "manual" && (
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Flash Sale ID</label>
          <input
            value={values.flashSaleId}
            onChange={(event) => onChange("flashSaleId", event.target.value)}
            placeholder="MongoDB flash sale id"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
          />
        </div>
      )}
    </div>
  );
}
