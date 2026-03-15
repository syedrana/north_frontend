export default function SettingsJsonEditor({ value, onChange, validationMessage }) {
  return (
    <div className="mt-4">
      <label className="mb-1 block text-sm font-medium text-slate-700">Settings (JSON)</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={14}
        className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs focus:border-slate-500"
      />
      {validationMessage ? (
        <p className="mt-2 text-xs font-medium text-red-600">{validationMessage}</p>
      ) : (
        <p className="mt-2 text-xs text-slate-500">Tip: Settings shape is validated by backend. Keep valid JSON and required fields per section type.</p>
      )}
    </div>
  );
}
