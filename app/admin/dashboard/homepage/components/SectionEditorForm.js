import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { SECTION_DEFAULT_SETTINGS, SECTION_TYPES } from "../constants";
import {
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
  const [selectedUploads, setSelectedUploads] = useState({
    heroImages: {},
    campaignImage: null,
  });
  const [heroImageTargetIndex, setHeroImageTargetIndex] = useState(0);
  const [previewUrls, setPreviewUrls] = useState({
    heroImages: {},
    campaignImage: "",
  });

  useEffect(() => {
    return () => {
      Object.values(previewUrls.heroImages || {}).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });

      if (previewUrls.campaignImage) {
        URL.revokeObjectURL(previewUrls.campaignImage);
      }
    };
  }, [previewUrls]);

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
      return {
        banners: Array.isArray(parsed?.banners) && parsed.banners.length > 0
          ? parsed.banners
          : [SECTION_DEFAULT_SETTINGS.hero_banner.banners[0]],
      };
    }

    if (formData.type === "category_grid") {
      return { limit: String(parsed?.limit ?? 8) };
    }

    if (formData.type === "product_grid") {
      return {
        source: parsed?.source || "new_arrival",
        limit: String(parsed?.limit ?? 8),
        productIds: Array.isArray(parsed?.productIds) ? parsed.productIds : [],
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

    if (formData.type === "flash_sale") {
      return {
        mode: parsed?.mode || "active",
        limit: String(parsed?.limit ?? 8),
        flashSaleId: parsed?.flashSaleId || "",
      };
    }

    if (formData.type === "trending_products") {
      return {
        limit: String(parsed?.limit ?? 8),
        windowDays: String(parsed?.windowDays ?? 30),
        categoryId: parsed?.categoryId || "",
        salesWeight: String(parsed?.salesWeight ?? 5),
        wishlistWeight: String(parsed?.wishlistWeight ?? 3),
        viewWeight: String(parsed?.viewWeight ?? 1),
      };
    }

    return {};
  }, [formData.settingsJson, formData.type]);

  const resetUploadState = () => {
    Object.values(previewUrls.heroImages || {}).forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });

    if (previewUrls.campaignImage) {
      URL.revokeObjectURL(previewUrls.campaignImage);
    }

    setSelectedUploads({ heroImages: {}, campaignImage: null });
    setPreviewUrls({ heroImages: {}, campaignImage: "" });
    setHeroImageTargetIndex(0);
  };

  const handleTypeChange = (nextType) => {
    setFormData((previous) => ({
      ...previous,
      type: nextType,
      settingsJson:
        mode === "create"
          ? prettyJson(SECTION_DEFAULT_SETTINGS[nextType] || {})
          : previous.settingsJson,
    }));
    resetUploadState(); //setSelectedUploads({ heroImage: null, campaignImage: null });
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
      const previewUrl = URL.createObjectURL(file);

      setSelectedUploads((prev) => ({
        ...prev,
        heroImages:
          sectionType === "hero_banner"
            ? { ...prev.heroImages, [heroImageTargetIndex]: file }
            : prev.heroImages,
        campaignImage: sectionType === "campaign_banner" ? file : prev.campaignImage,
      }));

      setPreviewUrls((prev) => {
        const next = { ...prev };

        if (sectionType === "hero_banner") {
           const existingUrl = prev.heroImages?.[heroImageTargetIndex];
          if (existingUrl) {
            URL.revokeObjectURL(existingUrl);
          }

          next.heroImages = {
            ...prev.heroImages,
            [heroImageTargetIndex]: previewUrl,
          };
        }

        if (sectionType === "campaign_banner") {
          if (prev.campaignImage) URL.revokeObjectURL(prev.campaignImage);
          next.campaignImage = previewUrl;
        }

        return next;
      });

      setFormData((prev) => ({
        ...prev,
        settingsJson: updateSettingsJson(prev.settingsJson, (current) => {
          if (sectionType === "hero_banner") {
            const currentBanners = Array.isArray(current?.banners) && current.banners.length > 0
              ? current.banners
              : [SECTION_DEFAULT_SETTINGS.hero_banner.banners[0]];
            return {
              ...current,
               banners: currentBanners.map((banner, index) =>
                index === heroImageTargetIndex
                  ? { ...banner, image: previewUrl }
                  : banner
              ),
            };
          }

          return {
            ...current,
            campaigns: [
              { ...(current?.campaigns?.[0] || {}), image: previewUrl },
              ...(Array.isArray(current?.campaigns) ? current.campaigns.slice(1) : []),
            ],
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
          const currentBanners = Array.isArray(current?.banners) && current.banners.length > 0
            ? current.banners
            : [SECTION_DEFAULT_SETTINGS.hero_banner.banners[0]];

          if (typeof field === "object") {
            const { index, key } = field;

            return {
              ...current,
              banners: currentBanners.map((banner, bannerIndex) =>
                bannerIndex === index ? { ...banner, [key]: value } : banner
              ),
            };
          }
          return {
            ...current,
            banners: [{ ...(currentBanners[0] || {}), [field]: value }, ...currentBanners.slice(1)],
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
            const nextProductIds = Array.isArray(value)
              ? value.filter(Boolean)
              : String(value || "")
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean);

            return {
              ...current,
              productIds: nextProductIds,
            };
          }

          if (field === "categoryId") {
            return { ...current, categoryId: value };
          }
        }

        if (prev.type === "flash_sale" && field === "limit") {
          return { ...current, limit: value === "" ? "" : Number(value) };
        }

        if (
          prev.type === "trending_products" &&
          ["limit", "windowDays", "salesWeight", "wishlistWeight", "viewWeight"].includes(field)
        ) {
          return { ...current, [field]: value === "" ? "" : Number(value) };
        }

        return { ...current, [field]: value };
      }),
    }));
  };

  const handleAddHeroBanner = () => {
    setFormData((prev) => ({
      ...prev,
      settingsJson: updateSettingsJson(prev.settingsJson, (current) => {
        const currentBanners = Array.isArray(current?.banners) ? current.banners : [];
        return {
          ...current,
          banners: [
            ...currentBanners,
            { ...SECTION_DEFAULT_SETTINGS.hero_banner.banners[0] },
          ],
        };
      }),
    }));
  };

  const handleRemoveHeroBanner = (removeIndex) => {
    setFormData((prev) => ({
      ...prev,
      settingsJson: updateSettingsJson(prev.settingsJson, (current) => {
        const currentBanners = Array.isArray(current?.banners) && current.banners.length > 0
          ? current.banners
          : [SECTION_DEFAULT_SETTINGS.hero_banner.banners[0]];

        if (currentBanners.length <= 1) {
          return current;
        }

        return {
          ...current,
          banners: currentBanners.filter((_, index) => index !== removeIndex),
        };
      }),
    }));

    setSelectedUploads((prev) => {
      const nextHeroImages = {};
      Object.entries(prev.heroImages || {}).forEach(([key, file]) => {
        const index = Number(key);
        if (index === removeIndex) return;
        nextHeroImages[index > removeIndex ? index - 1 : index] = file;
      });

      return {
        ...prev,
        heroImages: nextHeroImages,
      };
    });

    setPreviewUrls((prev) => {
      const nextHeroImageUrls = {};
      Object.entries(prev.heroImages || {}).forEach(([key, url]) => {
        const index = Number(key);

        if (index === removeIndex) {
          if (url) URL.revokeObjectURL(url);
          return;
        }

        nextHeroImageUrls[index > removeIndex ? index - 1 : index] = url;
      });

      return {
        ...prev,
        heroImages: nextHeroImageUrls,
      };
    });

    setHeroImageTargetIndex((prev) => (prev > removeIndex ? prev - 1 : prev));
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
      uploads: {
        heroImages: Object.entries(selectedUploads.heroImages || {})
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([index, file]) => ({ index: Number(index), file }))
          .filter((item) => item.file),
        campaignImage: selectedUploads.campaignImage,
      },
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
          onChange={(...args) => {
            if (formData.type === "hero_banner") {
              const [index, field, value] = args;
              handleQuickSettingsChange({ index, key: field }, value);
              return;
            }

            const [field, value] = args;
            handleQuickSettingsChange(field, value);
          }}
          onOpenHeroImagePicker={(index = 0) => {
            setHeroImageTargetIndex(index);
            heroImageInputRef.current?.click();
          }}
          onOpenCampaignImagePicker={() => campaignImageInputRef.current?.click()}
          onAddHeroBanner={handleAddHeroBanner}
          onRemoveHeroBanner={handleRemoveHeroBanner}
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
