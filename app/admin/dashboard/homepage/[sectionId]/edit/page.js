import SectionEditorPage from "../../components/SectionEditorPage";

export default function EditHomepageSectionPage({ params }) {
  const { sectionId } = params;
  return <SectionEditorPage mode="edit" sectionId={sectionId} />;
}
