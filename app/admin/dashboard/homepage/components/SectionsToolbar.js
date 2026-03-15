import { SECTION_TYPES } from "../constants";

export default function SectionsToolbar({ searchTerm, onSearchChange, typeFilter, onTypeFilterChange, onCreate, creating }) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Homepage Section Management</h1>
          <p className="text-sm text-slate-500">Create, edit, reorder and publish homepage sections for storefront delivery.</p>
        </div>

        <button
          onClick={onCreate}
          disabled={creating}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create Section"}
        </button>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title or type"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
        />

        <select
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
        >
          <option value="all">All Types</option>
          {SECTION_TYPES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>
    </>
  );
}
