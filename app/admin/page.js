"use client";

import { useGuest } from "@/hooks/useGuest";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
// import { isTokenValid } from "../../utils/auth";

import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  useGuest();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token && isTokenValid(token)) {
  //     router.replace("/admin/dashboard");
  //   } else {
  //     localStorage.clear();
  //   }
  // }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    // 🔐 Frontend validation (toast-based)
    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/admin/login",formData,);

      const { access_token, role } = res.data;

      if (!["admin"].includes(role)) {
        toast.error("You are not authorized to access admin panel");
        localStorage.clear();
        return;
      }

      localStorage.setItem("token", access_token);
      localStorage.setItem("userRole", role);

      toast.success("Login successful");
      router.replace("/admin/dashboard");

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const fieldSX = {
    mb: 3,
    input: { color: "#fff" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#6366f1" },
      "&:hover fieldset": { borderColor: "#818cf8" },
      "&.Mui-focused fieldset": { borderColor: "#a5b4fc" },
    },
    "& input::selection": {
      background: "#6366f1",
      color: "#fff",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Admin Control Panel
        </h2>

        <form noValidate onSubmit={handleSubmit}>

          {/* Username */}
          <TextField
            label="Admin Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            sx={fieldSX}
            slotProps={{
              inputLabel: { sx: { color: "#c7d2fe" } },
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            sx={fieldSX}
            slotProps={{
              inputLabel: { sx: { color: "#c7d2fe" } },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      sx={{ color: "#c7d2fe" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-indigo-500 to-purple-600
              hover:scale-[1.02] transition-all duration-300
              shadow-lg flex items-center justify-center"
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Secure Login"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
