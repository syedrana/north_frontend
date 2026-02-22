"use client";

import api from "@/lib/apiServer";
import { useEffect, useState } from "react";

export default function SearchAnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/search/dashboard").then((res) => {
      setData(res.data.data);
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">
        Search Analytics
      </h1>

      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="font-semibold mb-3">
          Top Keywords
        </h2>

        {data.topKeywords.map((k) => (
          <div key={k._id} className="flex justify-between">
            <span>{k._id}</span>
            <span>{k.count}</span>
          </div>
        ))}
      </div>

      <div className="bg-white shadow p-4 rounded-lg">
        Zero Result Searches: {data.zeroResults}
      </div>
    </div>
  );
}