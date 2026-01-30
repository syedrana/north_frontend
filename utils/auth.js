// export const isTokenValid = () => {
//   const token = localStorage.getItem("token");
//   if (!token) return false;

//   try {
//     const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT
//     const expiry = payload.exp;
//     const now = Math.floor(Date.now() / 1000);
//     return expiry > now;
//   } catch (error) {
//     return false;
//   }
// };


// src/utils/auth.js

// 🔹 Decode JWT payload safely
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

// 🔹 Check token validity (UX guard)
export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const payload = decodeToken(token);
  if (!payload?.exp) return false;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
};

// 🔹 Logout
export const logout = () => {
  localStorage.clear();

  // 🔒 Prevent reload loop
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
};


// 🔹 Auto logout setup
export const setupAutoLogout = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = decodeToken(token);
  if (!payload?.exp) return;

  const expiryTime = payload.exp * 1000;
  const remainingTime = expiryTime - Date.now();

  if (remainingTime <= 0) {
    logout();
  } else {
    setTimeout(logout, remainingTime);
  }
};

export const isPublicRoute = (pathname) => {
  // Static public routes
  if (pathname === "/" || pathname === "/shop") return true;

  // Dynamic public routes
  if (pathname.startsWith("/product/")) return true;

  // Admin login page only
  if (pathname === "/admin") return true;

  if (pathname === "/customer/registration") return true;

  if (pathname === "/customer/login") return true;

  return false;
};

