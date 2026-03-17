import SectionEditorPage from "../../components/SectionEditorPage";

export default async function EditHomepageSectionPage({ params }) {
  const { sectionId } = await params;
  return <SectionEditorPage mode="edit" sectionId={sectionId} />;
}
