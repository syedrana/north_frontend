"use client";

import apiServer from "@/lib/apiServer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddressSection from "./AddressSection";
import CheckoutItems from "./CheckoutItems";
import OrderSummary from "./OrderSummary";
import PaymentMethod from "./PaymentMethod";




export default function CheckoutClient({ initialCheckout }) {
  const [checkout, setCheckout] = useState(initialCheckout);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(
    initialCheckout?.paymentMethod || null
  );

  // useEffect(() => {
  //   if (initialCheckout?.shippingAddressId && addresses.length) {
  //     const found = addresses.find(
  //       (a) => a._id === initialCheckout.shippingAddressId
  //     );
  //     if (found) setSelectedAddress(found);
  //   }
  // }, [addresses, initialCheckout]);

  useEffect(() => {
    if (initialCheckout?.shippingAddressId && addresses.length > 0) {
      const found = addresses.find(
        (a) => a._id === initialCheckout.shippingAddressId._id ||
              a._id === initialCheckout.shippingAddressId
      );

      if (found) {
        setSelectedAddress(found);
      }
    }
  }, [addresses, initialCheckout]);


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
      setCheckout(res.data.checkout);
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

  const changePaymentMethod = async (method) => {
  setPaymentMethod(method);

  try {
    const res = await apiServer.patch(
      `/checkout/payment/${checkout._id}`,
      { paymentMethod: method }
    );

    setCheckout(res.data.checkout);
  } catch (err) {
    console.error("Payment update failed", err);
  }
};

const handlePlaceOrder = async () => {
  try {
    if (!selectedAddress?._id) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select payment method");
      return;
    }

    if (!checkout?.items || checkout.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    const res = await apiServer.post("/order/confirm", {
      checkoutId: checkout._id,
      // addressId: selectedAddress._id,
      // paymentMethod,
    });

    if (res.data.success) {
      toast.success("Order placed successfully");

      router.push(`/order-success?orderId=${res.data.orderId}`);
    }



  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Order failed");
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
            onChange={changePaymentMethod}
          />
        </div>
      </div>
      <OrderSummary
        items={checkout?.items}
        pricing={checkout?.pricing}
        paymentMethod={paymentMethod}
        onConfirm={handlePlaceOrder}
        disabled={
          loading ||
          !selectedAddress ||
          !paymentMethod ||
          !checkout?.items?.length
        }
        loading={loading}
      />
    </div>
  );
}
