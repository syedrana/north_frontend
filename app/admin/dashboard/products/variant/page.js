"use client";

import {
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "FREE"];

export default function AdminVariantPage({ params }) {
  const { productId } = params;

  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    sku: "",
    size: "",
    color: "",
    price: "",
    discountPrice: "",
    stock: "",
    isDefault: false,
  });

  const loadVariants = useCallback(async () => {
    const { data } = await axios.get(`/products/${productId}`);
    setVariants(data.variants || []);
  });

  useEffect(() => {
    loadVariants();
  }, [loadVariants]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (field) => (e) => {
    const value = field === "isDefault" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Image required");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append("image", imageFile);

    try {
      setLoading(true);
      await axios.post(`/products/admin/variant/${productId}`, formData);
      await loadVariants();

      setForm({ sku: "", size: "", color: "", price: "", discountPrice: "", stock: "", isDefault: false });
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      alert(err.response?.data?.message || "Variant create failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteVariant = async (id) => {
    if (!confirm("Delete this variant?") ) return;
    await axios.delete(`/products/admin/deletevariant/${id}`);
    loadVariants();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* CREATE VARIANT */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Create Variant</h2>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField label="SKU" value={form.sku} onChange={handleChange("sku")} required fullWidth />

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

              <input type="file" accept="image/*" onChange={handleImageChange} />

              {preview && (
                <Image src={preview} alt="Preview" width={200} height={200} className="rounded-lg" />
              )}

              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={22} /> : "Create Variant"}
              </Button>
            </Stack>
          </form>
        </div>

        {/* VARIANT LIST */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Variants</h2>

          <div className="space-y-4">
            {variants.map((v) => (
              <div key={v._id} className="flex items-center justify-between border p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Image src={v.images[0].url} alt="" width={60} height={60} className="rounded" />
                  <div>
                    <p className="font-medium">{v.sku}</p>
                    <p className="text-sm text-gray-500">{v.size} / {v.color}</p>
                  </div>
                </div>
                <Button color="error" onClick={() => deleteVariant(v._id)}>Delete</Button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
