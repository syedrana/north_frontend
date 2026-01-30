// "use client";

// import api from "@/lib/api";
// import { Button } from "@mui/material";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import toast from "react-hot-toast";

// export default function BuyNowButton({
//   variantId,
//   disabled = false,
//   quantity = 1,
// }) {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleBuyNow = async () => {
//     if (!variantId) {
//       toast.error("Please select a variant");
//       return;
//     }

//     try {
//       setLoading(true);

//       const { data } = await api.post("/cart/add", {
//         variantId,
//         quantity,
//       });

//       if (!data.success) {
//         toast.error(data.message || "Failed to add to cart");
//         return;
//       }

//       router.push("/checkout");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

  // return (
  //   <Button
  //       fullWidth
  //       size="large"
  //       disabled={disabled || loading}
  //       onClick={handleBuyNow}
  //       sx={{
  //           py: 1.6,
  //           borderRadius: "2px",
  //           fontWeight: 700,
  //           textTransform: "none",
  //           color: "#fff",
  //           background: "linear-gradient(135deg, #111827, #1f2937)",
  //           boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
  //           transition: "all 0.25s ease",
  //           "&:hover": {
  //           transform: "translateY(-1px)",
  //           boxShadow: "0 20px 55px rgba(0,0,0,0.45)",
  //           background: "linear-gradient(135deg, #000, #111827)",
  //           },
  //       }}
  //       >
  //       {loading ? "Processing..." : "Buy Now"}
  //   </Button>

  // );
// }



"use client";

import apiServer from "@/lib/apiServer";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuyNowButton({ variantId, disabled = false, }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const buyNow = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await apiServer.post("/checkout/buy-now", {
        variantId,
        quantity: 1,
      });

      router.push("/checkout");
    } catch (err) {
      console.error("Buy now failed", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    
    <Button 
      fullWidth
      size="large"
      disabled={disabled || loading}
      onClick={buyNow} 
      sx={{
            py: 1.6,
            borderRadius: "2px",
            fontWeight: 700,
            textTransform: "none",
            color: "#fff",
            background: "linear-gradient(135deg, #111827, #1f2937)",
            boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
            transition: "all 0.25s ease",
            "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 20px 55px rgba(0,0,0,0.45)",
            background: "linear-gradient(135deg, #000, #111827)",
            },
        }}
    >
      {loading ? "Processing..." : "Buy Now"}
    </Button>
  );
}
