"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useHomepageSections } from "../hooks/useHomepageSections";
import SectionsTable from "./SectionsTable";
import SectionsToolbar from "./SectionsToolbar";

export default function HomepageSectionsPage() {
  const router = useRouter();
  const {
    sections,
    setSections,
    loading,
    pendingId,
    reorderLoading,
    deleteSection,
    toggleSectionStatus,
    reorderSections,
    moveSectionById,
  } = useHomepageSections();

  const [draggingId, setDraggingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleDelete = async (sectionId) => {
    const confirmed = window.confirm("Are you sure you want to delete this section?");
    if (!confirmed) return;
    await deleteSection(sectionId);
  };

  const handleDragStart = (event, draggedSectionId) => {
    setDraggingId(draggedSectionId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedSectionId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (event, destinationSectionId) => {
    event.preventDefault();

    const sourceSectionId = event.dataTransfer.getData("text/plain");
    if (!sourceSectionId || sourceSectionId === destinationSectionId) {
      setDraggingId("");
      return;
    }

    const sourceIndex = sections.findIndex((section) => section._id === sourceSectionId);
    const destinationIndex = sections.findIndex((section) => section._id === destinationSectionId);
    if (sourceIndex < 0 || destinationIndex < 0) {
      setDraggingId("");
      return;
    }

    const reordered = [...sections];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, moved);

    setSections(reordered);
    setDraggingId("");
    await reorderSections(reordered);
  };

  const filteredSections = useMemo(
    () =>
      sections.filter((section) => {
        const matchesType = typeFilter === "all" ? true : section.type === typeFilter;
        const searchValue = `${section.title || ""} ${section.type || ""}`.toLowerCase();
        const matchesSearch = searchValue.includes(searchTerm.toLowerCase().trim());
        return matchesType && matchesSearch;
      }),
    [sections, searchTerm, typeFilter]
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <SectionsToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          onCreate={() => router.push("/admin/dashboard/homepage/create")}
          creating={false}
        />

        <p className="mb-3 text-xs text-slate-500">Drag and drop rows or use Up/Down controls to persist order.</p>

        <SectionsTable
          loading={loading}
          filteredSections={filteredSections}
          sections={sections}
          pendingId={pendingId}
          reorderLoading={reorderLoading}
          draggingId={draggingId}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={() => setDraggingId("")}
          onMove={moveSectionById}
          onEdit={(section) => router.push(`/admin/dashboard/homepage/${section._id}/edit`)}
          onToggleStatus={toggleSectionStatus}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
