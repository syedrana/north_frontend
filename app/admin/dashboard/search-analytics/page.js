// "use client";

// import api from "@/lib/apiServer";
// import { useEffect, useState } from "react";

// export default function SearchAnalyticsPage() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     api.get("/searchanalytics/dashboard").then((res) => {
//       setData(res.data.data);
//     });
//   }, []);

//   if (!data) return <p>Loading...</p>;

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-xl font-semibold">
//         Search Analytics
//       </h1>

//       <div className="bg-white shadow p-4 rounded-lg">
//         <h2 className="font-semibold mb-3">
//           Top Keywords
//         </h2>

//         {data.topKeywords.map((k) => (
//           <div key={k._id} className="flex justify-between">
//             <span>{k._id}</span>
//             <span>{k.count}</span>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white shadow p-4 rounded-lg">
//         Zero Result Searches: {data.zeroResults}
//       </div>
//     </div>
//   );
// }















"use client";

import api from "@/lib/apiServer";
import { useEffect, useState } from "react";

export default function SearchAnalyticsPage() {
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function load() {
try {
const res = await api.get("/searchanalytics/dashboard");
setData(res.data.data);
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
}

load();

}, []);

if (loading) {
return ( <div className="p-6"> <div className="animate-pulse h-10 w-48 bg-gray-200 rounded mb-6"></div> <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
{Array.from({ length: 4 }).map((_, i) => ( <div
           key={i}
           className="h-24 bg-gray-200 rounded-lg animate-pulse"
         />
))} </div> </div>
);
}

if (!data) return <p className="p-6">No data found</p>;

const {
totalSearches = 0,
uniqueKeywords = 0,
zeroResults = 0,
clickedSearches = 0,
ctr = 0,
topKeywords = [],
recentSearches = [],
} = data;

const KPI = ({ title, value }) => ( <div className="bg-white rounded-xl shadow p-4"> <p className="text-sm text-gray-500">{title}</p> <p className="text-2xl font-semibold mt-1">{value}</p> </div>
);

return ( <div className="p-4 md:p-6 space-y-6"> <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"> <h1 className="text-xl md:text-2xl font-semibold">
Search Analytics </h1> </div>

  {/* KPI CARDS */}
  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
    <KPI title="Total Searches" value={totalSearches} />
    <KPI title="Unique Keywords" value={uniqueKeywords} />
    <KPI title="Zero Results" value={zeroResults} />
    <KPI title="Clicked Searches" value={clickedSearches} />
    <KPI title="CTR %" value={`${ctr}%`} />
  </div>

  {/* TOP KEYWORDS */}
  <div className="bg-white rounded-xl shadow">
    <div className="p-4 border-b">
      <h2 className="font-semibold">Top Keywords</h2>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left">
            <th className="p-3">Keyword</th>
            <th className="p-3">Search Count</th>
          </tr>
        </thead>

        <tbody>
          {topKeywords.map((k) => (
            <tr
              key={k._id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-3">{k._id}</td>
              <td className="p-3">{k.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* RECENT SEARCHES */}
  <div className="bg-white rounded-xl shadow">
    <div className="p-4 border-b">
      <h2 className="font-semibold">Recent Searches</h2>
    </div>

    <div className="divide-y">
      {recentSearches.map((s) => (
        <div
          key={s._id}
          className="p-3 flex justify-between text-sm"
        >
          <span>{s.keyword}</span>
          <span className="text-gray-500">
            {s.resultCount} results
          </span>
        </div>
      ))}
    </div>
  </div>
</div>
);
}
