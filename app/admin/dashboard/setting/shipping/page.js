// "use client";

// import api from "@/lib/apiSet";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SaveIcon from "@mui/icons-material/Save";
// import {
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   FormControlLabel,
//   Grid,
//   IconButton,
//   Stack,
//   Switch,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// export default function DeliverySettingAdminPage() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [form, setForm] = useState({
//     insideCityFee: 80,
//     outsideCityFee: 150,
//     freeAbove: 3000,
//     codExtraFee: 0,
//     insideCityName: "Dhaka",
//     bulkyInsideFee: 40,
//     bulkyOutsideFee: 80,
//     isActive: true,
//     weightSlabs: [],
//   });

//   useEffect(() => {
//     loadSetting();
//   }, []);

//   const loadSetting = async () => {
//     try {
//       const { data } = await api.get("/deliverysetting");
//       if (data) setForm({ ...data, weightSlabs: data.weightSlabs || [] });
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (key, value) => {
//     setForm((p) => ({ ...p, [key]: value }));
//   };

//   const handleSlabChange = (i, key, value) => {
//     const copy = [...form.weightSlabs];
//     copy[i][key] = Number(value);
//     setForm((p) => ({ ...p, weightSlabs: copy }));
//   };

//   const addSlab = () => {
//     setForm((p) => ({
//       ...p,
//       weightSlabs: [
//         ...p.weightSlabs,
//         { uptoGram: 1, insideExtra: 0, outsideExtra: 0 },
//       ],
//     }));
//   };

//   const removeSlab = (i) => {
//     const copy = [...form.weightSlabs];
//     copy.splice(i, 1);
//     setForm((p) => ({ ...p, weightSlabs: copy }));
//   };

//   const save = async () => {
//     try {
//       setSaving(true);
//       const { data } = await api.post("/deliverysetting", form);
//       setForm(data);
//       toast.success("Saved successfully");
//     } catch (e) {
//       console.error(e);
//       toast.error("Save failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <Typography p={4}>Loading...</Typography>;

//   return (
//     <Stack spacing={3} p={3}>
//       <Typography variant="h5" fontWeight={700}>
//         Delivery Settings
//       </Typography>

//       <Card sx={{ borderRadius: 3 }}>
//         <CardContent>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="Inside City Name"
//                 fullWidth
//                 value={form.insideCityName}
//                 onChange={(e) => handleChange("insideCityName", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="Inside City Fee"
//                 type="number"
//                 fullWidth
//                 value={form.insideCityFee}
//                 onChange={(e) => handleChange("insideCityFee", Number(e.target.value))}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="Outside City Fee"
//                 type="number"
//                 fullWidth
//                 value={form.outsideCityFee}
//                 onChange={(e) => handleChange("outsideCityFee", Number(e.target.value))}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="Free Delivery Above"
//                 type="number"
//                 fullWidth
//                 value={form.freeAbove}
//                 onChange={(e) => handleChange("freeAbove", Number(e.target.value))}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="COD Extra Fee"
//                 type="number"
//                 fullWidth
//                 value={form.codExtraFee}
//                 onChange={(e) => handleChange("codExtraFee", Number(e.target.value))}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="Bulky Inside Fee"
//                 type="number"
//                 fullWidth
//                 value={form.bulkyInsideFee}
//                 onChange={(e) => handleChange("bulkyInsideFee", Number(e.target.value))}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="Bulky Outside Fee"
//                 type="number"
//                 fullWidth
//                 value={form.bulkyOutsideFee}
//                 onChange={(e) => handleChange("bulkyOutsideFee", Number(e.target.value))}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={form.isActive}
//                     onChange={(e) => handleChange("isActive", e.target.checked)}
//                   />
//                 }
//                 label="Active"
//               />
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       <Card sx={{ borderRadius: 3 }}>
//         <CardContent>
//           <Stack
//             direction="row"
//             alignItems="center"
//             justifyContent="space-between"
//             mb={2}
//           >
//             <Typography fontWeight={700}>Weight Slabs</Typography>
//             <Button
//               startIcon={<AddIcon />}
//               variant="outlined"
//               onClick={addSlab}
//             >
//               Add Slab
//             </Button>
//           </Stack>

//           <Stack spacing={2}>
//             {form.weightSlabs.map((slab, i) => (
//               <Card key={i} variant="outlined" sx={{ borderRadius: 2 }}>
//                 <CardContent>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid item xs={12} md={3}>
//                       <TextField
//                         label="Upto Gram"
//                         type="number"
//                         fullWidth
//                         value={slab.uptoGram}
//                         onChange={(e) =>
//                           handleSlabChange(i, "uptoGram", e.target.value)
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={3}>
//                       <TextField
//                         label="Inside Extra"
//                         type="number"
//                         fullWidth
//                         value={slab.insideExtra}
//                         onChange={(e) =>
//                           handleSlabChange(i, "insideExtra", e.target.value)
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={3}>
//                       <TextField
//                         label="Outside Extra"
//                         type="number"
//                         fullWidth
//                         value={slab.outsideExtra}
//                         onChange={(e) =>
//                           handleSlabChange(i, "outsideExtra", e.target.value)
//                         }
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={3}>
//                       <IconButton
//                         color="error"
//                         onClick={() => removeSlab(i)}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             ))}
//           </Stack>
//         </CardContent>
//       </Card>

//       <Divider />

//       <Stack direction="row" justifyContent="flex-end">
//         <Button
//           startIcon={<SaveIcon />}
//           variant="contained"
//           size="large"
//           disabled={saving}
//           onClick={save}
//         >
//           {saving ? "Saving..." : "Save Settings"}
//         </Button>
//       </Stack>
//     </Stack>
//   );
// }























"use client";

import api from "@/lib/apiSet";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DeliverySettingAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    insideCityFee: 80,
    outsideCityFee: 150,
    freeAbove: 3000,
    insideCityName: "Dhaka",
    bulkyInsideFee: 40,
    bulkyOutsideFee: 80,
    isActive: true,
    weightSlabs: [],
    codSlabs: [],
  });

  useEffect(() => {
    loadSetting();
  }, []);

  const loadSetting = async () => {
    try {
      const { data } = await api.get("/deliverysetting");
      if (data) {
        setForm({
          ...data,
          weightSlabs: data.weightSlabs || [],
          codSlabs: data.codSlabs || [],
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  // =========================
  // Weight Slabs
  // =========================

  const handleWeightSlabChange = (i, key, value) => {
    const copy = [...form.weightSlabs];
    copy[i][key] = Number(value);
    setForm((p) => ({ ...p, weightSlabs: copy }));
  };

  const addWeightSlab = () => {
    setForm((p) => ({
      ...p,
      weightSlabs: [
        ...p.weightSlabs,
        { uptoGram: 1, insideExtra: 0, outsideExtra: 0 },
      ],
    }));
  };

  const removeWeightSlab = (i) => {
    const copy = [...form.weightSlabs];
    copy.splice(i, 1);
    setForm((p) => ({ ...p, weightSlabs: copy }));
  };

  // =========================
  // COD Slabs
  // =========================

  const handleCodSlabChange = (i, key, value) => {
    const copy = [...form.codSlabs];
    copy[i][key] = Number(value);
    setForm((p) => ({ ...p, codSlabs: copy }));
  };

  const addCodSlab = () => {
    setForm((p) => ({
      ...p,
      codSlabs: [...p.codSlabs, { min: 0, max: 0, fee: 0 }],
    }));
  };

  const removeCodSlab = (i) => {
    const copy = [...form.codSlabs];
    copy.splice(i, 1);
    setForm((p) => ({ ...p, codSlabs: copy }));
  };

  const save = async () => {
    try {
      setSaving(true);

      const payload = {
        insideCityFee: Number(form.insideCityFee),
        outsideCityFee: Number(form.outsideCityFee),
        freeAbove: Number(form.freeAbove),
        insideCityName: form.insideCityName,
        bulkyInsideFee: Number(form.bulkyInsideFee),
        bulkyOutsideFee: Number(form.bulkyOutsideFee),
        weightSlabs: form.weightSlabs,
        codSlabs: form.codSlabs,
      };

      const { data } = await api.post("/deliverysetting", payload);
      setForm(data);
      toast.success("Saved successfully");
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography p={4}>Loading...</Typography>;

  return (
    <Stack spacing={3} p={3}>
      <Typography variant="h5" fontWeight={700}>
        Delivery Settings
      </Typography>

      {/* ================= BASIC SETTINGS ================= */}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Inside City Name"
                fullWidth
                value={form.insideCityName}
                onChange={(e) =>
                  handleChange("insideCityName", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Inside City Fee"
                type="number"
                fullWidth
                value={form.insideCityFee}
                onChange={(e) =>
                  handleChange("insideCityFee", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Outside City Fee"
                type="number"
                fullWidth
                value={form.outsideCityFee}
                onChange={(e) =>
                  handleChange("outsideCityFee", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Free Delivery Above"
                type="number"
                fullWidth
                value={form.freeAbove}
                onChange={(e) =>
                  handleChange("freeAbove", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Bulky Inside Fee"
                type="number"
                fullWidth
                value={form.bulkyInsideFee}
                onChange={(e) =>
                  handleChange("bulkyInsideFee", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Bulky Outside Fee"
                type="number"
                fullWidth
                value={form.bulkyOutsideFee}
                onChange={(e) =>
                  handleChange("bulkyOutsideFee", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ================= WEIGHT SLABS ================= */}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography fontWeight={700}>Weight Slabs</Typography>
            <Button startIcon={<AddIcon />} onClick={addWeightSlab}>
              Add
            </Button>
          </Stack>

          {form.weightSlabs.map((slab, i) => (
            <Grid container spacing={2} key={i} mb={2}>
              <Grid item xs={4}>
                <TextField
                  label="Upto Gram"
                  type="number"
                  fullWidth
                  value={slab.uptoGram}
                  onChange={(e) =>
                    handleWeightSlabChange(i, "uptoGram", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Inside Extra"
                  type="number"
                  fullWidth
                  value={slab.insideExtra}
                  onChange={(e) =>
                    handleWeightSlabChange(i, "insideExtra", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Outside Extra"
                  type="number"
                  fullWidth
                  value={slab.outsideExtra}
                  onChange={(e) =>
                    handleWeightSlabChange(i, "outsideExtra", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton color="error" onClick={() => removeWeightSlab(i)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>

      {/* ================= COD SLABS ================= */}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography fontWeight={700}>COD Slabs</Typography>
            <Button startIcon={<AddIcon />} onClick={addCodSlab}>
              Add
            </Button>
          </Stack>

          {form.codSlabs.map((slab, i) => (
            <Grid container spacing={2} key={i} mb={2}>
              <Grid item xs={3}>
                <TextField
                  label="Min"
                  type="number"
                  fullWidth
                  value={slab.min}
                  onChange={(e) =>
                    handleCodSlabChange(i, "min", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Max"
                  type="number"
                  fullWidth
                  value={slab.max}
                  onChange={(e) =>
                    handleCodSlabChange(i, "max", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Fee"
                  type="number"
                  fullWidth
                  value={slab.fee}
                  onChange={(e) =>
                    handleCodSlabChange(i, "fee", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <IconButton color="error" onClick={() => removeCodSlab(i)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>

      <Divider />

      <Stack direction="row" justifyContent="flex-end">
        <Button
          startIcon={<SaveIcon />}
          variant="contained"
          size="large"
          disabled={saving}
          onClick={save}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </Stack>
    </Stack>
  );
}
