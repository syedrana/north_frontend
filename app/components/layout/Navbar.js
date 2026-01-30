"use client";

import api from '@/lib/apiServer';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, IconButton } from "@mui/material";
import {
  ChevronDown,
  LogOut,
  Menu,
  Search,
  User,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar({ user, setUser }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menOpen, setMenOpen] = useState(false);
  const [womenOpen, setWomenOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null); // "men" | "women" | null
  const inputRef = useRef(null);
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);


  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  const loadCartCount = async () => {
    try {
      const res = await api.get("/cart");
      if (res.data?.success) {
        setCartCount(res.data.summary.itemCount || 0);
        return;
      }
    } catch {
      const guestCart = JSON.parse(
        localStorage.getItem("guest_cart") || "[]"
      );

      const totalQty = guestCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalQty);
    }
  };

  useEffect(() => {
    // ✅ React 19 safe: defer execution
    queueMicrotask(() => {
      loadCartCount();
    });

    const handler = () => loadCartCount();

    window.addEventListener("cart-changed", handler);
    window.addEventListener("auth-changed", handler);

    return () => {
      window.removeEventListener("cart-changed", handler);
      window.removeEventListener("auth-changed", handler);
    };
  }, []);



  // Logout handler
  const handleLogout = async () => {
    try {
      await api.post("/customer/logout");
      
      setUser(null);
      window.dispatchEvent(new Event("auth-changed"));
      // setDrawerOpen(false); // 👈 important polish
      router.replace("/");
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wide">
            North Fashion
          </Link>

          {/* ================= DESKTOP ================= */}
          <nav className="hidden md:flex items-center gap-8 relative">
            {/* MEN */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMega("men")}
              onMouseLeave={() => setActiveMega(null)}
            >
              <button className="font-medium">Men</button>

              {activeMega === "men" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-6">
                  <div className="w-screen max-w-6xl bg-white rounded-2xl shadow-2xl p-8">
                    <div className="grid grid-cols-5 gap-8">
                      <MenuCol title="Top Wear" items={["T-Shirts", "Shirts", "Hoodies", "Jackets"]} />
                      <MenuCol title="Bottom Wear" items={["Jeans", "Chinos", "Joggers"]} />
                      <MenuCol title="Footwear" items={["Sneakers", "Loafers"]} />
                      <MenuCol title="Accessories" items={["Belts", "Caps"]} />
                      <ImageBox src="https://images.unsplash.com/photo-1521335629791-ce4aec67dd47" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WOMEN */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMega("women")}
              onMouseLeave={() => setActiveMega(null)}
            >
              <button className="font-medium">Women</button>

              {activeMega === "women" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-6">
                  <div className="w-screen max-w-6xl bg-white rounded-2xl shadow-2xl p-8">
                    <div className="grid grid-cols-5 gap-8">
                      <MenuCol title="Top Wear" items={["Tops", "Kurtis"]} />
                      <MenuCol title="Bottom Wear" items={["Jeans", "Skirts"]} />
                      <MenuCol title="Ethnic" items={["Saree", "Salwar"]} />
                      <MenuCol title="Accessories" items={["Bags", "Jewellery"]} />
                      <ImageBox src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/shop">Shop</Link>
            <Link href="/offers" className="text-red-500 font-medium">Offers</Link>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="p-2">
              <Search size={18} />
            </button>

            {/* <Link href="/cart" className="relative p-2">
              <ShoppingCart size={18} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1
                  w-5 h-5 rounded-full bg-red-500 text-white
                  text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link> */}

            <Link href="/cart">
              <IconButton>
                <Badge badgeContent={cartCount} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>


            {/* ================= USER INFO / AUTH ================= */}
            {user ? (
              <div className="relative group">
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
                    <Link href="/customer/orders" className="block py-2 hover:bg-gray-100 rounded-md">Orders</Link>
                    <button onClick={handleLogout} className="w-full text-left py-2 hover:bg-gray-100 rounded-md flex items-center gap-2">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {!user && (
              <>
                <Link href="/customer/login" className="hidden md:block">
                  Login
                </Link>
                <Link href="/customer/registration" className="hidden md:block">
                  Register
                </Link>
              </>
            )}

            <button onClick={() => setDrawerOpen(true)} className="md:hidden p-2">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition ${drawerOpen ? "opacity-100" : "opacity-0 invisible"}`}
      />

      <aside
        className={`fixed top-0 left-0 z-[70] h-screen w-[85%] max-w-sm bg-white transform transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b">
          {user ? (
            <div className="flex flex-col">
              <p className="font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          ) : (
            <span className="font-semibold text-lg">Menu</span>
          )}
          <button onClick={() => setDrawerOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-5 space-y-8 overflow-y-auto h-[calc(100vh-64px)]">
          {user && (
            <div className="space-y-2">
              <Link href="/customer/dashboard" className="block py-2">My Account</Link>
              <Link href="/customer/orders" className="block py-2">Orders</Link>
              <button onClick={handleLogout} className="w-full text-left py-2 flex items-center gap-2">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}

          {/* MEN */}
          <section className="space-y-4">
            <button
              onClick={() => setMenOpen(!menOpen)}
              className="flex w-full justify-between text-lg font-semibold"
            >
              Men
              <ChevronDown className={`transition ${menOpen ? "rotate-180" : ""}`} />
            </button>
            {menOpen && (
              <div className="space-y-6 pl-3 text-gray-700">
                <MobileGroup title="Top Wear" items={["T-Shirts", "Shirts", "Hoodies", "Jackets"]} />
                <MobileGroup title="Bottom Wear" items={["Jeans", "Chinos", "Joggers"]} />
                <MobileGroup title="Footwear" items={["Sneakers", "Loafers"]} />
                <MobileGroup title="Accessories" items={["Belts", "Caps"]} />
              </div>
            )}
          </section>

          {/* WOMEN */}
          <section className="space-y-4">
            <button
              onClick={() => setWomenOpen(!womenOpen)}
              className="flex w-full justify-between text-lg font-semibold"
            >
              Women
              <ChevronDown className={`transition ${womenOpen ? "rotate-180" : ""}`} />
            </button>
            {womenOpen && (
              <div className="space-y-6 pl-3 text-gray-700">
                <MobileGroup title="Top Wear" items={["Tops", "Kurtis"]} />
                <MobileGroup title="Bottom Wear" items={["Jeans", "Skirts"]} />
                <MobileGroup title="Ethnic" items={["Saree", "Salwar"]} />
                <MobileGroup title="Accessories" items={["Bags", "Jewellery"]} />
              </div>
            )}
          </section>

          {!user && (
            <div className="pt-6 border-t space-y-4">
              <Link href="/customer/login" className="block text-center py-3 border rounded-xl">
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

          <Link href="/shop" className="block text-lg font-semibold">Shop</Link>
          <Link href="/offers" className="block text-lg font-semibold text-red-500">Offers</Link>
        </div>
      </aside>
    </header>
  );
}

/* ================= HELPERS ================= */

function MenuCol({ title, items }) {
  return (
    <div>
      <h4 className="font-semibold mb-4">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-600">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

function ImageBox({ src }) {
  return (
    <div className="relative h-48 rounded-xl overflow-hidden">
      <Image src={src} alt="menu" fill className="object-cover" />
    </div>
  );
}

function MobileGroup({ title, items }) {
  return (
    <div>
      <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">{title}</h5>
      <ul className="space-y-2">
        {items.map((i) => <li key={i} className="pl-2">{i}</li>)}
      </ul>
    </div>
  );
}
