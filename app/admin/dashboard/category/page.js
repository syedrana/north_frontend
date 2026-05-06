"use client";

import { Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import CategoryForm from "../../../components/category/CategoryForm";
import CategoryTable from "../../../components/category/CategoryTable";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [edit, setEdit] = useState(null);

  const normalizeOrder = (items) =>
    items.map((item, index) => ({ ...item, order: index + 1 }));

  /* ✅ Effect handles API sync directly */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await api.get("/categories");
        if (mounted) {
          const incoming = Array.isArray(res.data.categories)
            ? [...res.data.categories]
            : [];
          incoming.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setCategories(normalizeOrder(incoming));
        }
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ✅ Reusable reload (NOT used inside effect) */
  const reloadCategories = async () => {
    const res = await api.get("/categories");
    const incoming = Array.isArray(res.data.categories)
      ? [...res.data.categories]
      : [];
    incoming.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setCategories(normalizeOrder(incoming));
  };

  const handleReorder = async (id, direction) => {
    const currentIndex = categories.findIndex((item) => item._id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const reordered = [...categories];
    [reordered[currentIndex], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ];

    const normalized = normalizeOrder(reordered);
    setCategories(normalized);

    try {
      await api.put("/categories/reorder", {
        items: normalized.map((item) => ({ id: item._id, order: item.order })),
      });
    } catch (error) {
      console.error(error);
      await reloadCategories();
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper>
          <CategoryForm
            key={edit ? edit._id : "create"}
            editData={edit}
            onSuccess={() => {
              setEdit(null);
              reloadCategories();
            }}
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <CategoryTable
            data={categories}
            onEdit={setEdit}
            refresh={reloadCategories}
            onReorder={handleReorder}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
