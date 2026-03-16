export default function HeroBannerFields({
  values,
  onChange,
  onOpenFilePicker,
  onAddBanner,
  onRemoveBanner,
}) {
  const banners = Array.isArray(values?.banners) && values.banners.length > 0
    ? values.banners
    : [{ image: "", title: "", subtitle: "", buttonText: "", link: "" }];
  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">Hero Banners</p>
        <button
          type="button"
          onClick={onAddBanner}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Add Banner
        </button>
      </div>

      {banners.map((banner, index) => (
        <div key={index} className="grid gap-3 rounded-md border border-slate-300 bg-white p-3 md:grid-cols-2">
          <div className="md:col-span-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Banner #{index + 1}</p>
            <button
              type="button"
              onClick={() => onRemoveBanner(index)}
              disabled={banners.length === 1}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Remove Banner
            </button>
          </div>

          <input
            value={banner.image || ""}
            onChange={(event) => onChange(index, "image", event.target.value)}
            placeholder="Banner image URL"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => onOpenFilePicker(index)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Upload Hero Image
          </button>
          <input
            value={banner.link || ""}
            onChange={(event) => onChange(index, "link", event.target.value)}
            placeholder="Button link"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={banner.title || ""}
            onChange={(event) => onChange(index, "title", event.target.value)}
            placeholder="Banner title"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={banner.subtitle || ""}
            onChange={(event) => onChange(index, "subtitle", event.target.value)}
            placeholder="Banner subtitle"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={banner.buttonText || ""}
            onChange={(event) => onChange(index, "buttonText", event.target.value)}
            placeholder="Button text"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      ))}
    </div>
  );
}
