"use client";

import { getKeywordAnalytics } from "@/lib/adminAnalyticsApi";
import { useEffect, useState, useTransition } from "react";

export default function KeywordsPage() {

  const [data, setData] = useState([]);
  const [loading, startTransition] = useTransition();

  useEffect(() => {

    startTransition(async () => {
      try {

        const res = await getKeywordAnalytics();
        setData(res.data || []);

      } catch (err) {
        console.error(err);
      }
    });

  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">
            <tr>
              <Th>Keyword</Th>
              <Th>Searches</Th>
              <Th>Clicks</Th>
              <Th>CTR</Th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10">
                  No data
                </td>
              </tr>
            ) : (
              data.map((k) => (
                <tr key={k._id} className="border-t">
                  <Td>{k._id}</Td>
                  <Td>{k.searches}</Td>
                  <Td>{k.clicks}</Td>
                  <Td className="text-indigo-600 font-medium">
                    {(k.ctr * 100).toFixed(2)}%
                  </Td>
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}

function Th({ children }) {
  return <th className="text-left px-4 py-3">{children}</th>;
}

function Td({ children }) {
  return <td className="px-4 py-3">{children}</td>;
}