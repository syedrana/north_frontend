"use client";

import { useCallback, useState } from "react";

const KEY = "recent_searches";
const LIMIT = 8;

function getStored() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export default function useSearchHistory() {
  const [history, setHistory] = useState(() => getStored());

  const persist = (data) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {}
  };

  const saveSearch = useCallback((keyword) => {
    if (!keyword) return;

    setHistory((prev) => {
      const updated = [
        keyword,
        ...prev.filter((k) => k !== keyword),
      ].slice(0, LIMIT);

      persist(updated);
      return updated;
    });
  }, []);

  const removeSearch = useCallback((keyword) => {
    setHistory((prev) => {
      const updated = prev.filter((k) => k !== keyword);
      persist(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, []);

  return {
    history,
    saveSearch,
    removeSearch,
    clearAll,
  };
}