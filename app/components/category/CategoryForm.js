"use client";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

export default function CategoryForm({ editData, onSuccess }) {
  /* ---------------- State ---------------- */
  const [name, setName] = useState(editData?.name ?? "");
  const [parent, setParent] = useState(null);

  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------- Load parent category (EDIT mode) -------- */
  useEffect(() => {
    if (!editData?.parentId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await api.get(`/categorys/${editData.parentId}`);
        if (!cancelled) setParent(res.data.category ?? null);
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
  }, [editData?.parentId]);

  /* -------- Server-side search for parent -------- */
  useEffect(() => {
    if (!inputValue) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/categorys?search=${encodeURIComponent(inputValue)}`
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

  /* ---------------- Submit ---------------- */
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    const payload = {
      name: name.trim(),
      parentId: parent?._id || null,
    };

    try {
      if (editData) {
        await api.put(`/categorys/${editData._id}`, payload);
      } else {
        await api.post("/categorys/create", payload);
      }

      onSuccess();
      setName("");
      setParent(null);
      setInputValue("");
      setOptions([]);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      <Typography variant="h6" className="mb-4 text-gray-800 font-semibold">
        {editData ? "Edit Category" : "Add Category"}
      </Typography>

      {/* Error Message */}
      {error && (
        <Typography
          variant="body2"
          className="mb-3 text-red-600 font-medium bg-red-100 p-2 rounded"
        >
          {error}
        </Typography>
      )}

      {/* Category Name */}
      <TextField
        fullWidth
        label="Category Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        margin="normal"
        size="medium"
        className="mb-4"
      />

      {/* Parent Category Searchable Autocomplete */}
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
        getOptionLabel={opt => opt.name ?? ""}
        filterOptions={x => x}
        isOptionEqualToValue={(o, v) => o._id === v?._id}
        size="medium"
        className="mb-4"
        sx={{
          "& .MuiInputBase-root": {
            minHeight: 56, // mobile touch target
          },
        }}
        renderOption={(props, option) => {
          const text = option.name ?? "";
          const query = inputValue ?? "";
          const matches = match(text, query, { insideWords: true });
          const parts = parse(text, matches);

          return (
            <li
              {...props}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
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
        renderInput={params => (
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

      {/* Submit Button */}
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
