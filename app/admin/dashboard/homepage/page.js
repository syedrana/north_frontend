"use client";

import api from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function AdminHomepageSectionsPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState("");
  const [draggingId, setDraggingId] = useState("");

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await api.get("/homepage");
      const fetchedSections = response?.data?.sections;

      if (!Array.isArray(fetchedSections)) {
        throw new Error("Invalid API response for homepage sections");
      }

      setSections(fetchedSections);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to fetch homepage sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const reorderSections = async (nextSections) => {
    const payload = nextSections.map((section, index) => ({
      sectionId: section?._id || section?.id,
      order: index + 1,
    })).filter((item) => item.sectionId);

    if (payload.length === 0) return;

    try {
      setPendingId("reorder");
      await api.patch("/admin/homepage/sections/reorder", {
        sections: payload,
      });
      toast.success("Section order updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reorder sections");
      fetchSections();
    } finally {
      setPendingId("");
    }
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

    const sourceIndex = sections.findIndex((section) => (section?._id || section?.id) === sourceSectionId);
    const destinationIndex = sections.findIndex((section) => (section?._id || section?.id) === destinationSectionId);

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

  const handleDelete = async (sectionId) => {
    const confirmed = window.confirm("Are you sure you want to delete this section?");
    if (!confirmed) return;

    try {
      setPendingId(sectionId);
      await api.delete(`/homepage/${sectionId}`);
      toast.success("Section deleted");
      fetchSections();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete section");
    } finally {
      setPendingId("");
    }
  };

  const handleToggleStatus = async (section) => {
    const sectionId = section?._id || section?.id;
    if (!sectionId) return;

    const currentStatus = section?.isActive ?? section?.active ?? section?.status;
    const nextStatus = typeof currentStatus === "boolean" ? !currentStatus : false;

    try {
      setPendingId(sectionId);
      await api.patch(`/homepage/${sectionId}/status`, { isActive: nextStatus });
      toast.success("Section status updated");
      fetchSections();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setPendingId("");
    }
  };

  const handleEdit = async (section) => {
    const sectionId = section?._id || section?.id;
    if (!sectionId) return;

    const nextTitle = window.prompt("Edit section title", section?.title || "");
    if (nextTitle === null) return;

    try {
      setPendingId(sectionId);
      await api.patch(`/homepage/${sectionId}`, { title: nextTitle.trim() });
      toast.success("Section updated");
      fetchSections();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update section");
    } finally {
      setPendingId("");
    }
  };

  const handleAddSection = async () => {
    const title = window.prompt("Section title");
    if (!title) return;

    const type = window.prompt("Section type (hero, category-grid, product-grid, campaign-banner, flash-sale, recently-viewed)", "product-grid");
    if (!type) return;

    try {
      setPendingId("new");
      await api.post("/homepage", { title: title.trim(), type: type.trim() });
      toast.success("Section added");
      fetchSections();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add section");
    } finally {
      setPendingId("");
    }
  };

  const sectionRows = useMemo(() => {
    if (!Array.isArray(sections)) return [];

    return sections.map((section, index) => {
      const id = section?._id || section?.id || `row-${index}`;
      const active = section?.isActive ?? section?.active ?? section?.status;

      return {
        id,
        order: index + 1,
        title: section?.title || "Untitled",
        type: section?.type || "n/a",
        status: typeof active === "boolean" ? (active ? "Active" : "Inactive") : "Unknown",
        original: section,
      };
    });
  }, [sections]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto w-full max-w-6xl rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Homepage Sections</h1>
            <p className="text-sm text-gray-500">Manage ecommerce homepage content blocks</p>
          </div>

          <button
            onClick={handleAddSection}
            disabled={pendingId === "new"}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {pendingId === "new" ? "Adding..." : "Add New Section"}
          </button>
        </div>

        <p className="mb-3 text-xs text-gray-500">Drag and drop rows using the handle to reorder sections.</p>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3">Drag</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-gray-500" colSpan={6}>Loading sections...</td>
                </tr>
              ) : sectionRows.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-gray-500" colSpan={6}>No sections found.</td>
                </tr>
              ) : (
                sectionRows.map((row) => (
                  <tr
                    key={row.id}
                    draggable={pendingId !== "reorder"}
                    onDragStart={(event) => handleDragStart(event, row.id)}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, row.id)}
                    onDragEnd={() => setDraggingId("")}
                    className={`border-t border-gray-200 ${draggingId === row.id ? "bg-blue-50" : "bg-white"}`}
                  >
                    <td className="px-4 py-3 text-lg text-gray-400">⋮⋮</td>
                    <td className="px-4 py-3">{row.order}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.title}</td>
                    <td className="px-4 py-3">{row.type}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${row.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(row.original)}
                          disabled={pendingId === row.id || pendingId === "reorder"}
                          className="rounded border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          disabled={pendingId === row.id || pendingId === "reorder"}
                          className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleToggleStatus(row.original)}
                          disabled={pendingId === row.id || pendingId === "reorder"}
                          className="rounded border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                        >
                          Toggle Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
