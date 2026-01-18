"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


import {
  Autocomplete,
  Button,
  CircularProgress,
  Stack,
  Switch,
  TextField,
} from "@mui/material";

export default function AdminProductCreatePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: null,
    brand: "",
    isActive: true,
  });

  // 🔍 Load categories ONLY when typing
  useEffect(() => {
    if (!searchText) {
      setCategories([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchCategories(searchText);
    }, 400); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const fetchCategories = async (search) => {
    try {
      setCategoryLoading(true);
      const res = await api.get(`/categorys?search=${search}`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!form.categoryId?._id) {
      toast.error("Please select a category");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Description name is required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        categoryId: form.categoryId?._id,
        brand: form.brand,
        isActive: form.isActive,
      };

      const res = await api.post("/products/admin/createproduct", payload);
      router.push(`/admin/dashboard/products/variant/${res.data.product._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Product create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Product Name */}
          <TextField
            fullWidth
            label="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            multiline
            minRows={4}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />

          {/* 🔍 Searchable Category (Lazy Load) */}
          <Autocomplete
            options={categories}
            loading={categoryLoading}
            value={form.categoryId}
            getOptionLabel={(option) => option.name || ""}
            onChange={(e, value) =>
              setForm({ ...form, categoryId: value })
            }
            onInputChange={(e, value) => setSearchText(value)}
            noOptionsText={
              searchText ? "No category found" : "Type to search category"
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Category"
                required
                slotProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {categoryLoading ? (
                        <CircularProgress size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => {
              const regex = new RegExp(`(${searchText})`, "gi");
              const parts = option.name.split(regex);

              return (
                <li {...props}>
                  {parts.map((part, index) =>
                    part.toLowerCase() === searchText.toLowerCase() ? (
                      <span
                        key={index}
                        className="font-semibold text-blue-600"
                      >
                        {part}
                      </span>
                    ) : (
                      <span key={index}>{part}</span>
                    )
                  )}
                </li>
              );
            }}
          />

          {/* Brand */}
          <TextField
            fullWidth
            label="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />

          {/* Status */}
          <div className="flex items-center gap-4">
            <Switch
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            <span className="text-sm">
              {form.isActive ? "Active Product" : "Inactive Product"}
            </span>
          </div>

          {/* Submit */}
          <div className="pt-4">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                className="!bg-black"
              >
                {loading ? (
                  <CircularProgress size={22} className="!text-white" />
                ) : (
                  "Create Product"
                )}
              </Button>
          </div>
          
        </Stack>
      </form>
    </div>
  );
}
