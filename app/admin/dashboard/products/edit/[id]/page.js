"use client";

import api from "@/lib/api";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminProductEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    brand: "",
    tags: "",
    sizeOptions: "",
    isActive: true,
    isPublished: false,
  });

  /* ===== attributes + sizeChart now user-friendly ===== */

  const [attributes, setAttributes] = useState([{ key: "", value: "" }]);
  const [sizeChart, setSizeChart] = useState([
    { size: "", chest: "", waist: "", length: "", shoulder: "" },
  ]);

  /* ================= CATEGORY FETCH ================= */

  const fetchCategories = async (search = "") => {
    try {
      setCategoryLoading(true);
      const res = await api.get(`/categorys?search=${search}`);
      setCategories(res.data.categories || []);
    } catch (e) {
      console.error(e);
      toast.error("Category load failed");
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchCategories(categorySearch);
    }, 400);
    return () => clearTimeout(t);
  }, [categorySearch]);

  /* ================= LOAD ================= */

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);

      const pRes = await api.get(`/products/admin/product/${id}`);

      console.log("RAW PRODUCT RESPONSE:", pRes.data);

      const p =
        pRes.data.product ||
        pRes.data.data ||
        pRes.data;

      if (!p || !p._id) {
        toast.error("Invalid product response");
        return;
      }

      setForm({
        name: p.name || "",
        description: p.description || "",
        categoryId: p.categoryId?._id || p.categoryId || "",
        brand: p.brand || "",
        tags: (p.tags || []).join(", "),
        sizeOptions: (p.sizeOptions || []).join(", "),
        isActive: p.isActive ?? true,
        isPublished: p.isPublished ?? false,
      });

      /* preload category into list so select has value */
      if (p.categoryId) {
        const catObj =
          typeof p.categoryId === "object"
            ? p.categoryId
            : { _id: p.categoryId, name: "Selected Category" };

        setCategories((prev) => {
          const exists = prev.find((c) => c._id === catObj._id);
          return exists ? prev : [catObj, ...prev];
        });
      }

      /* attributes → rows */
      const attrRows = Object.entries(p.attributes || {}).map(
        ([key, value]) => ({ key, value })
      );

      setAttributes(
        attrRows.length
          ? attrRows
          : [{ key: "", value: "" }]
      );

      /* size chart */
      setSizeChart(
        Array.isArray(p.sizeChart) && p.sizeChart.length
          ? p.sizeChart
          : [{ size: "", chest: "", waist: "", length: "", shoulder: "" }]
      );

    } catch (err) {
      console.error(err);
      toast.error("Load failed");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadProduct();
  }, [id, loadProduct]);

  /* ================= ATTRIBUTES ================= */

  const updateAttr = (i, field, val) => {
    const copy = [...attributes];
    copy[i][field] = val;
    setAttributes(copy);
  };

  const addAttrRow = () =>
    setAttributes([...attributes, { key: "", value: "" }]);

  const removeAttr = (i) =>
    setAttributes(attributes.filter((_, idx) => idx !== i));

  /* ================= SIZE CHART ================= */

  const updateSizeRow = (i, field, val) => {
    const copy = [...sizeChart];
    copy[i][field] = val;
    setSizeChart(copy);
  };

  const addSizeRow = () =>
    setSizeChart([
      ...sizeChart,
      { size: "", chest: "", waist: "", length: "", shoulder: "" },
    ]);

  const removeSizeRow = (i) =>
    setSizeChart(sizeChart.filter((_, idx) => idx !== i));

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name required");
      return;
    }

    const attrObj = {};
    attributes.forEach((r) => {
      if (r.key) attrObj[r.key] = r.value;
    });

    setSaving(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        categoryId: form.categoryId,
        brand: form.brand,
        attributes: attrObj,
        sizeChart,
        tags: form.tags.split(",").map((s) => s.trim()),
        sizeOptions: form.sizeOptions
          .split(",")
          .map((s) => s.trim().toUpperCase()),
        isActive: form.isActive,
        isPublished: form.isPublished,
      };

      await api.put(`/products/admin/updateproduct/${id}`, payload);

      toast.success("Product updated");
      router.push("/admin/dashboard/products");

    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="p-10 text-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow">

      <Typography variant="h5" mb={3}>
        Edit Product
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>

          <TextField
            label="Product Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <TextField
            label="Description"
            multiline
            minRows={4}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* CATEGORY SEARCH */}
          <TextField
            label="Search Category"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            helperText={categoryLoading ? "Searching..." : ""}
          />

          {/* CATEGORY DROPDOWN */}
          <TextField
            select
            label="Category"
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
          >
            {categories.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Brand"
            value={form.brand}
            onChange={(e) =>
              setForm({ ...form, brand: e.target.value })
            }
          />

          <TextField
            label="Tags (comma separated)"
            value={form.tags}
            onChange={(e) =>
              setForm({ ...form, tags: e.target.value })
            }
          />

          <TextField
            label="Size Options (S,M,L)"
            value={form.sizeOptions}
            onChange={(e) =>
              setForm({ ...form, sizeOptions: e.target.value })
            }
          />

          {/* ATTRIBUTES */}
          <Paper sx={{ p: 2 }}>
            <Typography mb={2}>Attributes</Typography>

            {attributes.map((row, i) => (
              <Grid container spacing={2} key={i} mb={1}>
                <Grid item xs={5}>
                  <TextField
                    label="Key"
                    fullWidth
                    value={row.key}
                    onChange={(e) =>
                      updateAttr(i, "key", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    label="Value"
                    fullWidth
                    value={row.value}
                    onChange={(e) =>
                      updateAttr(i, "value", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <IconButton onClick={() => removeAttr(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button onClick={addAttrRow}>
              Add Attribute
            </Button>
          </Paper>

          {/* SIZE CHART */}
          <Paper sx={{ p: 2 }}>
            <Typography mb={2}>Size Chart</Typography>

            {sizeChart.map((row, i) => (
              <Grid container spacing={2} key={i} mb={1}>
                {["size","chest","waist","length","shoulder"].map(f => (
                  <Grid item xs={2.4} key={f}>
                    <TextField
                      label={f}
                      fullWidth
                      value={row[f] || ""}
                      onChange={(e) =>
                        updateSizeRow(i, f, e.target.value)
                      }
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Button color="error" onClick={() => removeSizeRow(i)}>
                    Remove Row
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Button onClick={addSizeRow}>
              Add Size Row
            </Button>
          </Paper>

          {/* FLAGS */}
          <div className="flex gap-6">
            <label>
              <Switch
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              Active
            </label>

            <label>
              <Switch
                checked={form.isPublished}
                onChange={(e) =>
                  setForm({ ...form, isPublished: e.target.checked })
                }
              />
              Published
            </label>
          </div>

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            size="large"
          >
            {saving ? <CircularProgress size={22} /> : "Update Product"}
          </Button>

        </Stack>
      </form>
    </div>
  );
}
