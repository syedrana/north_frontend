import SectionRow from "./SectionRow";

export default function SectionsTable({
  loading,
  filteredSections,
  sections,
  pendingId,
  reorderLoading,
  draggingId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMove,
  onEdit,
  onToggleStatus,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-slate-200 text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-3">Drag</th>
            <th className="px-3 py-3">Order</th>
            <th className="px-3 py-3">Title</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td className="px-3 py-4 text-slate-500" colSpan={6}>Loading sections...</td></tr>
          ) : filteredSections.length === 0 ? (
            <tr><td className="px-3 py-4 text-slate-500" colSpan={6}>No sections found for current filter.</td></tr>
          ) : (
            filteredSections.map((section, index) => (
              <SectionRow
                key={section._id}
                section={section}
                index={index}
                sections={sections}
                pendingId={pendingId}
                reorderLoading={reorderLoading}
                draggingId={draggingId}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                onMove={onMove}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
