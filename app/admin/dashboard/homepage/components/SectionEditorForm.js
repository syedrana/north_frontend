import { useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { SECTION_DEFAULT_SETTINGS, SECTION_TYPES } from "../constants";
import {
    convertFileToDataUrl,
    parseSettingsOrFallback,
    parseSettingsOrThrow,
    prettyJson,
    updateSettingsJson,
} from "../utils";
import QuickSettingsForm from "./QuickSettingsForm";
import SettingsJsonEditor from "./SettingsJsonEditor";

export default function SectionEditorForm({
  mode,
  formData,
  setFormData,
  saveErrorMessage,
  setSaveErrorMessage,
  pending,
  onCancel,
  onSave,
}) {
  const heroImageInputRef = useRef(null);
  const campaignImageInputRef = useRef(null);

  const settingsValidationMessage = useMemo(() => {
    try {
      parseSettingsOrThrow(formData.settingsJson);
      return "";
    } catch (error) {
      return error.message;
    }
  }, [formData.settingsJson]);

  const quickSettings = useMemo(() => {
    const parsed = parseSettingsOrFallback(formData.settingsJson);

    if (formData.type === "hero_banner") {
      const firstBanner = parsed?.banners?.[0] || {};
      return {
        image: firstBanner.image || "",
        title: firstBanner.title || "",
        subtitle: firstBanner.subtitle || "",
        buttonText: firstBanner.buttonText || "",
        link: firstBanner.link || "",
      };
    }

    if (formData.type === "category_grid") {
      return { limit: String(parsed?.limit ?? 8) };
    }

    if (formData.type === "product_grid") {
      return {
        source: parsed?.source || "new_arrival",
        limit: String(parsed?.limit ?? 8),
        productIds: Array.isArray(parsed?.productIds) ? parsed.productIds.join(",") : "",
        categoryId: parsed?.categoryId || "",
      };
    }

    if (formData.type === "campaign_banner") {
      const firstCampaign = parsed?.campaigns?.[0] || {};
      return {
        image: firstCampaign.image || "",
        link: firstCampaign.link || "",
      };
    }

    return {};
  }, [formData.settingsJson, formData.type]);

  const handleTypeChange = (nextType) => {
    setFormData((previous) => ({
      ...previous,
      type: nextType,
      settingsJson: mode === "create" ? prettyJson(SECTION_DEFAULT_SETTINGS[nextType] || {}) : previous.settingsJson,
    }));
  };

  const handleImagePick = async (event, sectionType) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await convertFileToDataUrl(file);
      setFormData((prev) => ({
        ...prev,
        settingsJson: updateSettingsJson(prev.settingsJson, (current) => {
          if (sectionType === "hero_banner") {
            return {
              ...current,
              banners: [{ ...(current?.banners?.[0] || {}), image: dataUrl }, ...(Array.isArray(current?.banners) ? current.banners.slice(1) : [])],
            };
          }

          return {
            ...current,
            campaigns: [{ ...(current?.campaigns?.[0] || {}), image: dataUrl }, ...(Array.isArray(current?.campaigns) ? current.campaigns.slice(1) : [])],
          };
        }),
      }));
      toast.success("Image selected. Click Save Section to persist.");
    } catch (error) {
      toast.error(error.message || "Failed to process image");
    } finally {
      event.target.value = "";
    }
  };

  const handleQuickSettingsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      settingsJson: updateSettingsJson(prev.settingsJson, (current) => {
        if (prev.type === "hero_banner") {
          return {
            ...current,
            banners: [{ ...(current?.banners?.[0] || {}), [field]: value }, ...(Array.isArray(current?.banners) ? current.banners.slice(1) : [])],
          };
        }

        if (prev.type === "campaign_banner") {
          return {
            ...current,
            campaigns: [{ ...(current?.campaigns?.[0] || {}), [field]: value }, ...(Array.isArray(current?.campaigns) ? current.campaigns.slice(1) : [])],
          };
        }

        if (prev.type === "product_grid") {
          if (field === "productIds") {
            return {
              ...current,
              productIds: value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            };
          }

          if (field === "categoryId") {
            return { ...current, categoryId: value };
          }
        }

        return { ...current, [field]: value };
      }),
    }));
  };

  const handleSave = async () => {
    setSaveErrorMessage("");
    const title = formData.title.trim();

    if (!title) {
      setSaveErrorMessage("Title is required.");
      toast.error("Title is required");
      return;
    }

    let parsedSettings;
    try {
      parsedSettings = parseSettingsOrThrow(formData.settingsJson);
    } catch (error) {
      setSaveErrorMessage(error.message);
      toast.error(error.message);
      return;
    }

    const payload = {
      title,
      type: formData.type,
      status: formData.status,
      settings: parsedSettings,
    };

    if (formData.order !== "") {
      payload.order = Number(formData.order);
    }

    await onSave(payload);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {mode === "create" ? "Create Homepage Section" : "Edit Homepage Section"}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            value={formData.title}
            onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="e.g. Featured Products"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
          <select
            value={formData.type}
            onChange={(event) => handleTypeChange(event.target.value)}
            disabled={mode === "edit"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 disabled:bg-slate-100"
          >
            {SECTION_TYPES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select
            value={formData.status}
            onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
          >
            <option value="active">active</option>
            <option value="hidden">hidden</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Order (optional)</label>
          <input
            value={formData.order}
            onChange={(event) => setFormData((prev) => ({ ...prev, order: event.target.value }))}
            placeholder="e.g. 1"
            type="number"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">Quick Settings</label>
        <input ref={heroImageInputRef} type="file" accept="image/*" onChange={(event) => handleImagePick(event, "hero_banner")} className="hidden" />
        <input ref={campaignImageInputRef} type="file" accept="image/*" onChange={(event) => handleImagePick(event, "campaign_banner")} className="hidden" />
        <QuickSettingsForm
          type={formData.type}
          values={quickSettings}
          onChange={handleQuickSettingsChange}
          onOpenHeroImagePicker={() => heroImageInputRef.current?.click()}
          onOpenCampaignImagePicker={() => campaignImageInputRef.current?.click()}
        />
      </div>

      <SettingsJsonEditor
        value={formData.settingsJson}
        onChange={(settingsJson) => setFormData((prev) => ({ ...prev, settingsJson }))}
        validationMessage={settingsValidationMessage}
      />

      {(saveErrorMessage || settingsValidationMessage) && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {saveErrorMessage || settingsValidationMessage}
        </div>
      )}

      <div className="mt-5 flex items-center justify-end gap-2">
        <button onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={pending || Boolean(settingsValidationMessage)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save Section"}
        </button>
      </div>
    </div>
  );
}
