"use client";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function AddressForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    division: "",
    district: "",
    area: "",
    addressLine: "",
    addressType: "Home",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Box
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h6" mb={3}>
        Shipping Address
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Full name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Phone number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            required
            helperText="Example: 017XXXXXXXX"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Division"
            name="division"
            value={form.division}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="District"
            name="district"
            value={form.district}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Area / Upazila"
            name="area"
            value={form.area}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Detailed address"
            name="addressLine"
            value={form.addressLine}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            label="Address type"
            name="addressType"
            value={form.addressType}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Home">Home</MenuItem>
            <MenuItem value="Office">Office</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 4,
          py: 1.4,
          backgroundColor: "#000",
          "&:hover": { backgroundColor: "#111" },
        }}
        disabled={loading}
        onClick={handleSubmit}
      >
        Continue
      </Button>
    </Box>
  );
}
