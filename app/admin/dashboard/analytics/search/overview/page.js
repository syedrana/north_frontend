"use client";

import { getSearchOverview } from "@/lib/adminAnalyticsApi";
import { useEffect, useState, useTransition } from "react";

export default function OverviewPage() {

  const [data, setData] = useState(null);
  const [loading, startTransition] = useTransition();

  useEffect(() => {

    startTransition(async () => {
      try {

        const res = await getSearchOverview({
          from: "2024-01-01",
          to: "2030-01-01",
        });

        setData(res.data);

      } catch (err) {
        console.error(err);
      }
    });

  }, []);

  if (!data || loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">

      <Card title="Total Searches" value={data.totalSearches} />
      <Card title="Total Clicks" value={data.totalClicks} />
      <Card title="Zero Results" value={data.zeroResults} />
      <Card title="CTR %" value={(data.ctr * 100).toFixed(2)} />

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}