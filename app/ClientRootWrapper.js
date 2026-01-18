'use client';
import { usePathname } from 'next/navigation';
import { Toaster } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
// import Footer from './components/footer';
// import MoveToTopButton from './components/MoveToTopButton';
// import Navbar from './components/navbars';

export default function ClientRootWrapper({ children }) {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith('/dashboard') && !pathname.startsWith('/admin');
  // const showNavbar = !pathname.startsWith('/admin');
  useAuth();

  return (
    <>
      {/* {showNavbar && <Navbar />} */}
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