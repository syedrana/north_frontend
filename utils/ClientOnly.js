"use client";

import dynamic from "next/dynamic";

const ClientOnly = dynamic(
  () =>
    Promise.resolve(function ClientOnly({ children }) {
      return <>{children}</>;
    }),
  { ssr: false }
);

export default ClientOnly;
