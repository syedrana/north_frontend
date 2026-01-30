// "use client";

// import apiServer from "@/lib/apiServer";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import AddressForm from "./AddressForm";
// import AddressSection from "./AddressSection";
// import OrderSummary from "./OrderSummary";

// export default function CheckoutClient({ initialData }) {
//   const router = useRouter();
//   const [checkout, setCheckout] = useState(initialData);
//   const [loading, setLoading] = useState(false);

//   if (!checkout?.success) {
//     return (
//       <div className="text-center py-24 text-gray-500">
//         Checkout unavailable. Please refresh.
//       </div>
//     );
//   }

//   const placeOrder = async () => {
//     setLoading(true);
//     try {
//       const res = await apiServer.post("/orders/cod", {
//         checkoutId: checkout.checkoutId,
//       });

//       router.push(`/order/success/${res.data.order._id}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
//       {/* LEFT */}
//       <div className="lg:col-span-2 space-y-6">
//         <AddressForm
//           loading={loading}
//           onSubmit={async (address) => {
//             const res = await apiServer.post("/checkout", {
//               shippingAddress: address,
//             });

//             setCheckout(res.data);
//           }}
//         />

//         {/* <PaymentMethod /> */}
//       </div>

//       <div className="lg:col-span-2">
//         <AddressSection
//           addresses={addresses}
//           selected={selectedAddress}
//           onSelect={submitAddress}
//           loading={loading}
//         />
//       </div>

//       {/* RIGHT */}
//       <OrderSummary
//         items={checkout.items}
//         pricing={checkout.pricing}
//         warnings={checkout.warnings}
//         onConfirm={placeOrder}
//         loading={loading}
//         disabled={!checkout.canPlaceOrder}
//       />
//     </div>
//   );
// }







// "use client";

// import apiServer from "@/lib/apiServer";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import AddressSection from "./AddressSection";
// import OrderSummary from "./OrderSummary";

// export default function CheckoutClient({ initialData }) {
//   const router = useRouter();
//   const [checkout, setCheckout] = useState(initialData);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     apiServer.get("/address").then((res) => {
//       setAddresses(res.data.addresses || []);
//       const def = res.data.addresses?.find((a) => a.isDefault);
//       if (def) setSelectedAddress(def);
//     });
//   }, []);

//   const saveNewAddress = async (data) => {
//     setLoading(true);
//     try {
//       const res = await apiServer.post("/address", data);
//       const saved = res.data.address;

//       setAddresses((prev) => [...prev, saved]);

//       await attachToCheckout(saved);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateExistingAddress = async (id, data) => {
//     setLoading(true);
//     try {
//       const res = await apiServer.put(`/address/${id}`, data);
//       const updated = res.data.address;

//       // 🔥 replace in address list
//       setAddresses((prev) =>
//         prev.map((a) => (a._id === updated._id ? updated : a))
//       );

//       await attachToCheckout(updated);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const attachToCheckout = async (address) => {
//     setLoading(true);
//     try {
//       const res = await apiServer.post("/checkout", {
//         shippingAddress: address,
//       });

//       setCheckout(res.data);
//       setSelectedAddress(address);
//     } finally {
//       setLoading(false);
//     }
//   };
  


//   const placeOrder = async () => {
//     setLoading(true);
//     try {
//       const res = await apiServer.post("/orders/cod", {
//         checkoutId: checkout.checkoutId,
//       });
//       router.push(`/order/success/${res.data.order._id}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!checkout?.success) {
//     return <div className="py-24 text-center">Checkout unavailable</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
//       <div className="lg:col-span-2">
//         {/* <AddressSection
//           addresses={addresses}
//           selected={selectedAddress}
//           onSelect={submitAddress}
//           loading={loading}
//         /> */}
//         <AddressSection
//           addresses={addresses}
//           selected={selectedAddress}
//           onCreate={saveNewAddress}
//           onUpdate={updateExistingAddress}
//           onSelect={attachToCheckout}
//           loading={loading}
//         />

//       </div>

//       <OrderSummary
//         items={checkout.items}
//         pricing={checkout.pricing}
//         warnings={checkout.warnings}
//         onConfirm={placeOrder}
//         loading={loading}
//         disabled={!selectedAddress || !checkout.canPlaceOrder}
//       />
//     </div>
//   );
// }











"use client";

import apiServer from "@/lib/apiServer";
import { useEffect, useState } from "react";
import AddressSection from "./AddressSection";
import CheckoutItems from "./CheckoutItems";
import OrderSummary from "./OrderSummary";
import PaymentMethod from "./PaymentMethod";

export default function CheckoutClient({ initialCheckout }) {
  const [checkout, setCheckout] = useState(initialCheckout);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(
    initialCheckout?.shippingAddressId || null
  );
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiServer.get("/address").then((res) => {
      setAddresses(res.data.addresses || []);
    });
  }, []);

  const selectAddress = async (address) => {
    setLoading(true);
    try {
      const res = await apiServer.patch(
        `/checkout/${checkout._id}`,
        { shippingAddressId: address._id }
      );
      setCheckout((prev) => ({
        ...prev,
        shippingAddressId: res.data.checkout.shippingAddressId,
      }));
      //setCheckout(res.data.checkout);
      setSelectedAddress(address);
    } finally {
      setLoading(false);
    }
  };

  const saveNewAddress = async (data) => {
    setLoading(true);
    try {
      const res = await apiServer.post("/address", data);
      const saved = res.data.address;

      setAddresses((prev) => [...prev, saved]);

      await attachToCheckout(saved);
    } finally {
      setLoading(false);
    }
  };

  const updateExistingAddress = async (id, data) => {
    setLoading(true);
    try {
      const res = await apiServer.put(`/address/${id}`, data);
      const updated = res.data.address;

      // 🔥 replace in address list
      setAddresses((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );

      await attachToCheckout(updated);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <AddressSection
          addresses={addresses}
          selected={selectedAddress}
          onCreate={saveNewAddress}
          onUpdate={updateExistingAddress}
          onSelect={selectAddress}
          loading={loading}
        />
        <div className="mt-5">
          <CheckoutItems items={checkout?.items} />
        </div>
        
        <div className="mt-5">
          <PaymentMethod
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>
      </div>

      <OrderSummary
        items={checkout?.items}
        pricing={checkout?.pricing}
        disabled={!selectedAddress}
        loading={loading}
      />
      
    </div>
  );
}
