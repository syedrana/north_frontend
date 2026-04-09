"use client";

import { getTrendingProducts } from "@/lib/trendingProductsApi";
import { useEffect, useMemo, useState } from "react";

export function useTrendingProducts(options = {}, enabled = true) {
  const [products, setProducts] = useState([]);
  const [source, setSource] = useState("trending_hybrid");
  const [weights, setWeights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestOptions = useMemo(
    () => ({
      limit: options?.limit,
      windowDays: options?.windowDays,
      categoryId: options?.categoryId,
      salesWeight: options?.salesWeight,
      wishlistWeight: options?.wishlistWeight,
      viewWeight: options?.viewWeight,
    }),
    [
      options?.categoryId,
      options?.limit,
      options?.salesWeight,
      options?.viewWeight,
      options?.windowDays,
      options?.wishlistWeight,
    ]
  );

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;

    const loadTrendingProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getTrendingProducts(requestOptions);

        if (!isMounted) return;

        setProducts(Array.isArray(response?.products) ? response.products : []);
        setSource(response?.source || "trending_hybrid");
        setWeights(response?.weights || null);
      } catch (err) {
        if (!isMounted) return;

        setProducts([]);
        setError(err instanceof Error ? err.message : "Failed to fetch trending products");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTrendingProducts();

    return () => {
      isMounted = false;
    };
  }, [enabled, requestOptions]);

  return {
    products,
    source,
    weights,
    loading,
    error,
  };
}
