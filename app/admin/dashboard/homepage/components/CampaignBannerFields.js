export default function CampaignBannerFields({ values, onChange, onOpenFilePicker }) {
  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
      <input
        value={values.image}
        onChange={(event) => onChange("image", event.target.value)}
        placeholder="Campaign image URL"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="button"
        onClick={onOpenFilePicker}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        Upload Campaign Image
      </button>
      <input
        value={values.link}
        onChange={(event) => onChange("link", event.target.value)}
        placeholder="Campaign link"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
        