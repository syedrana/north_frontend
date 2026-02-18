"use client";

import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
