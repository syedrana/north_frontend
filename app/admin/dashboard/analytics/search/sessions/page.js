"use client";

import { getSessions } from "@/lib/adminAnalyticsApi";
import { useCallback, useEffect, useState, useTransition } from "react";

export default function SearchSessionsPage() {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    keyword: "",
    user: "",
    from: "",
    to: "",
    page: 1,
    limit: 10,
  });

  /* ================= LOAD DATA ================= */

  const loadData = useCallback(() => {

    startTransition(async () => {
      try {

        const res = await getSessions(filters);

        setData(res.data || []);
        setPagination(res.data?.pagination || {});

      } catch (err) {
        console.error(err);
      }
    });

  }, [filters, startTransition]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const getCTR = (row) => {
    if (!row.resultCount) return 0;
    return ((row.clickedProduct ? 1 : 0) / row.resultCount * 100).toFixed(1);
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-6 space-y-6">

      <Header total={pagination.total} />

      <Filters filters={filters} updateFilter={updateFilter} loadData={loadData} />

      {loading ? (
        <Skeleton />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <DesktopTable data={data} getCTR={getCTR} />
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {data.length === 0 ? (
              <Empty />
            ) : (
              data.map(row => (
                <MobileCard key={row._id} row={row} getCTR={getCTR} />
              ))
            )}
          </div>
        </>
      )}

      <Pagination
        page={pagination.page || 1}
        pages={pagination.pages || 1}
        onChange={(p) =>
          setFilters(prev => ({ ...prev, page: p }))
        }
      />

    </div>
  );
}

/* ================= HEADER ================= */

function Header({ total }) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl md:text-2xl font-semibold">
        Search Sessions
      </h1>

      <div className="text-sm text-gray-500">
        Total: {total || 0}
      </div>
    </div>
  );
}

/* ================= FILTERS ================= */

function Filters({ filters, updateFilter, loadData }) {

  return (
    <div className="bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-5 gap-3">

      <input
        placeholder="Keyword..."
        value={filters.keyword}
        onChange={(e) => updateFilter("keyword", e.target.value)}
        className="border rounded px-3 py-2"
      />

      <input
        placeholder="User email..."
        value={filters.user}
        onChange={(e) => updateFilter("user", e.target.value)}
        className="border rounded px-3 py-2"
      />

      <input
        type="date"
        value={filters.from}
        onChange={(e) => updateFilter("from", e.target.value)}
        className="border rounded px-3 py-2"
      />

      <input
        type="date"
        value={filters.to}
        onChange={(e) => updateFilter("to", e.target.value)}
        className="border rounded px-3 py-2"
      />

      <button
        onClick={loadData}
        className="bg-indigo-600 text-white rounded px-4 py-2"
      >
        Apply
      </button>

    </div>
  );
}

/* ================= DESKTOP TABLE ================= */

function DesktopTable({ data, getCTR }) {

  if (data.length === 0) return <Empty />;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">

      <table className="w-full text-sm">

        <thead className="bg-gray-50">
          <tr>
            <Th>User</Th>
            <Th>Keyword</Th>
            <Th>Results</Th>
            <Th>Clicked</Th>
            <Th>Pos</Th>
            <Th>CTR</Th>
            <Th>Revenue</Th>
            <Th>Time</Th>
          </tr>
        </thead>

        <tbody>
          {data.map(row => (
            <tr key={row._id} className="border-t hover:bg-gray-50">

              <Td>
                <div>{row.userId?.firstName || "Guest"}</div>
                <div className="text-xs text-gray-500">
                  {row.userId?.email}
                </div>
              </Td>

              <Td>{row.keyword}</Td>
              <Td>{row.resultCount}</Td>
              <Td>{row.clickedProduct?.name || "-"}</Td>
              <Td>{row.clickPosition || "-"}</Td>
              <Td className="text-indigo-600 font-medium">
                {getCTR(row)}%
              </Td>
              <Td>৳{row.revenue || 0}</Td>
              <Td>{new Date(row.createdAt).toLocaleString()}</Td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

/* ================= MOBILE CARD ================= */

function MobileCard({ row, getCTR }) {

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-2">

      <div className="flex justify-between">
        <div className="font-medium">
          {row.keyword}
        </div>
        <div className="text-indigo-600 font-semibold">
          {getCTR(row)}%
        </div>
      </div>

      <div className="text-sm text-gray-600">
        {row.userId?.email || "Guest"}
      </div>

      <div className="text-sm">
        Results: {row.resultCount}
      </div>

      <div className="text-sm">
        Clicked: {row.clickedProduct?.name || "-"}
      </div>

      <div className="text-sm">
        Position: {row.clickPosition || "-"}
      </div>

      <div className="flex justify-between text-sm pt-2 border-t">

        <div>৳{row.revenue || 0}</div>

        <div className="text-gray-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </div>

      </div>

    </div>
  );
}

/* ================= HELPERS ================= */

function Th({ children }) {
  return <th className="text-left px-4 py-3 font-medium">{children}</th>;
}

function Td({ children }) {
  return <td className="px-4 py-3">{children}</td>;
}

/* ================= EMPTY ================= */

function Empty() {
  return (
    <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
      No sessions found
    </div>
  );
}

/* ================= SKELETON ================= */

function Skeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-20 bg-gray-200 animate-pulse rounded"
        />
      ))}
    </div>
  );
}

/* ================= PAGINATION ================= */

function Pagination({ page, pages, onChange }) {
  return (
    <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">

      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-3 py-1 text-sm">
        Page {page} / {pages}
      </span>

      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
}