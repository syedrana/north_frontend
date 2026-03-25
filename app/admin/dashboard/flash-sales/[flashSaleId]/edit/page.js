"use client";

import { useParams } from "next/navigation";
import FlashSaleForm from "../../FlashSaleForm";

export default function EditFlashSalePage() {
  const params = useParams();
  return <FlashSaleForm mode="edit" flashSaleId={params?.flashSaleId} />;
}
