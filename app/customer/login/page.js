"use client";

import api from "@/lib/api";
import { clearGuestCart, getGuestCart } from "@/lib/guestCart";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.emailOrPhone.trim()) {
      toast.error("Email or phone is required");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const guestCart = getGuestCart();

      const payload = {
        emailOrPhone: form.emailOrPhone,
        password: form.password,
        guestCart,
      };

      const res = await api.post("/customer/login", payload);
      const data = res.data;

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      clearGuestCart();
      toast.success("Login successful!");
      window.dispatchEvent(new Event("auth-changed"));
      window.dispatchEvent(new Event("cart-changed"));
      router.push("/"); // অথবা dashboard
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Box className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
        <Typography
          variant="h5"
          className="text-gray-900 font-semibold text-center mb-8"
        >
          Login to Your Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Email or Phone"
              name="emailOrPhone"
              value={form.emailOrPhone}
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
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: "14px",
                fontWeight: 600,
                background: "linear-gradient(90deg, #7c3aed, #ec4899)",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
