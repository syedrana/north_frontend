"use client";

import { Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import CategoryForm from "../../../components/category/CategoryForm";
import CategoryTable from "../../../components/category/CategoryTable";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [edit, setEdit] = useState(null);

  /* ✅ Effect handles API sync directly */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await api.get("/categorys");
        if (mounted) {
          setCategories(res.data.categories);
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
    const res = await api.get("/categorys");
    setCategories(res.data.categories);
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
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
