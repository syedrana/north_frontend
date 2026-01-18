export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Categories
          </h1>
          <p className="text-sm text-slate-500">
            Manage product categories
          </p>
        </div>

        <button className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Add Category
        </button>
      </div>

      {/* Card */}
      <div className="bg-white border rounded-xl">
        <div className="p-4 sm:p-6">
          Category table here
        </div>
      </div>
    </div>
  );
}
