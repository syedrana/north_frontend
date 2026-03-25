"use client";

import api from "@/lib/api";
import { createAdminFlashSale, updateAdminFlashSale } from "@/lib/flashSaleApi";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const INITIAL_FORM = {
  title: "",
  startTime: "",
  endTime: "",
  discountType: "percentage",
  discountValue: "",
  status: "active",
  productsText: "",
};

export default function FlashSaleForm({ mode, flashSaleId }) {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [productsPreview, setProductsPreview] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !flashSaleId) return;

    let cancelled = false;

    const loadFlashSale = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/flash-sales/admin/${flashSaleId}`);
        const sale = response?.data?.flashSale;

        if (!sale) {
          throw new Error("Flash sale not found");
        }

        if (!cancelled) {
          const productIds = Array.isArray(sale.products)
            ? sale.products.map((product) => product?._id).filter(Boolean)
            : [];

          setFormData({
            title: sale.title || "",
            startTime: sale.startTime ? new Date(sale.startTime).toISOString().slice(0, 16) : "",
            endTime: sale.endTime ? new Date(sale.endTime).toISOString().slice(0, 16) : "",
            discountType: sale.discountType || "percentage",
            discountValue: String(sale.discountValue ?? ""),
            status: sale.status || "active",
            productsText: productIds.join(",\n"),
          });
          setProductsPreview(Array.isArray(sale.products) ? sale.products : []);
        }
      } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to load flash sale";
        toast.error(message);
        router.push("/admin/dashboard/flash-sales");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFlashSale();

    return () => {
      cancelled = true;
    };
  }, [flashSaleId, mode, router]);

  const productIds = useMemo(
    () =>
      formData.productsText
        .split(/[\n,]/)
        .map((value) => value.trim())
        .filter(Boolean),
    [formData.productsText]
  );

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      if (productIds.length === 0) {
        setProductsPreview([]);
        return;
      }

      try {
        setPreviewLoading(true);
        const response = await api.get("/products/admin/products");
        const products = Array.isArray(response?.data?.products) ? response.data.products : [];
        const matched = productIds.map((id) => products.find((product) => product._id === id)).filter(Boolean);

        if (!cancelled) {
          setProductsPreview(matched);
        }
      } catch {
        if (!cancelled) {
          setProductsPreview([]);
        }
      } finally {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [productIds]);

  const handleChange = (field, value) => {
    setErrorMessage("");
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const payload = {
      title: formData.title.trim(),
      startTime: formData.startTime ? new Date(formData.startTime).toISOString() : "",
      endTime: formData.endTime ? new Date(formData.endTime).toISOString() : "",
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      status: formData.status,
      products: productIds,
    };

    try {
      setSaving(true);
      if (mode === "create") {
        await createAdminFlashSale(payload);
        toast.success("Flash sale created");
      } else {
        await updateAdminFlashSale(flashSaleId, payload);
        toast.success("Flash sale updated");
      }
      router.push("/admin/dashboard/flash-sales");
      router.refresh();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Failed to save flash sale";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading flash sale...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{mode === "create" ? "Create Flash Sale" : "Edit Flash Sale"}</h1>
            <p className="text-sm text-slate-500">Configure schedule, discount, and product assortment.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard/flash-sales")}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input
              value={formData.title}
              onChange={(event) => handleChange("title", event.target.value)}
              placeholder="Ramadan Mega Flash Sale"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Start Time</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(event) => handleChange("startTime", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">End Time</label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(event) => handleChange("endTime", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Discount Type</label>
            <select
              value={formData.discountType}
              onChange={(event) => handleChange("discountType", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Discount Value</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.discountValue}
              onChange={(event) => handleChange("discountValue", event.target.value)}
              placeholder={formData.discountType === "percentage" ? "e.g. 20" : "e.g. 100"}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select
              value={formData.status}
              onChange={(event) => handleChange("status", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Product IDs</label>
            <textarea
              rows={6}
              value={formData.productsText}
              onChange={(event) => handleChange("productsText", event.target.value)}
              placeholder="One product id per line, or comma separated"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            />
            <p className="mt-1 text-xs text-slate-500">Use published active product IDs from Product Management.</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-medium text-slate-900">Selected products preview</h2>
              <p className="text-xs text-slate-500">Matched {productsPreview.length} of {productIds.length} provided IDs.</p>
            </div>
            {previewLoading && <span className="text-xs text-slate-500">Refreshing preview…</span>}
          </div>

          {productsPreview.length === 0 ? (
            <p className="text-sm text-slate-500">No product preview available yet.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {productsPreview.map((product) => (
                <div key={product._id} className="rounded-lg border bg-white p-3 text-sm">
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">{product._id}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard/flash-sales")}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : mode === "create" ? "Create Flash Sale" : "Update Flash Sale"}
          </button>
        </div>
      </form>
    </div>
  );
}
