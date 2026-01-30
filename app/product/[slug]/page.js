// import apiServer from "@/lib/apiServer";
// import ClientOnly from "@/utils/ClientOnly";
// import { cookies } from "next/headers";
// import Image from "next/image";
// import { notFound } from "next/navigation";
// import AddToCartButton from "../../components/cart/AddToCartButton";
// import BuyNowButton from "../../components/cart/BuyNowButton";

// /* ================= SEO (SAFE) ================= */
// export async function generateMetadata({ params }) {
//   const { slug } = await params;

//   try {
//     const { data } = await apiServer.get(`/products/${slug}`);
//     const product = data.product;

//     const variants = product?.variants ?? [];
//     const defaultVariant =
//       variants.find((v) => v.isDefault) ?? variants[0];

//     const ogImage =
//       defaultVariant?.images?.[0]?.url ?? "/placeholder.png";

//     return {
//       title: product.name,
//       description: product.description,
//       openGraph: {
//         title: product.name,
//         description: product.description,
//         images: [ogImage],
//       },
//     };
//   } catch {
//     return {
//       title: "Product not found",
//     };
//   }
// }

// /* ================= ISR ================= */
// export const revalidate = 60;

// /* ================= PAGE ================= */
// export default async function ProductPage({ params }) {
//   const cookieStore = cookies();
//   const accessToken = cookieStore.get?.("accessToken")?.value;

//   const isAuthenticated = Boolean(accessToken);
  
//   const { slug } = await params;

//   let product;

//   try {
//     const { data } = await apiServer.get(`/products/${slug}`);
//     product = data.product;
//   } catch {
//     notFound();
//   }

//   /* ===== SAFE VARIANT LOGIC ===== */
//   const variants = product?.variants ?? [];

//   if (variants.length === 0) {
//     notFound();
//   }

//   const defaultVariant =
//     variants.find((v) => v.isDefault) ?? variants[0];

//   const mainImage =
//     defaultVariant?.images?.[0]?.url ?? "/placeholder.png";

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
//       {/* ================= IMAGE ================= */}
//       <div className="relative w-full h-[420px] bg-gray-100 rounded-xl overflow-hidden">
//         <Image
//           src={mainImage}
//           alt={product.name}
//           fill
//           priority
//           className="object-cover"
//         />

//         {/* STOCK BADGE */}
//         {defaultVariant.stock === 0 && (
//           <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded">
//             Out of stock
//           </span>
//         )}

//         {defaultVariant.stock > 0 && defaultVariant.stock <= 5 && (
//           <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded">
//             Low stock
//           </span>
//         )}
//       </div>

//       {/* ================= DETAILS ================= */}
//       <div>
//         <h1 className="text-3xl font-bold">{product.name}</h1>
//         <p className="text-gray-600 mt-3">{product.description}</p>

//         {/* PRICE */}
//         <div className="mt-4 flex items-center gap-3">
//           <span className="text-2xl font-semibold text-indigo-600">
//             ৳ {defaultVariant.discountPrice || defaultVariant.price}
//           </span>

//           {defaultVariant.discountPrice > 0 && (
//             <span className="text-sm text-gray-400 line-through">
//               ৳ {defaultVariant.price}
//             </span>
//           )}
//         </div>


//         {/* VARIANTS */}
//         <div className="mt-8">
//           <h3 className="font-semibold mb-3">Available Variants</h3>

//           <div className="flex gap-3 flex-wrap">
//             {variants.map((variant) => (
//               <div
//                 key={variant._id}
//                 className={`px-4 py-2 rounded border cursor-pointer transition
//                   ${
//                     variant._id === defaultVariant._id
//                       ? "border-indigo-600 bg-indigo-50"
//                       : "border-gray-300 hover:border-indigo-400"
//                   }
//                 `}
//               >
//                 <p className="text-sm font-medium">
//                   {variant.color} • {variant.size}
//                 </p>

//                 <p className="text-xs text-gray-500">
//                   ৳ {variant.price}
//                 </p>

//                 {variant.stock === 0 && (
//                   <span className="block text-xs text-red-500 font-semibold mt-1">
//                     Out of stock
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-10 grid grid-cols-2 gap-4">
//           <ClientOnly>
//             <AddToCartButton
//               variantId={defaultVariant._id}
//               disabled={defaultVariant.stock === 0}
//               isAuthenticated={isAuthenticated}
//             />

//             <BuyNowButton
//               variantId={defaultVariant._id}
//               disabled={defaultVariant.stock === 0}
//             />
//           </ClientOnly>
//         </div>


//       </div>
//     </div>
//   );
// }




import apiServer from "@/lib/apiServer";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";


/* ================= SEO (SAFE) ================= */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const { data } = await apiServer.get(`/products/${slug}`);
    const product = data.product;

    const variants = product?.variants ?? [];
    const defaultVariant =
      variants.find((v) => v.isDefault) ?? variants[0];

    const ogImage =
      defaultVariant?.images?.[0]?.url ?? "/placeholder.png";

    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Product not found",
    };
  }
}

/* ================= ISR ================= */
export const revalidate = 60;

export default async function ProductPage({ params, searchParams  }) {
  const { slug } = await params;
  const { variant } = await searchParams;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get?.("accessToken")?.value;
  const isAuthenticated = Boolean(accessToken);

  let product;

  try {
    const { data } = await apiServer.get(`/products/${slug}`);
    product = data.product;
  } catch {
    notFound();
  }

  const variants = product?.variants ?? [];
  if (variants.length === 0) notFound();

  // const defaultVariant =
  //   variants.find((v) => v.isDefault) ?? variants[0];

  const defaultVariant =
    variants.find((v) => v._id === variant) ||
    variants.find((v) => v.isDefault) ||
    variants[0];

  return (
    <ProductClient
      product={product}
      variants={variants}
      defaultVariant={defaultVariant}
      isAuthenticated={isAuthenticated}
    />
  );
}
