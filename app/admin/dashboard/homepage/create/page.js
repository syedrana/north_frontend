"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import SectionEditorForm from "../components/SectionEditorForm";
import { INITIAL_FORM_STATE } from "../constants";
import { useHomepageSections } from "../hooks/useHomepageSections";

export default function CreateHomepageSectionPage() {
  const router = useRouter();
  const { saveSection, pendingId } = useHomepageSections({ autoFetch: false });
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [saveErrorMessage, setSaveErrorMessage] = useState("");

  const handleSave = async (payload) => {
    try {
      await saveSection({
        mode: "create",
        sectionId: "",
        payload,
      });
      router.push("/admin/dashboard/homepage");
      router.refresh();
    } catch (error) {
      setSaveErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 md:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <SectionEditorForm
          mode="create"
          formData={formData}
          setFormData={setFormData}
          saveErrorMessage={saveErrorMessage}
          setSaveErrorMessage={setSaveErrorMessage}
          pending={pendingId === "new"}
          onCancel={() => router.push("/admin/dashboard/homepage")}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
