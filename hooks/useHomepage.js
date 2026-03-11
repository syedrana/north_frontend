"use client";

import { getHomepage } from "@/lib/homepageApi";
import { useEffect, useState } from "react";

export function useHomepage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadHomepage = async () => {
      try {
        setLoading(true);
        setError(null);

        const homepageSections = await getHomepage();

        if (isMounted) {
          setSections(homepageSections);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch homepage data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHomepage();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    loading,
    error,
    sections,
  };
}
