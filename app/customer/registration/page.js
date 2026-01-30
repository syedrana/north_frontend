"use client";

import api from "@/lib/api";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^01[3-9]\d{8}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!form.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!validateEmail(form.email)) {
      toast.error("Please provide a valid email address!");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Phone is required");
      return;
    }
    if (!validatePhone(form.phone)) {
      toast.error("Please provide a valid Bangladeshi phone number!");
      return;
    }
    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      };

      const res = await api.post("/customer/register", payload);
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message); // Mongoose ভ্যালিডেশন এরর
        return;
      }
      toast.success("Registration Successful!");
      //router.push(`/admin/dashboard/products/variant/${res.data.product._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Box className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
        {/* Heading */}
        <Typography
          variant="h5"
          className="text-gray-900 font-semibold text-center mb-8"
        >
          Create Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: "14px",
                fontWeight: 600,
                background: "linear-gradient(90deg, #7c3aed, #ec4899)",
              }}
            >
              Register
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}