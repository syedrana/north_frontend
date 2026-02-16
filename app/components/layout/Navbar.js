// "use client";

// import api from '@/lib/apiServer';
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import { Badge, IconButton } from "@mui/material";
// import {
//   ChevronDown,
//   LogOut,
//   Menu,
//   Search,
//   User,
//   X
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";

// export default function Navbar({ user, setUser }) {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [menOpen, setMenOpen] = useState(false);
//   const [womenOpen, setWomenOpen] = useState(false);
//   const [activeMega, setActiveMega] = useState(null); // "men" | "women" | null
//   const inputRef = useRef(null);
//   const router = useRouter();
//   const [cartCount, setCartCount] = useState(0);


//   useEffect(() => {
//     if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
//   }, [searchOpen]);

//   const loadCartCount = async () => {
//     try {
//       const res = await api.get("/cart");
//       if (res.data?.success) {
//         setCartCount(res.data.summary.itemCount || 0);
//         return;
//       }
//     } catch {
//       const guestCart = JSON.parse(
//         localStorage.getItem("guest_cart") || "[]"
//       );

//       const totalQty = guestCart.reduce(
//         (sum, item) => sum + item.quantity,
//         0
//       );

//       setCartCount(totalQty);
//     }
//   };

//   useEffect(() => {
//     // ✅ React 19 safe: defer execution
//     queueMicrotask(() => {
//       loadCartCount();
//     });

//     const handler = () => loadCartCount();

//     window.addEventListener("cart-changed", handler);
//     window.addEventListener("auth-changed", handler);

//     return () => {
//       window.removeEventListener("cart-changed", handler);
//       window.removeEventListener("auth-changed", handler);
//     };
//   }, []);



//   // Logout handler
//   const handleLogout = async () => {
//     try {
//       await api.post("/customer/logout", {}, {
//         withCredentials: true
//       });
      
//       setUser(null);
//       window.dispatchEvent(new Event("auth-changed"));
//       // setDrawerOpen(false); // 👈 important polish
//       router.replace("/");
//     } catch (err) {
//       console.log(err);
//     }
//   };


//   return (
//     <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           <Link href="/" className="text-xl font-bold tracking-wide">
//             North Fashion
//           </Link>

//           {/* ================= DESKTOP ================= */}
//           <nav className="hidden md:flex items-center gap-8 relative">
//             {/* MEN */}
//             <div
//               className="relative"
//               onMouseEnter={() => setActiveMega("men")}
//               onMouseLeave={() => setActiveMega(null)}
//             >
//               <button className="font-medium">Men</button>

//               {activeMega === "men" && (
//                 <div className="absolute left-1/2 -translate-x-1/2 top-full pt-6">
//                   <div className="w-screen max-w-6xl bg-white rounded-2xl shadow-2xl p-8">
//                     <div className="grid grid-cols-5 gap-8">
//                       <MenuCol title="Top Wear" items={["T-Shirts", "Shirts", "Hoodies", "Jackets"]} />
//                       <MenuCol title="Bottom Wear" items={["Jeans", "Chinos", "Joggers"]} />
//                       <MenuCol title="Footwear" items={["Sneakers", "Loafers"]} />
//                       <MenuCol title="Accessories" items={["Belts", "Caps"]} />
//                       <ImageBox src="https://images.unsplash.com/photo-1521335629791-ce4aec67dd47" />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* WOMEN */}
//             <div
//               className="relative"
//               onMouseEnter={() => setActiveMega("women")}
//               onMouseLeave={() => setActiveMega(null)}
//             >
//               <button className="font-medium">Women</button>

//               {activeMega === "women" && (
//                 <div className="absolute left-1/2 -translate-x-1/2 top-full pt-6">
//                   <div className="w-screen max-w-6xl bg-white rounded-2xl shadow-2xl p-8">
//                     <div className="grid grid-cols-5 gap-8">
//                       <MenuCol title="Top Wear" items={["Tops", "Kurtis"]} />
//                       <MenuCol title="Bottom Wear" items={["Jeans", "Skirts"]} />
//                       <MenuCol title="Ethnic" items={["Saree", "Salwar"]} />
//                       <MenuCol title="Accessories" items={["Bags", "Jewellery"]} />
//                       <ImageBox src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d" />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <Link href="/shop">Shop</Link>
//             <Link href="/offers" className="text-red-500 font-medium">Offers</Link>
//           </nav>

//           {/* RIGHT */}
//           <div className="flex items-center gap-4">
//             <button onClick={() => setSearchOpen(true)} className="p-2">
//               <Search size={18} />
//             </button>

//             <Link href="/cart">
//               <IconButton>
//                 <Badge badgeContent={cartCount} color="primary">
//                   <ShoppingCartIcon />
//                 </Badge>
//               </IconButton>
//             </Link>


//             {/* ================= USER INFO / AUTH ================= */}
//             {user ? (
//               <div className="hidden md:block relative group">
//                 <button className="flex items-center gap-2 font-medium">
//                   <User size={18} /> {user.firstName}
//                 </button>
//                 <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
//                   <div className="p-4 space-y-2">
//                     <div>
//                       <p className="font-semibold">{user.firstName} {user.lastName}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                       <p className="text-sm text-gray-500">{user.phone}</p>
//                     </div>
//                     <hr />
//                     <Link href="/customer/dashboard" className="block py-2 hover:bg-gray-100 rounded-md">My Account</Link>
//                     <Link href="/customer/my-orders" className="block py-2 hover:bg-gray-100 rounded-md">Orders</Link>
//                     <button onClick={handleLogout} className="w-full text-left py-2 hover:bg-gray-100 rounded-md flex items-center gap-2">
//                       <LogOut size={16} /> Logout
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : null}

//             {!user && (
//               <>
//                 <Link href="/customer/login" className="hidden md:block">
//                   Login
//                 </Link>
//                 <Link href="/customer/registration" className="hidden md:block">
//                   Register
//                 </Link>
//               </>
//             )}

//             <button onClick={() => setDrawerOpen(true)} className="md:hidden p-2">
//               <Menu size={22} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= MOBILE DRAWER ================= */}
//       <div
//         onClick={() => setDrawerOpen(false)}
//         className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition ${drawerOpen ? "opacity-100" : "opacity-0 invisible"}`}
//       />

//       <aside
//         className={`fixed top-0 left-0 z-[70] h-screen w-[85%] max-w-sm bg-white transform transition-transform duration-300 flex flex-col ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
//       >
//         {/* ========== TOP: USER INFO ========== */}
//         <div className="flex flex-col px-5 py-6 border-b">
//           {user ? (
//             <>
//               <p className="font-semibold">{user.firstName} {user.lastName}</p>
//               <p className="text-sm text-gray-500">{user.email}</p>
//               <p className="text-sm text-gray-500">{user.phone}</p>
//             </>
//           ) : (
//             <span className="font-semibold text-lg">Menu</span>
//           )}
//           <button
//             className="absolute top-4 right-4 p-2"
//             onClick={() => setDrawerOpen(false)}
//           >
//             <X />
//           </button>
//         </div>

//         {/* ========== MIDDLE: SCROLLABLE MENU ========== */}
//         <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
//           {user && (
//             <div className="space-y-2">
//               <Link href="/customer/dashboard" className="block py-2">My Account</Link>
//               <Link href="/customer/orders" className="block py-2">Orders</Link>
//             </div>
//           )}

//           {/* MEN */}
//           <section className="space-y-2">
//             <button
//               onClick={() => setMenOpen(!menOpen)}
//               className="flex w-full justify-between text-lg font-semibold"
//             >
//               Men
//               <ChevronDown className={`transition ${menOpen ? "rotate-180" : ""}`} />
//             </button>
//             {menOpen && (
//               <div className="pl-3 text-gray-700 space-y-2">
//                 <MobileGroup title="Top Wear" items={["T-Shirts", "Shirts", "Hoodies", "Jackets"]} />
//                 <MobileGroup title="Bottom Wear" items={["Jeans", "Chinos", "Joggers"]} />
//                 <MobileGroup title="Footwear" items={["Sneakers", "Loafers"]} />
//                 <MobileGroup title="Accessories" items={["Belts", "Caps"]} />
//               </div>
//             )}
//           </section>

//           {/* WOMEN */}
//           <section className="space-y-2">
//             <button
//               onClick={() => setWomenOpen(!womenOpen)}
//               className="flex w-full justify-between text-lg font-semibold"
//             >
//               Women
//               <ChevronDown className={`transition ${womenOpen ? "rotate-180" : ""}`} />
//             </button>
//             {womenOpen && (
//               <div className="pl-3 text-gray-700 space-y-2">
//                 <MobileGroup title="Top Wear" items={["Tops", "Kurtis"]} />
//                 <MobileGroup title="Bottom Wear" items={["Jeans", "Skirts"]} />
//                 <MobileGroup title="Ethnic" items={["Saree", "Salwar"]} />
//                 <MobileGroup title="Accessories" items={["Bags", "Jewellery"]} />
//               </div>
//             )}
//           </section>

//           {/* OTHER LINKS */}
//           <Link href="/shop" className="block text-lg font-semibold">Shop</Link>
//           <Link href="/offers" className="block text-lg font-semibold text-red-500">Offers</Link>
//         </div>

//         {/* ========== BOTTOM: LOGOUT / LOGIN ========== */}
//         <div className="px-5 py-4 border-t flex-shrink-0">
//           {user ? (
//             <button
//               onClick={handleLogout}
//               className="w-full text-left py-3 flex items-center justify-center gap-2 bg-gray-100 rounded-lg"
//             >
//               <LogOut size={16} /> Logout
//             </button>
//           ) : (
//             <div className="space-y-2">
//               <Link href="/customer/login" className="block text-center py-3 border rounded-xl">
//                 Login
//               </Link>
//               <Link href="/customer/registration" className="block text-center py-3 rounded-xl bg-black text-white">
//                 Register
//               </Link>
//             </div>
//           )}
//         </div>
//       </aside>

//     </header>
//   );
// }

// /* ================= HELPERS ================= */

// function MenuCol({ title, items }) {
//   return (
//     <div>
//       <h4 className="font-semibold mb-4">{title}</h4>
//       <ul className="space-y-2 text-sm text-gray-600">
//         {items.map((i) => <li key={i}>{i}</li>)}
//       </ul>
//     </div>
//   );
// }

// function ImageBox({ src }) {
//   return (
//     <div className="relative h-48 rounded-xl overflow-hidden">
//       <Image src={src} alt="menu" fill className="object-cover" />
//     </div>
//   );
// }

// function MobileGroup({ title, items }) {
//   return (
//     <div>
//       <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">{title}</h5>
//       <ul className="space-y-2">
//         {items.map((i) => <li key={i} className="pl-2">{i}</li>)}
//       </ul>
//     </div>
//   );
// }























// "use client";

// import api from "@/lib/apiServer";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import { Badge, IconButton } from "@mui/material";
// import { AnimatePresence, motion } from "framer-motion";
// import { ChevronDown, LogOut, Menu, Search, User, X } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";

// export default function Navbar({ user, setUser }) {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [menOpen, setMenOpen] = useState(false);
//   const [womenOpen, setWomenOpen] = useState(false);
//   const [activeMega, setActiveMega] = useState(null); // "men" | "women" | null
//   const [cartCount, setCartCount] = useState(0);
//   const [scrolled, setScrolled] = useState(false);

//   const inputRef = useRef(null);
//   const prevPath = useRef("");
//   const pathname = usePathname();
//   const router = useRouter();

//   /* ================= SCROLL EFFECT ================= */
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   /* ================= CART COUNT ================= */
//   const loadCartCount = async () => {
//     try {
//       const res = await api.get("/cart");
//       if (res.data?.success) {
//         setCartCount(res.data.summary.itemCount || 0);
//         return;
//       }
//     } catch {
//       const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
//       const totalQty = guestCart.reduce((s, i) => s + i.quantity, 0);
//       setCartCount(totalQty);
//     }
//   };

//   useEffect(() => {
//     queueMicrotask(loadCartCount);
//     const handler = () => loadCartCount();
//     window.addEventListener("cart-changed", handler);
//     window.addEventListener("auth-changed", handler);
//     return () => {
//       window.removeEventListener("cart-changed", handler);
//       window.removeEventListener("auth-changed", handler);
//     };
//   }, []);

//   /* ================= BODY LOCK ================= */
//   useEffect(() => {
//     document.body.style.overflow =
//       drawerOpen || searchOpen || cartOpen ? "hidden" : "";
//   }, [drawerOpen, searchOpen, cartOpen]);

//   /* ================= PATHNAME EFFECT (drawer/search close safely) ================= */
//   useEffect(() => {
//     if (prevPath.current !== pathname) {
//       queueMicrotask(() => {
//         setDrawerOpen(false);
//         setSearchOpen(false);
//       });
//       prevPath.current = pathname;
//     }
//   }, [pathname]);

//   /* ================= FOCUS SEARCH INPUT ================= */
//   useEffect(() => {
//     if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
//   }, [searchOpen]);

//   /* ================= LOGOUT ================= */
//   const handleLogout = async () => {
//     try {
//       await api.post("/customer/logout", {}, { withCredentials: true });
//       setUser(null);
//       window.dispatchEvent(new Event("auth-changed"));
//       router.replace("/");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   /* ================= JSX ================= */
//   return (
//     <header
//       className={`sticky top-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? "bg-white/80 backdrop-blur-xl shadow-md h-14"
//           : "bg-white/60 backdrop-blur-lg h-16"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
//         {/* LOGO */}
//         <Link href="/" className="text-xl font-bold tracking-wide">
//           North Fashion
//         </Link>

//         {/* DESKTOP MENU */}
//         <nav className="hidden md:flex items-center gap-8 relative">
//           {/* MEN */}
//           <div
//             className="relative"
//             onMouseEnter={() => setActiveMega("men")}
//             onMouseLeave={() => setActiveMega(null)}
//           >
//             <button className="font-medium flex items-center gap-1">
//               Men <ChevronDown size={14} />
//             </button>
//             {activeMega === "men" && (
//               <MegaMenu
//                 items={[
//                   { title: "Top Wear", list: ["T-Shirts", "Shirts", "Hoodies", "Jackets"] },
//                   { title: "Bottom Wear", list: ["Jeans", "Chinos", "Joggers"] },
//                   { title: "Footwear", list: ["Sneakers", "Loafers"] },
//                   { title: "Accessories", list: ["Belts", "Caps"] },
//                 ]}
//                 img="https://images.unsplash.com/photo-1521335629791-ce4aec67dd47"
//               />
//             )}
//           </div>

//           {/* WOMEN */}
//           <div
//             className="relative"
//             onMouseEnter={() => setActiveMega("women")}
//             onMouseLeave={() => setActiveMega(null)}
//           >
//             <button className="font-medium flex items-center gap-1">
//               Women <ChevronDown size={14} />
//             </button>
//             {activeMega === "women" && (
//               <MegaMenu
//                 items={[
//                   { title: "Top Wear", list: ["Tops", "Kurtis"] },
//                   { title: "Bottom Wear", list: ["Jeans", "Skirts"] },
//                   { title: "Ethnic", list: ["Saree", "Salwar"] },
//                   { title: "Accessories", list: ["Bags", "Jewellery"] },
//                 ]}
//                 img="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
//               />
//             )}
//           </div>

//           <Link href="/shop" className="font-medium">Shop</Link>
//           <Link href="/offers" className="text-red-500 font-medium">Offers</Link>
//         </nav>

//         {/* RIGHT (SEARCH/CART/USER/MOBILE) */}
//         <div className="flex items-center gap-4">
//           {/* SEARCH */}
//           <button onClick={() => setSearchOpen(true)} className="p-2 md:p-2">
//             <Search size={18} />
//           </button>

//           {/* CART */}
//           <Link href="/cart">
//             <IconButton className="p-0">
//               <Badge badgeContent={cartCount} color="primary">
//                 <ShoppingCartIcon />
//               </Badge>
//             </IconButton>
//           </Link>

//           {/* USER INFO (desktop) */}
//           {user && (
//             <div className="hidden md:flex relative group">
//               <button className="flex items-center gap-2 font-medium">
//                 <User size={18} /> {user.firstName}
//               </button>
//               <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
//                 <div className="p-4 space-y-2">
//                   <div>
//                     <p className="font-semibold">{user.firstName} {user.lastName}</p>
//                     <p className="text-sm text-gray-500">{user.email}</p>
//                     <p className="text-sm text-gray-500">{user.phone}</p>
//                   </div>
//                   <hr />
//                   <Link href="/customer/dashboard" className="block py-2 hover:bg-gray-100 rounded-md">My Account</Link>
//                   <Link href="/customer/my-orders" className="block py-2 hover:bg-gray-100 rounded-md">Orders</Link>
//                   <button onClick={handleLogout} className="w-full text-left py-2 hover:bg-gray-100 rounded-md flex items-center gap-2">
//                     <LogOut size={16} /> Logout
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {!user && (
//             <div className="hidden md:flex gap-2">
//               <Link href="/customer/login" className="font-medium">Login</Link>
//               <Link href="/customer/registration" className="font-medium">Register</Link>
//             </div>
//           )}

//           {/* MOBILE MENU BUTTON */}
//           <button onClick={() => setDrawerOpen(true)} className="md:hidden p-2">
//             <Menu size={22} />
//           </button>
//         </div>
//       </div>

//       {/* ================= SEARCH OVERLAY ================= */}
//       <Overlay open={searchOpen} onClose={() => setSearchOpen(false)}>
//         <div className="max-w-2xl mx-auto mt-40 px-4">
//           <input
//             ref={inputRef}
//             placeholder="Search products..."
//             className="w-full text-3xl border-b outline-none p-4"
//           />
//         </div>
//       </Overlay>

//       {/* ================= CART DRAWER ================= */}
//       <Drawer open={cartOpen} onClose={() => setCartOpen(false)}>
//         <div className="p-6">
//           <h2 className="text-xl font-semibold mb-4">Cart</h2>
//           <p className="text-gray-500">Cart items preview here...</p>
//           <button
//             onClick={() => {
//               setCartOpen(false);
//               router.push("/cart");
//             }}
//             className="mt-6 w-full bg-black text-white py-3 rounded-xl"
//           >
//             View Cart
//           </button>
//         </div>
//       </Drawer>

//       {/* ================= MOBILE DRAWER ================= */}
//       <MobileDrawer
//         drawerOpen={drawerOpen}
//         setDrawerOpen={setDrawerOpen}
//         user={user}
//         menOpen={menOpen}
//         setMenOpen={setMenOpen}
//         womenOpen={womenOpen}
//         setWomenOpen={setWomenOpen}
//         handleLogout={handleLogout}
//       />
//     </header>
//   );
// }

// /* ================= MOBILE DRAWER COMPONENT ================= */
// function MobileDrawer({ drawerOpen, setDrawerOpen, user, menOpen, setMenOpen, womenOpen, setWomenOpen, handleLogout }) {
//   return (
//     <>
//       {/* Overlay */}
//       <div
//         onClick={() => setDrawerOpen(false)}
//         className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition md:hidden ${drawerOpen ? "opacity-100" : "opacity-0 invisible"}`}
//       />

//       <aside
//         className={`fixed top-0 left-0 z-[70] h-screen w-[85%] max-w-sm bg-white transform transition-transform duration-300 flex flex-col md:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
//       >
//         {/* Top: User Info */}
//         <div className="flex flex-col px-5 py-6 border-b relative">
//           {user ? (
//             <>
//               <p className="font-semibold">{user.firstName} {user.lastName}</p>
//               <p className="text-sm text-gray-500">{user.email}</p>
//               <p className="text-sm text-gray-500">{user.phone}</p>
//             </>
//           ) : (
//             <span className="font-semibold text-lg">Menu</span>
//           )}
//           <button className="absolute top-4 right-4 p-2" onClick={() => setDrawerOpen(false)}>
//             <X />
//           </button>
//         </div>

//         {/* Middle: Scrollable menu */}
//         <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
//           {user && (
//             <div className="space-y-2">
//               <Link href="/customer/dashboard" className="block py-2">My Account</Link>
//               <Link href="/customer/orders" className="block py-2">Orders</Link>
//             </div>
//           )}

//           {/* MEN */}
//           <section className="space-y-2">
//             <button
//               onClick={() => setMenOpen(!menOpen)}
//               className="flex w-full justify-between text-lg font-semibold"
//             >
//               Men <ChevronDown className={`transition ${menOpen ? "rotate-180" : ""}`} />
//             </button>
//             {menOpen && (
//               <div className="pl-3 text-gray-700 space-y-2">
//                 <MobileGroup title="Top Wear" items={["T-Shirts","Shirts","Hoodies","Jackets"]} />
//                 <MobileGroup title="Bottom Wear" items={["Jeans","Chinos","Joggers"]} />
//                 <MobileGroup title="Footwear" items={["Sneakers","Loafers"]} />
//                 <MobileGroup title="Accessories" items={["Belts","Caps"]} />
//               </div>
//             )}
//           </section>

//           {/* WOMEN */}
//           <section className="space-y-2">
//             <button
//               onClick={() => setWomenOpen(!womenOpen)}
//               className="flex w-full justify-between text-lg font-semibold"
//             >
//               Women <ChevronDown className={`transition ${womenOpen ? "rotate-180" : ""}`} />
//             </button>
//             {womenOpen && (
//               <div className="pl-3 text-gray-700 space-y-2">
//                 <MobileGroup title="Top Wear" items={["Tops","Kurtis"]} />
//                 <MobileGroup title="Bottom Wear" items={["Jeans","Skirts"]} />
//                 <MobileGroup title="Ethnic" items={["Saree","Salwar"]} />
//                 <MobileGroup title="Accessories" items={["Bags","Jewellery"]} />
//               </div>
//             )}
//           </section>

//           {/* Shop/Offers */}
//           <Link href="/shop" className="block text-lg font-semibold">Shop</Link>
//           <Link href="/offers" className="block text-lg font-semibold text-red-500">Offers</Link>
//         </div>

//         {/* Bottom: Logout/Login */}
//         <div className="px-5 py-4 border-t flex-shrink-0">
//           {user ? (
//             <button
//               onClick={handleLogout}
//               className="w-full text-left py-3 flex items-center justify-center gap-2 bg-gray-100 rounded-lg"
//             >
//               <LogOut size={16} /> Logout
//             </button>
//           ) : (
//             <div className="space-y-2">
//               <Link href="/customer/login" className="block text-center py-3 border rounded-xl">Login</Link>
//               <Link href="/customer/registration" className="block text-center py-3 rounded-xl bg-black text-white">Register</Link>
//             </div>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

// /* ================= HELPERS ================= */
// function MegaMenu({ items, img }) {
//   return (
//     <div className="absolute left-1/2 -translate-x-1/2 top-full pt-6 w-screen max-w-6xl bg-white rounded-2xl shadow-2xl p-8">
//       <div className="grid grid-cols-5 gap-8">
//         {items.map((col) => (
//           <MenuCol key={col.title} title={col.title} items={col.list} />
//         ))}
//         <ImageBox src={img} />
//       </div>
//     </div>
//   );
// }

// function MenuCol({ title, items }) {
//   return (
//     <div>
//       <h4 className="font-semibold mb-4">{title}</h4>
//       <ul className="space-y-2 text-sm text-gray-600">
//         {items.map((i) => <li key={i}>{i}</li>)}
//       </ul>
//     </div>
//   );
// }

// function ImageBox({ src }) {
//   return (
//     <div className="relative h-48 rounded-xl overflow-hidden">
//       <Image src={src} alt="menu" fill className="object-cover" />
//     </div>
//   );
// }

// function MobileGroup({ title, items }) {
//   return (
//     <div>
//       <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">{title}</h5>
//       <ul className="space-y-2">
//         {items.map((i) => <li key={i} className="pl-2">{i}</li>)}
//       </ul>
//     </div>
//   );
// }

// function Overlay({ open, onClose, children }) {
//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           className="fixed inset-0 bg-white z-[100]"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//         >
//           {children}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// function Drawer({ open, onClose, children }) {
//   return (
//     <AnimatePresence>
//       {open && (
//         <>
//           <motion.div
//             className="fixed inset-0 bg-black/40 z-[90]"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//           />
//           <motion.div
//             className="fixed right-0 top-0 h-full w-80 bg-white z-[100] shadow-xl"
//             initial={{ x: 400 }}
//             animate={{ x: 0 }}
//             exit={{ x: 400 }}
//           >
//             {children}
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }











"use client";

import api from "@/lib/apiServer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, IconButton } from "@mui/material";
import { AnimatePresence, motion, } from "framer-motion";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";


export default function Navbar({ user, setUser }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menOpen, setMenOpen] = useState(false);
  const [womenOpen, setWomenOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const inputRef = useRef(null);
  const prevPath = useRef("");
  const pathname = usePathname();
  const router = useRouter();

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= CART COUNT ================= */
  const loadCartCount = async () => {
    try {
      const res = await api.get("/cart");
      if (res.data?.success) {
        setCartCount(res.data.summary.itemCount || 0);
        return;
      }
    } catch {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const totalQty = guestCart.reduce((s, i) => s + i.quantity, 0);
      setCartCount(totalQty);
    }
  };

  useEffect(() => {
    queueMicrotask(loadCartCount);
    const handler = () => loadCartCount();
    window.addEventListener("cart-changed", handler);
    window.addEventListener("auth-changed", handler);
    return () => {
      window.removeEventListener("cart-changed", handler);
      window.removeEventListener("auth-changed", handler);
    };
  }, []);

  /* ================= BODY LOCK (SHIFT FIX) ================= */
  useEffect(() => {
    const lock = drawerOpen || searchOpen || cartOpen;

    if (lock) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [drawerOpen, searchOpen, cartOpen]);

  /* ================= PATHNAME EFFECT ================= */
  useEffect(() => {
    if (prevPath.current !== pathname) {
      queueMicrotask(() => {
        setDrawerOpen(false);
        setSearchOpen(false);
      });
      prevPath.current = pathname;
    }
  }, [pathname]);

  /* ================= FOCUS SEARCH ================= */
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  const handleSearch = (keyword) => {
    if (!keyword) return;
    
    router.push(`/shop?search=${encodeURIComponent(keyword)}`);
  };


  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await api.post("/customer/logout", {}, { withCredentials: true });
      setUser(null);
      window.dispatchEvent(new Event("auth-changed"));
      router.replace("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-md h-14"
          : "bg-white/60 backdrop-blur-lg h-16"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold tracking-wide">
          North Fashion
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 relative">
          {/* MEN */}
          <div
            className="relative"
            onMouseEnter={() => setActiveMega("men")}
            onMouseLeave={() => setActiveMega(null)}
          >
            <button className="font-medium flex items-center gap-1">
              Men <ChevronDown size={14} />
            </button>
            {activeMega === "men" && (
              <MegaMenu
                items={[
                  { title: "Top Wear", list: ["T-Shirts", "Shirts", "Hoodies", "Jackets"] },
                  { title: "Bottom Wear", list: ["Jeans", "Chinos", "Joggers"] },
                  { title: "Footwear", list: ["Sneakers", "Loafers"] },
                  { title: "Accessories", list: ["Belts", "Caps"] },
                ]}
                img="https://images.unsplash.com/photo-1521335629791-ce4aec67dd47"
              />
            )}
          </div>

          {/* WOMEN */}
          <div
            className="relative"
            onMouseEnter={() => setActiveMega("women")}
            onMouseLeave={() => setActiveMega(null)}
          >
            <button className="font-medium flex items-center gap-1">
              Women <ChevronDown size={14} />
            </button>
            {activeMega === "women" && (
              <MegaMenu
                items={[
                  { title: "Top Wear", list: ["Tops", "Kurtis"] },
                  { title: "Bottom Wear", list: ["Jeans", "Skirts"] },
                  { title: "Ethnic", list: ["Saree", "Salwar"] },
                  { title: "Accessories", list: ["Bags", "Jewellery"] },
                ]}
                img="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
              />
            )}
          </div>

          <Link href="/shop" className="font-medium">Shop</Link>
          <Link href="/offers" className="text-red-500 font-medium">Offers</Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* SEARCH — FIXED */}
          {/* <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition active:scale-95"
          >
            <Search size={18} />
            <span className="hidden md:inline text-sm font-medium">Search</span>
          </button> */}

          <div className="flex-1 mx-6 hidden md:block">
            <SearchBar
              placeholder="Search products..."
              onSearch={handleSearch}
              trendingKeywords={[
                "T Shirt",
                "Jeans",
                "Hoodie",
                "Sneakers",
              ]}
            />
          </div>


          {/* CART — STABLE */}
          <Link href="/cart">
            <IconButton className="p-0 relative">
              <Badge
                badgeContent={cartCount}
                color="primary"
                overlap="circular"
                sx={{ "& .MuiBadge-badge": { minWidth: 18, height: 18 } }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Link>

          {/* USER */}
          {user && (
            <div className="hidden md:flex relative group">
              <button className="flex items-center gap-2 font-medium">
                <User size={18} /> {user.firstName}
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-4 space-y-2">
                  <div>
                    <p className="font-semibold">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </div>
                  <hr />
                  <Link href="/customer/dashboard" className="block py-2 hover:bg-gray-100 rounded-md">My Account</Link>
                  <Link href="/customer/my-orders" className="block py-2 hover:bg-gray-100 rounded-md">Orders</Link>
                  <button onClick={handleLogout} className="w-full text-left py-2 hover:bg-gray-100 rounded-md flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {!user && (
            <div className="hidden md:flex gap-2">
              <Link href="/customer/login" className="font-medium">Login</Link>
              <Link href="/customer/registration" className="font-medium">Register</Link>
            </div>
          )}

          {/* MOBILE MENU */}
          <button onClick={() => setDrawerOpen(true)} className="md:hidden p-2">
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* SEARCH OVERLAY */}
      {/* <Overlay open={searchOpen} onClose={() => setSearchOpen(false)}>
        <div className="max-w-2xl mx-auto mt-40 px-4 relative">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute -top-16 right-4 p-2"
          >
            <X size={24} />
          </button>

          <input
            ref={inputRef}
            placeholder="Search products..."
            className="w-full text-3xl border-b outline-none p-4"
          />
        </div>
      </Overlay> */}

      {/* CART DRAWER */}
      <Drawer open={cartOpen} onClose={() => setCartOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Cart</h2>
          <p className="text-gray-500">Cart items preview here...</p>
          <button
            onClick={() => {
              setCartOpen(false);
              router.push("/cart");
            }}
            className="mt-6 w-full bg-black text-white py-3 rounded-xl"
          >
            View Cart
          </button>
        </div>
      </Drawer>

      {/* MOBILE DRAWER */}
      <MobileDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        user={user}
        menOpen={menOpen}
        setMenOpen={setMenOpen}
        womenOpen={womenOpen}
        setWomenOpen={setWomenOpen}
        handleLogout={handleLogout}
      />
    </header>
  );
}


/* ================= OVERLAY ================= */
function Overlay({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-white z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================= DRAWER ================= */
function Drawer({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-80 bg-white z-[100] shadow-xl"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


/* ================= MOBILE DRAWER ================= */
function MobileDrawer({
  drawerOpen,
  setDrawerOpen,
  user,
  menOpen,
  setMenOpen,
  womenOpen,
  setWomenOpen,
  handleLogout,
}) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition md:hidden ${
          drawerOpen ? "opacity-100" : "opacity-0 invisible"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 z-[70] h-screen w-[85%] max-w-sm bg-white transform transition-transform duration-300 flex flex-col md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top */}
        <div className="flex flex-col px-5 py-6 border-b relative">
          {user ? (
            <>
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>
            </>
          ) : (
            <span className="font-semibold text-lg">Menu</span>
          )}

          <button
            className="absolute top-4 right-4 p-2"
            onClick={() => setDrawerOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {user && (
            <div className="space-y-2">
              <Link href="/customer/dashboard" className="block py-2">
                My Account
              </Link>
              <Link href="/customer/orders" className="block py-2">
                Orders
              </Link>
            </div>
          )}

          {/* MEN */}
          <section className="space-y-2">
            <button
              onClick={() => setMenOpen(!menOpen)}
              className="flex w-full justify-between text-lg font-semibold"
            >
              Men{" "}
              <ChevronDown
                className={`transition ${menOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menOpen && (
              <div className="pl-3 text-gray-700 space-y-2">
                <MobileGroup
                  title="Top Wear"
                  items={["T-Shirts", "Shirts", "Hoodies", "Jackets"]}
                />
                <MobileGroup
                  title="Bottom Wear"
                  items={["Jeans", "Chinos", "Joggers"]}
                />
                <MobileGroup
                  title="Footwear"
                  items={["Sneakers", "Loafers"]}
                />
                <MobileGroup
                  title="Accessories"
                  items={["Belts", "Caps"]}
                />
              </div>
            )}
          </section>

          {/* WOMEN */}
          <section className="space-y-2">
            <button
              onClick={() => setWomenOpen(!womenOpen)}
              className="flex w-full justify-between text-lg font-semibold"
            >
              Women{" "}
              <ChevronDown
                className={`transition ${womenOpen ? "rotate-180" : ""}`}
              />
            </button>

            {womenOpen && (
              <div className="pl-3 text-gray-700 space-y-2">
                <MobileGroup
                  title="Top Wear"
                  items={["Tops", "Kurtis"]}
                />
                <MobileGroup
                  title="Bottom Wear"
                  items={["Jeans", "Skirts"]}
                />
                <MobileGroup
                  title="Ethnic"
                  items={["Saree", "Salwar"]}
                />
                <MobileGroup
                  title="Accessories"
                  items={["Bags", "Jewellery"]}
                />
              </div>
            )}
          </section>

          <Link href="/shop" className="block text-lg font-semibold">
            Shop
          </Link>

          <Link
            href="/offers"
            className="block text-lg font-semibold text-red-500"
          >
            Offers
          </Link>
        </div>

        {/* Bottom */}
        <div className="px-5 py-4 border-t flex-shrink-0">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left py-3 flex items-center justify-center gap-2 bg-gray-100 rounded-lg"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                href="/customer/login"
                className="block text-center py-3 border rounded-xl"
              >
                Login
              </Link>
              <Link
                href="/customer/registration"
                className="block text-center py-3 rounded-xl bg-black text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}


/* ================= MEGA MENU ================= */
function MegaMenu({ items, img }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-6 w-screen max-w-6xl">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="grid grid-cols-5 gap-8">
          {items.map((col) => (
            <MenuCol
              key={col.title}
              title={col.title}
              items={col.list}
            />
          ))}

          <ImageBox src={img} />
        </div>
      </div>
    </div>
  );
}

/* ================= MENU COLUMN ================= */
function MenuCol({ title, items }) {
  return (
    <div>
      <h4 className="font-semibold mb-4">{title}</h4>

      <ul className="space-y-2 text-sm text-gray-600">
        {items.map((i) => (
          <li
            key={i}
            className="hover:text-black cursor-pointer transition"
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================= IMAGE BOX ================= */
function ImageBox({ src }) {
  return (
    <div className="relative h-48 rounded-xl overflow-hidden">
      <Image
        src={src}
        alt="menu"
        fill
        className="object-cover"
      />
    </div>
  );
}

/* ================= MOBILE GROUP ================= */
function MobileGroup({ title, items }) {
  return (
    <div>
      <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
        {title}
      </h5>

      <ul className="space-y-2">
        {items.map((i) => (
          <li
            key={i}
            className="pl-2 text-gray-700"
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
