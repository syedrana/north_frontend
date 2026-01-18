
export const metadata = {
  title: "Admin Login",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex items-center justify-center min-h-screen">
        {children}
      </body>
    </html>
  );
}