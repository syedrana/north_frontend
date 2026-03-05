"use client";

import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/apiSet";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddToCartButton({
  variantId,
  disabled = false,
  quantity = 1,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!variantId) {
      toast.error("Please select a variant");
      return;
    }

    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/customer/login");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/cart/add", {
        variantId,
        quantity,
      });

      if (!data.success) {
        toast.error(data.message || "Failed to add to cart");
        return;
      } 

      if (data?.success) {
        toast.success("Added to cart 🛒");
        window.dispatchEvent(new Event("cart-changed"));
        return;
      }

      throw new Error("Add to cart failed");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
        fullWidth
        size="large"
        disabled={disabled || loading}
        onClick={handleAddToCart}
        sx={{
            py: 1.6,
            borderRadius: "2px",
            fontWeight: 600,
            textTransform: "none",
            border: "1.5px solid #e5e7eb",
            color: "#111827",
            backgroundColor: "#fff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            backdropFilter: "blur(8px)",
            transition: "all 0.25s ease",
            "&:hover": {
            borderColor: "#6366f1",
            color: "#6366f1",
            transform: "translateY(-1px)",
            boxShadow: "0 12px 32px rgba(99,102,241,0.18)",
            backgroundColor: "#f9fafb",
            },
        }}
        >
        {loading ? "Adding..." : "Add to Cart"}
    </Button>

  );
}
