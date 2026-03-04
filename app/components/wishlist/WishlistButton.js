// "use client";

// import { useAuth } from "@/contexts/AuthContext";
// import { useWishlist } from "@/hooks/useWishlist";
// import { Heart } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function WishlistButton({ productId, className = "" }) {
//   const router = useRouter();
//   const { toggle, isInWishlist } = useWishlist();
//   const { user } = useAuth();

//   const handleClick = (e) => {
//     e.preventDefault(); 
//     e.stopPropagation(); 

//     if (!user) {
//       router.push("/customer/login");
//       return;
//     }

//     toggle(productId);
//   };

//   const active = isInWishlist(productId);

//   return (
//     <button
//       onClick={handleClick}
//       className={`absolute top-2 right-2 ${className}`}
//     >
//       <Heart
//         size={20}
//         className={`transition ${
//           active
//             ? "fill-red-500 text-red-500"
//             : "text-gray-400 hover:text-red-500"
//         }`}
//       />
//     </button>
//   );
// }












"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WishlistButton({ productId, className = "" }) {
  const router = useRouter();
  const { toggle } = useWishlist();
  const { user } = useAuth();

  const [active, setActive] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/customer/login");
      return;
    }

    setActive((prev) => !prev); // local UI toggle
    toggle(productId);
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute top-2 right-2 ${className}`}
    >
      <Heart
        size={20}
        className={`transition ${
          active
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-500"
        }`}
      />
    </button>
  );
}