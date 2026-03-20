import api from "@/lib/apiServer";
import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCT_GRID_SOURCES } from "../constants";

export default function ProductGridFields({ values, onChange }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const selectedProductIds = useMemo(() => {
    if (Array.isArray(values.productIds)) {
      return values.productIds;
    }

    if (typeof values.productIds === "string") {
      return values.productIds
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  }, [values.productIds]);

  useEffect(() => {
    const keyword = query.trim();

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!keyword) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get("/products", {
          params: {
            search: keyword,
            limit: 8,
          },
        });

        const rows = Array.isArray(res.data?.products) ? res.data.products : [];
        setSuggestions(rows);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const addProduct = (product) => {
    const productId = product?._id;
    if (!productId || selectedProductIds.includes(productId)) {
      return;
    }

    onChange("productIds", [...selectedProductIds, productId]);
    setQuery("");
    setSuggestions([]);
  };

  const removeProduct = (productId) => {
    onChange(
      "productIds",
      selectedProductIds.filter((id) => id !== productId)
    );
  };

  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
      <select
        value={values.source}
        onChange={(event) => onChange("source", event.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      >
        {PRODUCT_GRID_SOURCES.map((source) => (
          <option key={source.value} value={source.value}>{source.label}</option>
        ))}
      </select>
      <input
        type="number"
        min={1}
        value={values.limit}
        onChange={(event) => onChange("limit", Number(event.target.value || 0))}
        placeholder="Product limit"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="relative md:col-span-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Type product name to add"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        {query.trim() && (
          <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
            {loading && <div className="px-3 py-2 text-xs text-slate-500">Loading...</div>}
            {!loading && suggestions.length === 0 && (
              <div className="px-3 py-2 text-xs text-slate-500">No products found</div>
            )}
            {!loading && suggestions.map((product) => {
              const productId = product?._id;
              const alreadySelected = selectedProductIds.includes(productId);

              return (
                <button
                  key={productId}
                  type="button"
                  onClick={() => addProduct(product)}
                  disabled={alreadySelected}
                  className="flex w-full items-center justify-between border-b border-slate-100 px-3 py-2 text-left text-sm last:border-0 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="truncate">{product?.name || "Unnamed product"}</span>
                  <span className="ml-2 text-xs text-slate-500">{alreadySelected ? "Selected" : productId}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 md:col-span-2">
        {selectedProductIds.length === 0 && (
          <span className="text-xs text-slate-500">No products selected</span>
        )}

        {selectedProductIds.map((productId) => (
          <button
            key={productId}
            type="button"
            onClick={() => removeProduct(productId)}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
            title="Click to remove"
          >
            {productId} ×
          </button>
        ))}
      </div>
      {values.source === "category" && (
        <input
          value={values.categoryId}
          onChange={(event) => onChange("categoryId", event.target.value)}
          placeholder="Category ID (required for category source)"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
        />
      )}
    </div>
  );
}
