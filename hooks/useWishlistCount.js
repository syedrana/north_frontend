// "use client";

// import api from "@/lib/api";
// import { useCallback, useEffect, useState } from "react";

// export default function useWishlistCount() {
//   const [count, setCount] = useState(0);

//   const load = useCallback(async () => {
//     try {
//       const res = await api.get("/wishlist/count");
//       setCount(res.data?.count || 0);
//     } catch (err) {
//       console.error("Wishlist count load failed:", err);
//     }
//   }, []);

//   useEffect(() => {
//     // wrapped call (not directly invoking async body logic)
//     const init = async () => {
//       await load();
//     };

//     init();

//     window.addEventListener("focus", load);

//     return () => {
//       window.removeEventListener("focus", load);
//     };
//   }, [load]);

//   return { count, refresh: load };
// }