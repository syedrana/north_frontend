"use client";

import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SectionEditorForm from "../../components/SectionEditorForm";
import { INITIAL_FORM_STATE, SECTION_DEFAULT_SETTINGS } from "../../constants";
import { useHomepageSections } from "../../hooks/useHomepageSections";
import { prettyJson } from "../../utils";

export default function EditHomepageSectionPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params?.sectionId;

  const { saveSection, pendingId } = useHomepageSections({ autoFetch: false });
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [loadingSection, setLoadingSection] = useState(true);

  useEffect(() => {
    const loadSection = async () => {
      if (!sectionId) return;

      try {
        setLoadingSection(true);
        const response = await api.get(`/homepage/admin/sections/${sectionId}`);
        const section = response?.data?.section;

        if (!section) {
          throw new Error("Homepage section not found");
        }

        setFormData({
          sectionId: section._id,
          title: section.title || "",
          type: section.type || "hero_banner",
          status: section.status || "active",
          order: String(section.order ?? ""),
          settingsJson: prettyJson(section.settings || SECTION_DEFAULT_SETTINGS[section.type] || {}),
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message || "Failed to load section");
        router.push("/admin/dashboard/homepage");
      } finally {
        setLoadingSection(false);
      }
    };

    loadSection();
  }, [router, sectionId]);

  const handleSave = async (payload) => {
    if (!sectionId) return;

    try {
      await saveSection({
        mode: "edit",
        sectionId,
        payload,
      });
      router.push("/admin/dashboard/homepage");
      router.refresh();
    } catch (error) {
      setSaveErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  if (loadingSection) {
    return <div className="p-6 text-sm text-slate-600">Loading section...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 md:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <SectionEditorForm
          mode="edit"
          formData={formData}
          setFormData={setFormData}
          saveErrorMessage={saveErrorMessage}
          setSaveErrorMessage={setSaveErrorMessage}
          pending={pendingId === sectionId}
          onCancel={() => router.push("/admin/dashboard/homepage")}
          onSave={handleSave}
        />
      </div>
    </div>
  );

}
