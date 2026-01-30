'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
// import Footer from './components/footer';
// import MoveToTopButton from './components/MoveToTopButton';
import api from '@/lib/apiServer';
import Navbar from './components/layout/Navbar';

export default function ClientRootWrapper({ children }) {
  const pathname = usePathname();
  
  const [user, setUser] = useState(null);
  
  const hideNavbarRoutes = ['/admin', '/dashboard'];

  const showNavbar = !hideNavbarRoutes.some(route =>
    pathname.startsWith(route)
  );

  const fetchUser = async () => {
    try {
      const res = await api.get("/customer/me");
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (!mounted) return;
      await fetchUser();
    };

    initAuth();

    const handler = () => fetchUser();
  window.addEventListener("auth-changed", handler);

    return () => {
      mounted = false;
      window.removeEventListener("auth-changed", handler);
    };
  }, []);



  return (
    <>
      {showNavbar && <Navbar user={user} setUser={setUser} />}
      

      {children}

      {/* {showNavbar && <Footer />} */}
      {/* <MoveToTopButton /> */}
      <Toaster
          position="top-center"
          gutter={12}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffffef",
              color: "#000000",
              borderRadius: "14px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
    </>
  );
}