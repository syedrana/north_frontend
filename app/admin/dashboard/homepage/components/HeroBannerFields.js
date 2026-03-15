export default function HeroBannerFields({ values, onChange, onOpenFilePicker }) {
  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
      <input
        value={values.image}
        onChange={(event) => onChange("image", event.target.value)}
        placeholder="Banner image URL"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="button"
        onClick={onOpenFilePicker}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        Upload Hero Image
      </button>
      <input value={values.link} onChange={(event) => onChange("link", event.target.value)} placeholder="Button link" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      <input value={values.title} onChange={(event) => onChange("title", event.target.value)} placeholder="Banner title" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      <input value={values.subtitle} onChange={(event) => onChange("subtitle", event.target.value)} placeholder="Banner subtitle" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      <input value={values.buttonText} onChange={(event) => onChange("buttonText", event.target.value)} placeholder="Button text" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
    </div>
  );
}
