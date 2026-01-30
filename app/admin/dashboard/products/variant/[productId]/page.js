"use client";

import VariantImagePreview from "@/app/components/VariantImagePreview";
import api from "@/lib/api";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "FREE"];

const EMPTY_FORM = {
  sku: "",
  size: "",
  color: "",
  price: "",
  discountPrice: "",
  stock: "",
  isDefault: false,
};

export default function AdminVariantPage() {
  const { productId } = useParams();
  const fileRef = useRef(null);

  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  /* ---------------- LOAD ---------------- */
  const loadVariants = useCallback(async () => {
    const { data } = await api.get(
      `/products/admin/product/${productId}`
    );
    setVariants(data.variants || []);
  }, [productId]);

  useEffect(() => {
    if (productId) loadVariants();
  }, [loadVariants, productId]);

  /* ---------------- FORM ---------------- */
  const handleChange = (field) => (e) => {
    const value =
      field === "isDefault" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setExistingImages([]);
    setRemovedImages([]);
    setNewImages([]);
  };

  /* ---------------- IMAGE HANDLING ---------------- */
  const handleFiles = (files) => {
    const arr = Array.from(files);

    if (arr.length + existingImages.length + newImages.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setNewImages((p) => [...p, ...arr]);
  };

  const removeExisting = (img) => {
    setExistingImages((p) =>
      p.filter((i) => i.public_id !== img.public_id)
    );
    setRemovedImages((p) => [...p, img.public_id]);
  };

  const removeNewImage = (index) => {
    setNewImages((p) => p.filter((_, i) => i !== index));
  };

  const moveImage = (index, dir) => {
    const arr = [...existingImages];
    const target = arr[index];
    arr.splice(index, 1);
    arr.splice(index + dir, 0, target);
    setExistingImages(arr);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && newImages.length === 0) {
      alert("At least one image required");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) =>
        fd.append(k, String(v))
      );

      if (editingId) {
        fd.append(
          "keepImages",
          JSON.stringify(existingImages.map((i) => i.public_id))
        );
        fd.append(
          "removeImages",
          JSON.stringify(removedImages)
        );

        newImages.forEach((img) =>
          fd.append("newImages", img)
        );

        await api.put(
          `/products/admin/updatevariant/${editingId}`,
          fd
        );
      } else {
        newImages.forEach((img) =>
          fd.append("images", img)
        );

        await api.post(
          `/products/admin/variant/${productId}`,
          fd
        );
      }

      await loadVariants();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EDIT ---------------- */
  const editVariant = (v) => {
    setEditingId(v._id);
    setForm({
      sku: v.sku,
      size: v.size,
      color: v.color,
      price: v.price,
      discountPrice: v.discountPrice,
      stock: v.stock,
      isDefault: v.isDefault,
    });
    setExistingImages(v.images || []);
    setRemovedImages([]);
    setNewImages([]);
  };

  const deleteVariant = async (id) => {
    if (!confirm("Delete this variant?")) return;
    await api.delete(`/products/admin/deletevariant/${id}`);
    loadVariants();
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-2 sm:px-0">

        {/* FORM */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Variant" : "Create Variant"}
          </h2>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField label="SKU" value={form.sku} onChange={handleChange("sku")} required />
              <TextField select label="Size" value={form.size} onChange={handleChange("size")} required>
                {SIZES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
              <TextField label="Color" value={form.color} onChange={handleChange("color")} required />
              <TextField label="Price" type="number" value={form.price} onChange={handleChange("price")} required />
              <TextField label="Discount Price" type="number" value={form.discountPrice} onChange={handleChange("discountPrice")} />
              <TextField label="Stock" type="number" value={form.stock} onChange={handleChange("stock")} required />

              <FormControlLabel
                control={<Checkbox checked={form.isDefault} onChange={handleChange("isDefault")} />}
                label="Default Variant"
              />

              {existingImages.map((img, i) => (
                <div key={img.public_id} className="flex items-center gap-2 flex-wrap">
                  <Image src={img.url} width={60} height={60} alt="" />
                  <Button size="small" disabled={i === 0} onClick={() => moveImage(i, -1)}>↑</Button>
                  <Button size="small" disabled={i === existingImages.length - 1} onClick={() => moveImage(i, 1)}>↓</Button>
                  <Button size="small" color="error" onClick={() => removeExisting(img)}>Remove</Button>
                </div>
              ))}

              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed rounded p-4 text-center cursor-pointer"
              >
                Upload images (1–5)
              </div>

              <input
                ref={fileRef}
                hidden
                multiple
                type="file"
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <div className="flex gap-3 flex-wrap">
                {newImages.map((file, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(file)}
                      width={80}
                      height={80}
                      alt=""
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                      onClick={() => removeNewImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : editingId ? "Update" : "Create"}
                </Button>
                {editingId && (
                  <Button variant="outlined" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </Stack>
          </form>
        </div>

        {/* VARIANTS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Variants</h2>

          {variants.map((v) => (
            <div
              key={v._id}
              className="flex flex-col sm:flex-row sm:justify-between gap-3 border p-3 rounded mb-2"
            >
              <div className="flex gap-3">
                <VariantImagePreview images={v.images} />
                <div>
                  <p className="font-medium">{v.sku}</p>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{v.size} · {v.color}</p>

                    <p className="flex gap-2">
                      {v.discountPrice ? (
                        <>
                          <span className="line-through text-gray-400">৳{v.price}</span>
                          <span className="text-green-600 font-semibold">৳{v.discountPrice}</span>
                        </>
                      ) : (
                        <span className="font-semibold">৳{v.price}</span>
                      )}
                    </p>

                    <p className={`text-xs ${v.stock > 0 ? "text-blue-600" : "text-red-600"}`}>
                      {v.stock > 0 ? `Stock: ${v.stock}` : "Out of stock"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button size="small" onClick={() => editVariant(v)}>Edit</Button>
                <Button size="small" color="error" onClick={() => deleteVariant(v._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
