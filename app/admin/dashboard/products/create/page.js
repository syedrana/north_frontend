// "use client";

// import api from "@/lib/api";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";


// import {
//   Autocomplete,
//   Button,
//   CircularProgress,
//   Stack,
//   Switch,
//   TextField,
// } from "@mui/material";

// export default function AdminProductCreatePage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [categoryLoading, setCategoryLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [searchText, setSearchText] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     categoryId: null,
//     brand: "",
//     isActive: true,
//   });

//   // 🔍 Load categories ONLY when typing
//   useEffect(() => {
//     if (!searchText) {
//       setCategories([]);
//       return;
//     }

//     const delayDebounce = setTimeout(() => {
//       fetchCategories(searchText);
//     }, 400); // debounce

//     return () => clearTimeout(delayDebounce);
//   }, [searchText]);

//   const fetchCategories = async (search) => {
//     try {
//       setCategoryLoading(true);
//       const res = await api.get(`/categorys?search=${search}`);
//       setCategories(res.data.categories || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setCategoryLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name.trim()) {
//       toast.error("Product name is required");
//       return;
//     }

//     if (!form.categoryId?._id) {
//       toast.error("Please select a category");
//       return;
//     }

//     if (!form.description.trim()) {
//       toast.error("Description name is required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         name: form.name,
//         description: form.description,
//         categoryId: form.categoryId?._id,
//         brand: form.brand,
//         isActive: form.isActive,
//       };

//       const res = await api.post("/products/admin/createproduct", payload);
//       router.push(`/admin/dashboard/products/variant/${res.data.product._id}`);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Product create failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Create Product</h1>

//       <form onSubmit={handleSubmit}>
//         <Stack spacing={3}>
//           {/* Product Name */}
//           <TextField
//             fullWidth
//             label="Product Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             required
//           />

//           {/* Description */}
//           <TextField
//             fullWidth
//             label="Description"
//             multiline
//             minRows={4}
//             value={form.description}
//             onChange={(e) =>
//               setForm({ ...form, description: e.target.value })
//             }
//             required
//           />

//           {/* 🔍 Searchable Category (Lazy Load) */}
//           <Autocomplete
//             options={categories}
//             loading={categoryLoading}
//             value={form.categoryId}
//             getOptionLabel={(option) => option.name || ""}
//             onChange={(e, value) =>
//               setForm({ ...form, categoryId: value })
//             }
//             onInputChange={(e, value) => setSearchText(value)}
//             noOptionsText={
//               searchText ? "No category found" : "Type to search category"
//             }
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Search Category"
//                 required
//                 slotProps={{
//                   ...params.InputProps,
//                   endAdornment: (
//                     <>
//                       {categoryLoading ? (
//                         <CircularProgress size={20} />
//                       ) : null}
//                       {params.InputProps.endAdornment}
//                     </>
//                   ),
//                 }}
//               />
//             )}
//             renderOption={(props, option) => {
//               const regex = new RegExp(`(${searchText})`, "gi");
//               const parts = option.name.split(regex);

//               return (
//                 <li {...props}>
//                   {parts.map((part, index) =>
//                     part.toLowerCase() === searchText.toLowerCase() ? (
//                       <span
//                         key={index}
//                         className="font-semibold text-blue-600"
//                       >
//                         {part}
//                       </span>
//                     ) : (
//                       <span key={index}>{part}</span>
//                     )
//                   )}
//                 </li>
//               );
//             }}
//           />

//           {/* Brand */}
//           <TextField
//             fullWidth
//             label="Brand"
//             value={form.brand}
//             onChange={(e) => setForm({ ...form, brand: e.target.value })}
//           />

//           {/* Status */}
//           <div className="flex items-center gap-4">
//             <Switch
//               checked={form.isActive}
//               onChange={(e) =>
//                 setForm({ ...form, isActive: e.target.checked })
//               }
//             />
//             <span className="text-sm">
//               {form.isActive ? "Active Product" : "Inactive Product"}
//             </span>
//           </div>

//           {/* Submit */}
//           <div className="pt-4">
//               <Button
//                 type="submit"
//                 variant="contained"
//                 size="large"
//                 disabled={loading}
//                 className="!bg-black"
//               >
//                 {loading ? (
//                   <CircularProgress size={22} className="!text-white" />
//                 ) : (
//                   "Create Product"
//                 )}
//               </Button>
//           </div>
          
//         </Stack>
//       </form>
//     </div>
//   );
// }
















// "use client";

// import api from "@/lib/api";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// import {
//   Autocomplete,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Divider,
//   Stack,
//   Switch,
//   TextField,
//   Typography,
// } from "@mui/material";

// export default function AdminProductCreatePage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [categoryLoading, setCategoryLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [searchText, setSearchText] = useState("");

//   const [sizeInput, setSizeInput] = useState("");
//   const [tagInput, setTagInput] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     categoryId: null,
//     brand: "",
//     isActive: true,
//     isPublished: false,

//     attributes: {
//       fabric: "",
//       fit: "",
//       gender: "",
//     },

//     sizeOptions: [],
//     tags: [],
//     sizeChart: [],
//   });

//   /* ================= CATEGORY SEARCH ================= */

//   useEffect(() => {
//     if (!searchText) return setCategories([]);

//     const t = setTimeout(() => {
//       fetchCategories(searchText);
//     }, 400);

//     return () => clearTimeout(t);
//   }, [searchText]);

//   const fetchCategories = async (search) => {
//     try {
//       setCategoryLoading(true);
//       const res = await api.get(`/categorys?search=${search}`);
//       setCategories(res.data.categories || []);
//     } finally {
//       setCategoryLoading(false);
//     }
//   };

//   /* ================= SIZE OPTIONS ================= */

//   const addSizeOption = () => {
//     const s = sizeInput.trim().toUpperCase();
//     if (!s) return;
//     if (form.sizeOptions.includes(s)) return;
//     setForm(p => ({ ...p, sizeOptions: [...p.sizeOptions, s] }));
//     setSizeInput("");
//   };

//   const removeSize = (s) => {
//     setForm(p => ({
//       ...p,
//       sizeOptions: p.sizeOptions.filter(x => x !== s),
//     }));
//   };

//   /* ================= TAGS ================= */

//   const addTag = () => {
//     const t = tagInput.trim().toLowerCase();
//     if (!t) return;
//     if (form.tags.includes(t)) return;
//     setForm(p => ({ ...p, tags: [...p.tags, t] }));
//     setTagInput("");
//   };

//   /* ================= SIZE CHART ================= */

//   const addSizeChartRow = () => {
//     setForm(p => ({
//       ...p,
//       sizeChart: [
//         ...p.sizeChart,
//         { size: "", chest: "", waist: "", length: "", shoulder: "" },
//       ],
//     }));
//   };

//   const updateSizeChart = (i, field, val) => {
//     const arr = [...form.sizeChart];
//     arr[i][field] = val;
//     setForm(p => ({ ...p, sizeChart: arr }));
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name.trim()) return toast.error("Name required");
//     if (!form.categoryId?._id) return toast.error("Category required");
//     if (!form.description.trim()) return toast.error("Description required");

//     setLoading(true);

//     try {
//       const payload = {
//         ...form,
//         categoryId: form.categoryId._id,
//         attributes: JSON.stringify(form.attributes),
//         sizeOptions: JSON.stringify(form.sizeOptions),
//         tags: JSON.stringify(form.tags),
//         sizeChart: JSON.stringify(form.sizeChart),
//       };

//       const res = await api.post(
//         "/products/admin/createproduct",
//         payload
//       );

//       router.push(
//         `/admin/dashboard/products/variant/${res.data.product._id}`
//       );
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Create failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       <Typography variant="h4" fontWeight={700} mb={3}>
//         Create Product
//       </Typography>

//       <form onSubmit={handleSubmit}>
//         <Stack spacing={4}>

//           {/* BASIC INFO */}
//           <Card>
//             <CardContent>
//               <Typography fontWeight={600} mb={2}>
//                 Basic Information
//               </Typography>

//               <Stack spacing={3}>
//                 <TextField
//                   label="Product Name"
//                   value={form.name}
//                   onChange={(e) =>
//                     setForm({ ...form, name: e.target.value })
//                   }
//                   required
//                   fullWidth
//                 />

//                 <TextField
//                   label="Description"
//                   multiline
//                   minRows={4}
//                   value={form.description}
//                   onChange={(e) =>
//                     setForm({ ...form, description: e.target.value })
//                   }
//                   required
//                 />

//                 <TextField
//                   label="Brand"
//                   value={form.brand}
//                   onChange={(e) =>
//                     setForm({ ...form, brand: e.target.value })
//                   }
//                 />
//               </Stack>
//             </CardContent>
//           </Card>

//           {/* CATEGORY */}
//           <Card>
//             <CardContent>
//               <Typography fontWeight={600} mb={2}>
//                 Category
//               </Typography>

//               <Autocomplete
//                 options={categories}
//                 loading={categoryLoading}
//                 value={form.categoryId}
//                 getOptionLabel={(o) => o.name || ""}
//                 onChange={(e, v) =>
//                   setForm({ ...form, categoryId: v })
//                 }
//                 onInputChange={(e, v) => setSearchText(v)}
//                 renderInput={(params) => (
//                   <TextField {...params} label="Search Category" required />
//                 )}
//               />
//             </CardContent>
//           </Card>

//           {/* ATTRIBUTES */}
//           <Card>
//             <CardContent>
//               <Typography fontWeight={600} mb={2}>
//                 Attributes
//               </Typography>

//               <Stack direction="row" spacing={2}>
//                 <TextField label="Fabric"
//                   value={form.attributes.fabric}
//                   onChange={(e)=>
//                     setForm({...form,
//                       attributes:{...form.attributes,fabric:e.target.value}
//                     })
//                   }/>

//                 <TextField label="Fit"
//                   value={form.attributes.fit}
//                   onChange={(e)=>
//                     setForm({...form,
//                       attributes:{...form.attributes,fit:e.target.value}
//                     })
//                   }/>

//                 <TextField label="Gender"
//                   value={form.attributes.gender}
//                   onChange={(e)=>
//                     setForm({...form,
//                       attributes:{...form.attributes,gender:e.target.value}
//                     })
//                   }/>
//               </Stack>
//             </CardContent>
//           </Card>

//           {/* SIZE OPTIONS — HYBRID BASE */}
//           <Card>
//             <CardContent>
//               <Typography fontWeight={600} mb={2}>
//                 Size Options (Dropdown Base)
//               </Typography>

//               <Stack direction="row" spacing={2}>
//                 <TextField
//                   label="Add Size"
//                   value={sizeInput}
//                   onChange={(e) => setSizeInput(e.target.value)}
//                 />
//                 <Button onClick={addSizeOption}>Add</Button>
//               </Stack>

//               <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
//                 {form.sizeOptions.map((s) => (
//                   <Chip key={s} label={s} onDelete={() => removeSize(s)} />
//                 ))}
//               </Stack>
//             </CardContent>
//           </Card>

//           {/* TAGS */}
//           <Card>
//             <CardContent>
//               <Typography fontWeight={600} mb={2}>Tags</Typography>

//               <Stack direction="row" spacing={2}>
//                 <TextField
//                   label="Add Tag"
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                 />
//                 <Button onClick={addTag}>Add</Button>
//               </Stack>

//               <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
//                 {form.tags.map((t) => (
//                   <Chip key={t} label={t} />
//                 ))}
//               </Stack>
//             </CardContent>
//           </Card>

//           {/* STATUS */}
//           <Card>
//             <CardContent>
//               <Typography fontWeight={600} mb={2}>Status</Typography>

//               <Stack direction="row" spacing={4}>
//                 <Stack direction="row" spacing={1} alignItems="center">
//                   <Switch
//                     checked={form.isActive}
//                     onChange={(e)=>
//                       setForm({...form,isActive:e.target.checked})
//                     }
//                   />
//                   <span>Active</span>
//                 </Stack>

//                 <Stack direction="row" spacing={1} alignItems="center">
//                   <Switch
//                     checked={form.isPublished}
//                     onChange={(e)=>
//                       setForm({...form,isPublished:e.target.checked})
//                     }
//                   />
//                   <span>Published</span>
//                 </Stack>
//               </Stack>
//             </CardContent>
//           </Card>

//           <Divider />

//           <Button
//             type="submit"
//             variant="contained"
//             size="large"
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={22} /> : "Create Product"}
//           </Button>

//         </Stack>
//       </form>
//     </div>
//   );
// }














"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminProductCreatePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [sizeInput, setSizeInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [attributes, setAttributes] = useState([
    { key: "fabric", value: "" },
    { key: "fit", value: "" },
    { key: "gender", value: "" },
  ]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: null,
    brand: "",
    isActive: true,
    isPublished: false,
    sizeOptions: [],
    tags: [],
    sizeChart: [],
  });

  /* ================= CATEGORY SEARCH ================= */

  useEffect(() => {
    if (!searchText) return setCategories([]);

    const t = setTimeout(() => {
      fetchCategories(searchText);
    }, 400);

    return () => clearTimeout(t);
  }, [searchText]);

  const fetchCategories = async (search) => {
    try {
      setCategoryLoading(true);
      const res = await api.get(`/categorys?search=${search}`);
      setCategories(res.data.categories || []);
    } finally {
      setCategoryLoading(false);
    }
  };

  /* ================= ATTRIBUTES (DYNAMIC) ================= */

  const updateAttr = (i, field, val) => {
    const copy = [...attributes];
    copy[i][field] = val;
    setAttributes(copy);
  };

  const addAttrRow = () => setAttributes([...attributes, { key: "", value: "" }]);

  const removeAttr = (i) => setAttributes(attributes.filter((_, idx) => idx !== i));

  /* ================= SIZE OPTIONS ================= */

  const addSizeOption = () => {
    const s = sizeInput.trim().toUpperCase();
    if (!s || form.sizeOptions.includes(s)) return;

    setForm(p => ({ ...p, sizeOptions: [...p.sizeOptions, s] }));
    setSizeInput("");
  };

  const removeSize = (s) => {
    setForm(p => ({ ...p, sizeOptions: p.sizeOptions.filter(x => x !== s) }));
  };

  /* ================= TAGS ================= */

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || form.tags.includes(t)) return;

    setForm(p => ({ ...p, tags: [...p.tags, t] }));
    setTagInput("");
  };

  /* ================= SIZE CHART ================= */

  const addSizeChartRow = () => {
    setForm(p => ({
      ...p,
      sizeChart: [
        ...p.sizeChart,
        { size: "", chest: "", waist: "", length: "", shoulder: "" },
      ],
    }));
  };

  const updateSizeChart = (i, field, val) => {
    const arr = [...form.sizeChart];
    arr[i][field] = val;
    setForm(p => ({ ...p, sizeChart: arr }));
  };

  const removeSizeRow = (i) => {
    setForm(p => ({ ...p, sizeChart: p.sizeChart.filter((_, idx) => idx !== i) }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Name required");
    if (!form.categoryId?._id) return toast.error("Category required");
    if (!form.description.trim()) return toast.error("Description required");

    const attrObj = {};
    attributes.forEach(r => {
      if (r.key) attrObj[r.key] = r.value;
    });

    setLoading(true);

    try {
      const payload = {
        ...form,
        categoryId: form.categoryId._id,
        attributes: attrObj,
      };

      const res = await api.post("/products/admin/createproduct", payload);

      router.push(`/admin/dashboard/products/variant/${res.data.product._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Typography variant="h4" fontWeight={700} mb={3}>
        Create Product
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>

          {/* BASIC INFO */}
          <Card>
            <CardContent>
              <Typography fontWeight={600} mb={2}>Basic Information</Typography>
              <Stack spacing={3}>
                <TextField
                  label="Product Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Description"
                  multiline
                  minRows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
                <TextField
                  label="Brand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* CATEGORY */}
          <Card>
            <CardContent>
              <Typography fontWeight={600} mb={2}>Category</Typography>
              <Autocomplete
                options={categories}
                loading={categoryLoading}
                value={form.categoryId}
                getOptionLabel={(o) => o.name || ""}
                onChange={(e, v) => setForm({ ...form, categoryId: v })}
                onInputChange={(e, v) => setSearchText(v)}
                renderInput={(params) => <TextField {...params} label="Search Category" required />}
              />
            </CardContent>
          </Card>

          {/* ATTRIBUTES */}
          <Card>
            <CardContent>
              <Typography fontWeight={600} mb={2}>Attributes</Typography>
              {attributes.map((row, i) => (
                <Grid container spacing={2} key={i} mb={1}>
                  <Grid item xs={5}>
                    <TextField
                      label="Key"
                      fullWidth
                      value={row.key}
                      onChange={(e) => updateAttr(i, "key", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      label="Value"
                      fullWidth
                      value={row.value}
                      onChange={(e) => updateAttr(i, "value", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeAttr(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button onClick={addAttrRow}>Add Attribute</Button>
            </CardContent>
          </Card>

          {/* SIZE OPTIONS */}
          <Card>
            <CardContent>
              <Typography fontWeight={600} mb={2}>Size Options</Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Add Size"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                />
                <Button onClick={addSizeOption}>Add</Button>
              </Stack>
              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                {form.sizeOptions.map((s) => (
                  <Chip key={s} label={s} onDelete={() => removeSize(s)} />
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* SIZE CHART */}
          <Card>
            <CardContent>
              <Typography fontWeight={600} mb={2}>Size Chart</Typography>
              {form.sizeChart.map((row, i) => (
                <Grid container spacing={2} key={i} mb={1}>
                  {["size","chest","waist","length","shoulder"].map(f => (
                    <Grid item xs={2.4} key={f}>
                      <TextField
                        label={f}
                        fullWidth
                        value={row[f]}
                        onChange={(e) => updateSizeChart(i, f, e.target.value)}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button color="error" onClick={() => removeSizeRow(i)}>Remove Row</Button>
                  </Grid>
                </Grid>
              ))}
              <Button onClick={addSizeChartRow}>Add Size Row</Button>
            </CardContent>
          </Card>

          {/* TAGS */}
          <Card>
            <CardContent>
              <Typography fontWeight={600} mb={2}>Tags</Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Add Tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <Button onClick={addTag}>Add</Button>
              </Stack>
              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                {form.tags.map((t) => (
                  <Chip key={t} label={t} />
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* STATUS */}
          <Card>
            <CardContent>
              <Typography fontWeight={600} mb={2}>Status</Typography>
              <Stack direction="row" spacing={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Switch
                    checked={form.isActive}
                    onChange={(e)=> setForm({...form,isActive:e.target.checked})}
                  />
                  <span>Active</span>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Switch
                    checked={form.isPublished}
                    onChange={(e)=> setForm({...form,isPublished:e.target.checked})}
                  />
                  <span>Published</span>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Divider />

          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? <CircularProgress size={22} /> : "Create Product"}
          </Button>

        </Stack>
      </form>
    </div>
  );
}
