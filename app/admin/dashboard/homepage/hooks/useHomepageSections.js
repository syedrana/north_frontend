import api from "@/lib/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export function useHomepageSections(options = {}) {
  const { autoFetch = true } = options;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState("");
  const [reorderLoading, setReorderLoading] = useState(false);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/homepage/admin/sections");
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
  }, []);

  useEffect(() => {
    if (!autoFetch) {
      setLoading(false);
      return;
    }

    fetchSections();
  }, [autoFetch, fetchSections]);

  const saveSection = useCallback(
    async ({ mode, sectionId, payload }) => {
      try {
        const pendingTargetId = mode === "create" ? "new" : sectionId;
        setPendingId(pendingTargetId);

        if (mode === "create") {
          await api.post("/homepage/admin/sections", payload);
          toast.success("Homepage section created");
        } else {
          await api.patch(`/homepage/admin/sections/${sectionId}`, payload);
          toast.success("Homepage section updated");
        }

        await fetchSections();
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Failed to save section");
      } finally {
        setPendingId("");
      }
    },
    [fetchSections]
  );

  const deleteSection = useCallback(
    async (sectionId) => {
      try {
        setPendingId(sectionId);
        await api.delete(`/homepage/admin/sections/${sectionId}`);
        toast.success("Section deleted");
        await fetchSections();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete section");
      } finally {
        setPendingId("");
      }
    },
    [fetchSections]
  );

  const toggleSectionStatus = useCallback(
    async (section) => {
      const sectionId = section?._id;
      if (!sectionId) return;

      try {
        setPendingId(sectionId);
        await api.patch(`/homepage/admin/sections/${sectionId}`, {
          status: section.status === "active" ? "hidden" : "active",
        });
        toast.success("Section status updated");
        await fetchSections();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to update status");
      } finally {
        setPendingId("");
      }
    },
    [fetchSections]
  );

  const reorderSections = useCallback(
    async (nextSections) => {
      const payload = nextSections.map((section, index) => ({
        sectionId: section._id,
        order: index + 1,
      }));

      try {
        setReorderLoading(true);
        await api.patch("/homepage/admin/sections/reorder", {
          sectionOrders: payload,
        });
        toast.success("Section order updated");
        setSections(nextSections.map((item, index) => ({ ...item, order: index + 1 })));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to reorder sections");
        await fetchSections();
      } finally {
        setReorderLoading(false);
      }
    },
    [fetchSections]
  );

  const moveSectionById = useCallback(
    async (sectionId, direction) => {
      const currentIndex = sections.findIndex((item) => item._id === sectionId);
      if (currentIndex < 0) return;

      const targetIndex = currentIndex + direction;
      if (targetIndex < 0 || targetIndex >= sections.length) return;

      const reordered = [...sections];
      const [moved] = reordered.splice(currentIndex, 1);
      reordered.splice(targetIndex, 0, moved);

      setSections(reordered);
      await reorderSections(reordered);
    },
    [reorderSections, sections]
  );

  const sectionIdOrder = useMemo(() => sections.map((item) => item._id), [sections]);

  return {
    sections,
    setSections,
    loading,
    pendingId,
    reorderLoading,
    fetchSections,
    saveSection,
    deleteSection,
    toggleSectionStatus,
    reorderSections,
    moveSectionById,
    sectionIdOrder,
  };
}
