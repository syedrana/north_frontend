"use client";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import api from "../../../lib/api";

import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

export default function CategoryForm({ editData, onSuccess }) {
  const [name, setName] = useState(editData?.name ?? "");
  const [parent, setParent] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const existingImageUrl =
    typeof editData?.image === "string"
      ? editData.image
      : editData?.image?.url ||
        editData?.image?.secure_url ||
        editData?.image?.path ||
        editData?.image?.src ||
        "";

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return existingImageUrl;
  }, [imageFile, existingImageUrl]);

  useEffect(() => {
    return () => {
      if (imageFile) URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile, previewUrl]);

  useEffect(() => {
    if (!editData?.parentId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await api.get(`/categories/${editData.parentId}`);
        if (!cancelled) setParent(res.data.category ?? null);
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
  }, [editData?.parentId]);

  useEffect(() => {
    if (!inputValue) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/categories?search=${encodeURIComponent(inputValue)}`
        );
        if (!cancelled) setOptions(res.data.categories ?? []);
      } catch {
        if (!cancelled) setOptions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inputValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    if (parent?._id) formData.append("parentId", parent._id);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editData) {
        await api.put(`/categories/${editData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/categories/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSuccess();
      setName("");
      setParent(null);
      setInputValue("");
      setOptions([]);
      setImageFile(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      <Typography variant="h6" className="mb-4 text-gray-800 font-semibold">
        {editData ? "Edit Category" : "Add Category"}
      </Typography>

      {error && (
        <Typography
          variant="body2"
          className="mb-3 text-red-600 font-medium bg-red-100 p-2 rounded"
        >
          {error}
        </Typography>
      )}

      <TextField
        fullWidth
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        margin="normal"
        size="medium"
        className="mb-4"
      />

      <Autocomplete
        options={options}
        value={parent}
        loading={loading}
        inputValue={inputValue}
        onChange={(e, value) => setParent(value)}
        onInputChange={(e, value, reason) => {
          if (reason === "reset") return;
          setInputValue(value);
          if (!value) setOptions([]);
        }}
        getOptionLabel={(opt) => opt.name ?? ""}
        filterOptions={(x) => x}
        isOptionEqualToValue={(o, v) => o._id === v?._id}
        size="medium"
        className="mb-4"
        sx={{
          "& .MuiInputBase-root": {
            minHeight: 56,
          },
        }}
        renderOption={(props, option) => {
          const text = option.name ?? "";
          const query = inputValue ?? "";
          const matches = match(text, query, { insideWords: true });
          const parts = parse(text, matches);

          return (
            <li {...props} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              {parts.map((part, i) => (
                <span
                  key={i}
                  className={`${
                    part.highlight
                      ? "font-semibold bg-yellow-200 px-1 rounded"
                      : "font-normal"
                  }`}
                >
                  {part.text}
                </span>
              ))}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Parent Category"
            margin="normal"
            size="medium"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={18} className="mr-1" />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />

      <Button variant="outlined" component="label" fullWidth className="mt-2">
        {imageFile ? "Change Image" : "Upload Image"}
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </Button>

      {previewUrl && (
        <Box className="mt-3 border rounded p-2">
          <Image
            src={previewUrl}
            alt="Category preview"
            width={420}
            height={220}
            unoptimized
            className="w-full max-h-52 object-contain rounded"
          />
        </Box>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        className="mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
      >
        {editData ? "Update Category" : "Create Category"}
      </Button>
    </Box>
  );
}
