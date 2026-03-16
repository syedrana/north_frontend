import SectionEditorPage from "../../components/SectionEditorForm";

export default async function EditHomepageSectionPage({ params }) {
  const { sectionId } = params;
  return <SectionEditorPage mode="edit" sectionId={sectionId} />;
}
