// "use client";

// import api from "@/lib/api";
// import { useEffect, useMemo, useRef, useState } from "react";
// import toast from "react-hot-toast";

// const SECTION_TYPES = [
//   { value: "hero_banner", label: "Hero Banner" },
//   { value: "category_grid", label: "Category Grid" },
//   { value: "product_grid", label: "Product Grid" },
//   { value: "campaign_banner", label: "Campaign Banner" },
// ];

// const SECTION_DEFAULT_SETTINGS = {
//   hero_banner: {
//     banners: [
//       {
//         image: "",
//         title: "",
//         subtitle: "",
//         buttonText: "",
//         link: "",
//       },
//     ],
//   },
//   category_grid: {
//     limit: 8,
//   },
//   product_grid: {
//     source: "new_arrival",
//     limit: 8,
//     productIds: [],
//   },
//   campaign_banner: {
//     campaigns: [
//       {
//         image: "",
//         link: "",
//       },
//     ],
//   },
// };

// const INITIAL_FORM_STATE = {
//   sectionId: "",
//   title: "",
//   type: "hero_banner",
//   status: "active",
//   order: "",
//   settingsJson: JSON.stringify(SECTION_DEFAULT_SETTINGS.hero_banner, null, 2),
// };

// const prettyJson = (value) => JSON.stringify(value ?? {}, null, 2);

// const parseSettingsOrThrow = (settingsJson) => {
//   try {
//     return JSON.parse(settingsJson || "{}");
//   } catch {
//     throw new Error("Settings JSON is invalid. Please fix JSON format.");
//   }
// };

// const parseSettingsOrFallback = (settingsJson) => {
//   try {
//     return JSON.parse(settingsJson || "{}");
//   } catch {
//     return {};
//   }
// };

// const updateSettingsJson = (settingsJson, updater) => {
//   const current = parseSettingsOrFallback(settingsJson);
//   const next = updater(current);
//   return prettyJson(next);
// };

// export default function AdminHomepageSectionsPage() {
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pendingId, setPendingId] = useState("");
//   const [reorderLoading, setReorderLoading] = useState(false);
//   const [draggingId, setDraggingId] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [typeFilter, setTypeFilter] = useState("all");

//   const [isEditorOpen, setIsEditorOpen] = useState(false);
//   const [editorMode, setEditorMode] = useState("create");
//   const [formData, setFormData] = useState(INITIAL_FORM_STATE);
//   const [saveErrorMessage, setSaveErrorMessage] = useState("");

//   const heroImageInputRef = useRef(null);
//   const campaignImageInputRef = useRef(null);

//   const fetchSections = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get("/homepage/admin/sections");
//       const fetchedSections = response?.data?.sections;

//       if (!Array.isArray(fetchedSections)) {
//         throw new Error("Invalid API response for homepage sections");
//       }

//       setSections(fetchedSections);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error?.message || "Failed to fetch homepage sections");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSections();
//   }, []);

//   const openCreateEditor = () => {
//     setEditorMode("create");
//     setFormData(INITIAL_FORM_STATE);
//     setSaveErrorMessage("");
//     setIsEditorOpen(true);
//   };

//   const openEditEditor = (section) => {
//     setEditorMode("edit");
//     setFormData({
//       sectionId: section._id,
//       title: section.title || "",
//       type: section.type || "hero_banner",
//       status: section.status || "active",
//       order: String(section.order ?? ""),
//       settingsJson: prettyJson(section.settings || SECTION_DEFAULT_SETTINGS[section.type] || {}),
//     });
//     setSaveErrorMessage("");
//     setIsEditorOpen(true);
//   };

//   const convertFileToDataUrl = (file) => new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = () => reject(new Error("Failed to read image file"));
//     reader.readAsDataURL(file);
//   });

//   const handleImagePick = async (event, sectionType) => {
//     const file = event.target.files?.[0];

//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file");
//       event.target.value = "";
//       return;
//     }

//     try {
//       const dataUrl = await convertFileToDataUrl(file);

//       setFormData((prev) => ({
//         ...prev,
//         settingsJson: updateSettingsJson(prev.settingsJson, (current) => {
//           if (sectionType === "hero_banner") {
//             return {
//               ...current,
//               banners: [
//                 {
//                   ...(current?.banners?.[0] || {}),
//                   image: dataUrl,
//                 },
//                 ...(Array.isArray(current?.banners) ? current.banners.slice(1) : []),
//               ],
//             };
//           }

//           return {
//             ...current,
//             campaigns: [
//               {
//                 ...(current?.campaigns?.[0] || {}),
//                 image: dataUrl,
//               },
//               ...(Array.isArray(current?.campaigns) ? current.campaigns.slice(1) : []),
//             ],
//           };
//         }),
//       }));

//       toast.success("Image selected. Click Save Section to persist.");
//     } catch (error) {
//       toast.error(error.message || "Failed to process image");
//     } finally {
//       event.target.value = "";
//     }
//   };

//   const handleTypeChange = (nextType) => {
//     setFormData((previous) => ({
//       ...previous,
//       type: nextType,
//       settingsJson:
//         editorMode === "create"
//           ? prettyJson(SECTION_DEFAULT_SETTINGS[nextType] || {})
//           : previous.settingsJson,
//     }));
//   };

//   const saveSection = async () => {
//     setSaveErrorMessage("");
//     const title = formData.title.trim();

//     if (!title) {
//       setSaveErrorMessage("Title is required.");
//       toast.error("Title is required");
//       return;
//     }

//     let parsedSettings;
//     try {
//       parsedSettings = parseSettingsOrThrow(formData.settingsJson);
//     } catch (error) {
//       setSaveErrorMessage(error.message);
//       toast.error(error.message);
//       return;
//     }

//     const payload = {
//       title,
//       type: formData.type,
//       status: formData.status,
//       settings: parsedSettings,
//     };

//     if (formData.order !== "") {
//       payload.order = Number(formData.order);
//     }

//     try {
//       setPendingId(editorMode === "create" ? "new" : formData.sectionId);

//       if (editorMode === "create") {
//         await api.post("/homepage/admin/sections", payload);
//         toast.success("Homepage section created");
//       } else {
//         await api.patch(`/homepage/admin/sections/${formData.sectionId}`, payload);
//         toast.success("Homepage section updated");
//       }

//       setIsEditorOpen(false);
//       fetchSections();
//     } catch (error) {
//       const backendMessage = error?.response?.data?.message || "Failed to save section";
//       setSaveErrorMessage(backendMessage);
//       toast.error(backendMessage);
//     } finally {
//       setPendingId("");
//     }
//   };

//   const handleDelete = async (sectionId) => {
//     const confirmed = window.confirm("Are you sure you want to delete this section?");
//     if (!confirmed) return;

//     try {
//       setPendingId(sectionId);
//       await api.delete(`/homepage/admin/sections/${sectionId}`);
//       toast.success("Section deleted");
//       fetchSections();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to delete section");
//     } finally {
//       setPendingId("");
//     }
//   };

//   const handleToggleStatus = async (section) => {
//     const sectionId = section?._id;
//     if (!sectionId) return;

//     try {
//       setPendingId(sectionId);
//       await api.patch(`/homepage/admin/sections/${sectionId}`, {
//         status: section.status === "active" ? "hidden" : "active",
//       });
//       toast.success("Section status updated");
//       fetchSections();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to update status");
//     } finally {
//       setPendingId("");
//     }
//   };

//   const reorderSections = async (nextSections) => {
//     const payload = nextSections.map((section, index) => ({
//       sectionId: section._id,
//       order: index + 1,
//     }));

//     try {
//       setReorderLoading(true);
//       await api.patch("/homepage/admin/sections/reorder", {
//         sectionOrders: payload,
//       });
//       toast.success("Section order updated");
//       setSections(nextSections.map((item, index) => ({ ...item, order: index + 1 })));
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to reorder sections");
//       fetchSections();
//     } finally {
//       setReorderLoading(false);
//     }
//   };

//   const handleDragStart = (event, draggedSectionId) => {
//     setDraggingId(draggedSectionId);
//     event.dataTransfer.effectAllowed = "move";
//     event.dataTransfer.setData("text/plain", draggedSectionId);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = "move";
//   };

//     const handleDrop = async (event, destinationSectionId) => {
//     event.preventDefault();

//     const sourceSectionId = event.dataTransfer.getData("text/plain");
//     if (!sourceSectionId || sourceSectionId === destinationSectionId) {
//       setDraggingId("");
//       return;
//     }

//     const sourceIndex = sections.findIndex((section) => section._id === sourceSectionId);
//     const destinationIndex = sections.findIndex((section) => section._id === destinationSectionId);

//     if (sourceIndex < 0 || destinationIndex < 0) {
//       setDraggingId("");
//       return;
//     }

//     const reordered = [...sections];
//     const [moved] = reordered.splice(sourceIndex, 1);
//     reordered.splice(destinationIndex, 0, moved);

//     setSections(reordered);
//     setDraggingId("");
//     await reorderSections(reordered);
//   };

//   const moveSectionById = async (sectionId, direction) => {
//     const currentIndex = sections.findIndex((item) => item._id === sectionId);
//     if (currentIndex < 0) return;

//     const targetIndex = currentIndex + direction;

//     if (targetIndex < 0 || targetIndex >= sections.length) {
//       return;
//     }

//     const reordered = [...sections];
//     const [moved] = reordered.splice(currentIndex, 1);
//     reordered.splice(targetIndex, 0, moved);

//     setSections(reordered);
//     await reorderSections(reordered);
//   };

//   const filteredSections = useMemo(() => {
//     return sections.filter((section) => {
//       const matchesType = typeFilter === "all" ? true : section.type === typeFilter;
//       const searchValue = `${section.title || ""} ${section.type || ""}`.toLowerCase();
//       const matchesSearch = searchValue.includes(searchTerm.toLowerCase().trim());
//       return matchesType && matchesSearch;
//     });
//   }, [sections, searchTerm, typeFilter]);

//   const settingsValidationMessage = useMemo(() => {
//     try {
//       parseSettingsOrThrow(formData.settingsJson);
//       return "";
//     } catch (error) {
//       return error.message;
//     }
//   }, [formData.settingsJson]);

//   const quickSettings = useMemo(() => {
//     const parsed = parseSettingsOrFallback(formData.settingsJson);

//     if (formData.type === "hero_banner") {
//       const firstBanner = parsed?.banners?.[0] || {};
//       return {
//         image: firstBanner.image || "",
//         title: firstBanner.title || "",
//         subtitle: firstBanner.subtitle || "",
//         buttonText: firstBanner.buttonText || "",
//         link: firstBanner.link || "",
//       };
//     }

//     if (formData.type === "category_grid") {
//       return {
//         limit: String(parsed?.limit ?? 8),
//       };
//     }

//     if (formData.type === "product_grid") {
//       return {
//         source: parsed?.source || "new_arrival",
//         limit: String(parsed?.limit ?? 8),
//         productIds: Array.isArray(parsed?.productIds) ? parsed.productIds.join(",") : "",
//       };
//     }

//     if (formData.type === "campaign_banner") {
//       const firstCampaign = parsed?.campaigns?.[0] || {};
//       return {
//         image: firstCampaign.image || "",
//         link: firstCampaign.link || "",
//       };
//     }

//     return {};
//   }, [formData.settingsJson, formData.type]);

//   return (
//     <div className="min-h-screen w-full bg-slate-50 p-4 md:p-8">
//       <div className="mx-auto w-full max-w-7xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
//         <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//           <div>
//             <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Homepage Section Management</h1>
//             <p className="text-sm text-slate-500">Create, edit, reorder and publish homepage sections for storefront delivery.</p>
//           </div>

//           <button
//             onClick={openCreateEditor}
//             disabled={pendingId === "new"}
//             className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {pendingId === "new" ? "Creating..." : "Create Section"}
//           </button>
//         </div>

//         <div className="mb-4 grid gap-3 md:grid-cols-2">
//           <input
//             value={searchTerm}
//             onChange={(event) => setSearchTerm(event.target.value)}
//             placeholder="Search by title or type"
//             className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
//           />

//           <select
//             value={typeFilter}
//             onChange={(event) => setTypeFilter(event.target.value)}
//             className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
//           >
//             <option value="all">All Types</option>
//             {SECTION_TYPES.map((item) => (
//               <option key={item.value} value={item.value}>{item.label}</option>
//             ))}
//           </select>
//         </div>

//         <p className="mb-3 text-xs text-slate-500">Drag and drop rows or use Up/Down controls to persist order.</p>

//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-slate-200 text-left text-sm">
//             <thead className="bg-slate-100 text-slate-700">
//               <tr>
//                 <th className="px-3 py-3">Drag</th>
//                 <th className="px-3 py-3">Order</th>
//                 <th className="px-3 py-3">Title</th>
//                 <th className="px-3 py-3">Type</th>
//                 <th className="px-3 py-3">Status</th>
//                 <th className="px-3 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td className="px-3 py-4 text-slate-500" colSpan={6}>Loading sections...</td></tr>
//               ) : filteredSections.length === 0 ? (
//                 <tr><td className="px-3 py-4 text-slate-500" colSpan={6}>No sections found for current filter.</td></tr>
//               ) : (
//                 filteredSections.map((section, index) => (
//                   <tr
//                     key={section._id}
//                     draggable={!reorderLoading}
//                     onDragStart={(event) => handleDragStart(event, section._id)}
//                     onDragOver={handleDragOver}
//                     onDrop={(event) => handleDrop(event, section._id)}
//                     onDragEnd={() => setDraggingId("")}
//                     className={`border-t border-slate-200 ${draggingId === section._id ? "bg-blue-50" : "bg-white"}`}
//                   >
//                     <td className="px-3 py-3 text-lg text-slate-400">⋮⋮</td>
//                     <td className="px-3 py-3">{section.order ?? index + 1}</td>
//                     <td className="px-3 py-3 font-medium text-slate-900">{section.title || "Untitled"}</td>
//                     <td className="px-3 py-3 text-slate-700">{section.type || "n/a"}</td>
//                     <td className="px-3 py-3">
//                       <span className={`rounded px-2 py-1 text-xs font-semibold ${section.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
//                         {section.status || "unknown"}
//                       </span>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           onClick={() => moveSectionById(section._id, -1)}
//                           disabled={sections.findIndex((item) => item._id === section._id) === 0 || reorderLoading}
//                           className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-50"
//                         >
//                            Up
//                         </button>
//                         <button
//                           onClick={() => moveSectionById(section._id, 1)}
//                           disabled={sections.findIndex((item) => item._id === section._id) === sections.length - 1 || reorderLoading}
//                           className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-50"
//                         >
//                           Down
//                         </button>
//                         <button
//                           onClick={() => openEditEditor(section)}
//                           disabled={pendingId === section._id || reorderLoading}
//                           className="rounded border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleToggleStatus(section)}
//                           disabled={pendingId === section._id || reorderLoading}
//                           className="rounded border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
//                         >
//                           {section.status === "active" ? "Deactivate" : "Activate"}
//                         </button>
//                         <button
//                           onClick={() => handleDelete(section._id)}
//                           disabled={pendingId === section._id || reorderLoading}
//                           className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {isEditorOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
//           <div className="w-full max-w-3xl rounded-xl bg-white p-5 shadow-xl">
//             <div className="mb-4 flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-slate-900">
//                 {editorMode === "create" ? "Create Homepage Section" : "Edit Homepage Section"}
//               </h2>
//               <button
//                 onClick={() => setIsEditorOpen(false)}
//                 className="rounded border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
//               >
//                 Close
//               </button>
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
//                 <input
//                   value={formData.title}
//                   onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
//                   placeholder="e.g. Featured Products"
//                   className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
//                 <select
//                   value={formData.type}
//                   onChange={(event) => handleTypeChange(event.target.value)}
//                   disabled={editorMode === "edit"}
//                   className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 disabled:bg-slate-100"
//                 >
//                   {SECTION_TYPES.map((item) => (
//                     <option key={item.value} value={item.value}>{item.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
//                 <select
//                   value={formData.status}
//                   onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
//                   className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
//                 >
//                   <option value="active">active</option>
//                   <option value="hidden">hidden</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700">Order (optional)</label>
//                 <input
//                   value={formData.order}
//                   onChange={(event) => setFormData((prev) => ({ ...prev, order: event.target.value }))}
//                   placeholder="e.g. 1"
//                   type="number"
//                   className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
//                 />
//               </div>
//             </div>

//             <div className="mt-4">
//               <label className="mb-2 block text-sm font-medium text-slate-700">Quick Settings</label>

//               {formData.type === "hero_banner" && (
//                 <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
//                   <input
//                     ref={heroImageInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={(event) => handleImagePick(event, "hero_banner")}
//                     className="hidden"
//                   />
//                   <input
//                     value={quickSettings.image}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           banners: [
//                             {
//                               ...(current?.banners?.[0] || {}),
//                               image: event.target.value,
//                             },
//                             ...(Array.isArray(current?.banners) ? current.banners.slice(1) : []),
//                           ],
//                         })),
//                       }))
//                     }
//                     placeholder="Banner image URL"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => heroImageInputRef.current?.click()}
//                     className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
//                   >
//                     Upload Banner Image
//                   </button>
//                   <input
//                     value={quickSettings.link}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           banners: [
//                             {
//                               ...(current?.banners?.[0] || {}),
//                               link: event.target.value,
//                             },
//                             ...(Array.isArray(current?.banners) ? current.banners.slice(1) : []),
//                           ],
//                         })),
//                       }))
//                     }
//                     placeholder="Button link"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                   <input
//                     value={quickSettings.title}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           banners: [
//                             {
//                               ...(current?.banners?.[0] || {}),
//                               title: event.target.value,
//                             },
//                             ...(Array.isArray(current?.banners) ? current.banners.slice(1) : []),
//                           ],
//                         })),
//                       }))
//                     }
//                     placeholder="Banner title"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                   <input
//                     value={quickSettings.subtitle}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           banners: [
//                             {
//                               ...(current?.banners?.[0] || {}),
//                               subtitle: event.target.value,
//                             },
//                             ...(Array.isArray(current?.banners) ? current.banners.slice(1) : []),
//                           ],
//                         })),
//                       }))
//                     }
//                     placeholder="Banner subtitle"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                   <input
//                     value={quickSettings.buttonText}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           banners: [
//                             {
//                               ...(current?.banners?.[0] || {}),
//                               buttonText: event.target.value,
//                             },
//                             ...(Array.isArray(current?.banners) ? current.banners.slice(1) : []),
//                           ],
//                         })),
//                       }))
//                     }
//                     placeholder="Button text"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
//                   />
//                 </div>
//               )}

//               {formData.type === "category_grid" && (
//                 <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
//                   <input
//                     type="number"
//                     min={1}
//                     value={quickSettings.limit}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           limit: Number(event.target.value || 0),
//                         })),
//                       }))
//                     }
//                     placeholder="Category limit"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                 </div>
//               )}

//               {formData.type === "product_grid" && (
//                 <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
//                   <input
//                     value={quickSettings.source}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           source: event.target.value,
//                         })),
//                       }))
//                     }
//                     placeholder="Source (new_arrival, featured, etc)"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                   <input
//                     type="number"
//                     min={1}
//                     value={quickSettings.limit}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           limit: Number(event.target.value || 0),
//                         })),
//                       }))
//                     }
//                     placeholder="Product limit"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                   <input
//                     value={quickSettings.productIds}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           productIds: event.target.value
//                             .split(",")
//                             .map((item) => item.trim())
//                             .filter(Boolean),
//                         })),
//                       }))
//                     }
//                     placeholder="Product IDs (comma separated)"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
//                   />
//                 </div>
//               )}

//               {formData.type === "campaign_banner" && (
//                 <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
//                   <input
//                     ref={campaignImageInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={(event) => handleImagePick(event, "campaign_banner")}
//                     className="hidden"
//                   />
//                   <input
//                     value={quickSettings.image}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           campaigns: [
//                             {
//                               ...(current?.campaigns?.[0] || {}),
//                               image: event.target.value,
//                             },
//                             ...(Array.isArray(current?.campaigns) ? current.campaigns.slice(1) : []),
//                           ],
//                         })),
//                       }))
//                     }
//                     placeholder="Campaign image URL"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => campaignImageInputRef.current?.click()}
//                     className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
//                   >
//                     Upload Campaign Image
//                   </button>
//                   <input
//                     value={quickSettings.link}
//                     onChange={(event) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         settingsJson: updateSettingsJson(prev.settingsJson, (current) => ({
//                           ...current,
//                           campaigns: [
//                             {
//                               ...(current?.campaigns?.[0] || {}),
//                               link: event.target.value,
//                             },
//                             ...(Array.isArray(current?.campaigns) ? current.campaigns.slice(1) : []),
//                           ],
//                         })),
//                       }))
//                     }
//                     placeholder="Campaign link"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="mt-4">
//               <label className="mb-1 block text-sm font-medium text-slate-700">Settings (JSON)</label>
//               <textarea
//                 value={formData.settingsJson}
//                 onChange={(event) => setFormData((prev) => ({ ...prev, settingsJson: event.target.value }))}
//                 rows={14}
//                 className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs focus:border-slate-500"
//               />
//               {settingsValidationMessage ? (
//                 <p className="mt-2 text-xs font-medium text-red-600">{settingsValidationMessage}</p>
//               ) : (
//                 <p className="mt-2 text-xs text-slate-500">Tip: Settings shape is validated by backend. Keep valid JSON and required fields per section type.</p>
//               )}
//             </div>

//             {(saveErrorMessage || settingsValidationMessage) && (
//               <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
//                 {saveErrorMessage || settingsValidationMessage}
//               </div>
//             )}

//             <div className="mt-5 flex items-center justify-end gap-2">
//               <button
//                 onClick={() => setIsEditorOpen(false)}
//                 className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveSection}
//                 disabled={pendingId === "new" || pendingId === formData.sectionId || Boolean(settingsValidationMessage)}
//                 className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
//               >
//                 {pendingId === "new" || pendingId === formData.sectionId ? "Saving..." : "Save Section"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



























import HomepageSectionsPage from "./components/HomepageSectionsPage";

export default function Page() {
  return <HomepageSectionsPage />;
}