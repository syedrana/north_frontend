# 🛍️ North Fashion Store - Full-Stack E-commerce

A premium, high-performance e-commerce frontend built with **Next.js 15**, **Tailwind CSS**, and **JavaScript**. This project serves as the flagship storefront for North Fashion, offering a seamless shopping experience integrated with a custom-built REST API.

## 🚀 Overview

North Fashion Store is designed for speed, SEO, and scalability. It features a modern App Router architecture, server-side data fetching, and a mobile-first responsive design. The project is engineered to handle complex product variants (size, color, stock) while maintaining a lightning-fast user interface.

## ✨ Key Features

- **⚡ Next.js 15 App Router:** Leveraging the latest React features for optimized routing and layouts.
- **🎨 Tailwind Styling:** A sleek, modern UI with customized components for a premium brand feel.
- **🔍 Advanced Discovery:** Real-time product search and category-based filtering.
- **📦 Variant System:** Support for multiple product variants with dynamic stock management.
- **📱 Responsive Design:** Fully optimized for mobile, tablet, and desktop screens.
- **🛠️ Admin Integration:** Secure routes for product management and inventory updates.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** JavaScript (ES6+)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **API Fetching:** Fetch API / Axios
- **State Management:** React Context API

## 🚦 Getting Started

Follow these steps to set up the project locally:

1️⃣ Clone the Repository

```bash
git clone [https://github.com/your-username/north-frontend.git](https://github.com/your-username/north-frontend.git)
cd north-frontend

2️⃣ Install Dependencies
npm install

3️⃣ Environment Configuration

Create a .env.local file at the root of the project and add:

NEXT_PUBLIC_API_URL=http://localhost:7000
NEXT_PUBLIC_APP_ENV=development

4️⃣ Run Development Server
npm run dev


Open http://localhost:3000
 in your browser.

📂 Project Structure
src/
├── app/            # Main application routes, pages, and layouts
├── components/     # Reusable UI components (Navbar, Footer, Product Cards)
├── context/        # Global state (Cart, User Auth Context)
├── utils/          # API helper functions and constants
├── assets/         # Global styles and static images

🗺️ Roadmap

JWT User Authentication (Login/Register)

Shopping Cart Persistence with LocalStorage

Payment Gateway Integration (SSLCommerz / Stripe)

User Wishlist & Order History

Progressive Web App (PWA) support

🤝 Contributing

Contributions are welcome! Follow these steps:

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a pull request

📄 License

Distributed under the MIT License. See LICENSE for more information.

Developed with ❤️ by Syed Rana
```
