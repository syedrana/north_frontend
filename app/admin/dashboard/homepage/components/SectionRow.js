export default function SectionRow({
  section,
  index,
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
    <tr
      draggable={!reorderLoading}
      onDragStart={(event) => onDragStart(event, section._id)}
      onDragOver={onDragOver}
      onDrop={(event) => onDrop(event, section._id)}
      onDragEnd={onDragEnd}
      className={`border-t border-slate-200 ${draggingId === section._id ? "bg-blue-50" : "bg-white"}`}
    >
      <td className="px-3 py-3 text-lg text-slate-400">⋮⋮</td>
      <td className="px-3 py-3">{section.order ?? index + 1}</td>
      <td className="px-3 py-3 font-medium text-slate-900">{section.title || "Untitled"}</td>
      <td className="px-3 py-3 text-slate-700">{section.type || "n/a"}</td>
      <td className="px-3 py-3">
        <span className={`rounded px-2 py-1 text-xs font-semibold ${section.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          {section.status || "unknown"}
        </span>
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onMove(section._id, -1)}
            disabled={sections.findIndex((item) => item._id === section._id) === 0 || reorderLoading}
            className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-50"
          >
            Up
          </button>
          <button
            onClick={() => onMove(section._id, 1)}
            disabled={sections.findIndex((item) => item._id === section._id) === sections.length - 1 || reorderLoading}
            className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-50"
          >
            Down
          </button>
          <button
            onClick={() => onEdit(section)}
            disabled={pendingId === section._id || reorderLoading}
            className="rounded border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
          >
            Edit
          </button>
          <button
            onClick={() => onToggleStatus(section)}
            disabled={pendingId === section._id || reorderLoading}
            className="rounded border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
          >
            {section.status === "active" ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={() => onDelete(section._id)}
            disabled={pendingId === section._id || reorderLoading}
            className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
