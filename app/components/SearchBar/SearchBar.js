// "use client";

// import api from "@/lib/apiServer";
// import { AnimatePresence, motion } from "framer-motion";
// import { Search, X } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// export default function SearchBar({
//   placeholder = "Search products...",
//   onSearch,
//   trendingKeywords = [],
//   autoFocus = false,
//   showSuggestions = true,
// }) {
//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const inputRef = useRef(null);
//   const debounceTimer = useRef(null);

//   /* ----------------- Auto Focus ----------------- */
//   useEffect(() => {
//     if (autoFocus) inputRef.current?.focus();
//   }, [autoFocus]);

//   /* ----------------- Debounced API Call ----------------- */
//   /* ----------------- Debounced API Call ----------------- */
// useEffect(() => {
//   if (!showSuggestions) return;

//   const keyword = searchText.trim();

//   const timer = setTimeout(async () => {
//     try {
//       if (!keyword) {
//         setSuggestions([]);
//         return;
//       }

//       const res = await api.get("/products", {
//         params: {
//           search: keyword,
//           limit: 5,
//         },
//       });

//       setSuggestions(res.data.products || []);
//     } catch (err) {
//       console.log(err);
//     }
//   }, 300);

//   return () => clearTimeout(timer);
// }, [searchText, showSuggestions]);


//   /* ----------------- Handle Search ----------------- */
//   const handleSearch = (keyword) => {
//     if (!keyword?.trim()) return;
//     setShowDropdown(false);
//     onSearch(keyword.trim());
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch(searchText);
//   };

//   return (
//     <div className="relative w-full max-w-xl">
//       {/* Input */}
//       <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
//         <input
//           ref={inputRef}
//           type="text"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           onKeyDown={handleKeyDown}
//           onFocus={() => setShowDropdown(true)}
//           placeholder={placeholder}
//           className="flex-1 px-4 py-2 outline-none"
//         />
//         {searchText && (
//           <button
//             onClick={() => setSearchText("")}
//             className="p-2 hover:bg-gray-100"
//           >
//             <X size={16} />
//           </button>
//         )}
//         <button
//           onClick={() => handleSearch(searchText)}
//           className="p-2 bg-black text-white flex items-center justify-center"
//         >
//           <Search size={16} />
//         </button>
//       </div>

//       {/* Dropdown */}
//       <AnimatePresence>
//         {showDropdown && (suggestions.length > 0 || trendingKeywords.length > 0) && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="absolute z-50 w-full bg-white shadow-lg rounded-lg mt-1 max-h-80 overflow-y-auto"
//           >
//             {/* Suggestions from API */}
//             {suggestions.length > 0 && (
//               <ul className="divide-y">
//                 {suggestions.map((p) => (
//                   <li
//                     key={p._id}
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => handleSearch(p.name)}
//                   >
//                     {p.name}
//                   </li>
//                 ))}
//               </ul>
//             )}

//             {/* Trending keywords */}
//             {trendingKeywords.length > 0 && (
//               <div className="px-4 py-2">
//                 <p className="text-gray-400 text-sm mb-1">Trending</p>
//                 <ul className="flex flex-wrap gap-2">
//                   {trendingKeywords.map((t) => (
//                     <li
//                       key={t}
//                       className="cursor-pointer text-sm bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200"
//                       onClick={() => handleSearch(t)}
//                     >
//                       {t}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }









// "use client";

// import api from "@/lib/apiServer";
// import { AnimatePresence, motion } from "framer-motion";
// import { Search, X } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// export default function SearchBar({
//   placeholder = "Search products...",
//   onSearch,
//   trendingKeywords = [],
//   autoFocus = false,
//   showSuggestions = true,
// }) {
//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const inputRef = useRef(null);
//   const searchDebounce = useRef(null);
//   const suggestionDebounce = useRef(null);

//   /* ----------------- Auto Focus ----------------- */
//   useEffect(() => {
//     if (autoFocus) inputRef.current?.focus();
//   }, [autoFocus]);

//   /* ----------------- Auto Search Trigger (Enterprise UX) ----------------- */
//   useEffect(() => {
//     const keyword = searchText.trim();

//     if (searchDebounce.current) clearTimeout(searchDebounce.current);

//     if (!keyword) return;

//     searchDebounce.current = setTimeout(() => {
//       onSearch?.(keyword); // auto trigger navigation
//     }, 500); // 500ms UX sweet spot

//     return () => clearTimeout(searchDebounce.current);
//   }, [onSearch, searchText]);

//   /* ----------------- Suggestion API ----------------- */
//   useEffect(() => {
//     if (!showSuggestions) return;

//     const keyword = searchText.trim();

//     if (suggestionDebounce.current)
//       clearTimeout(suggestionDebounce.current);

//     suggestionDebounce.current = setTimeout(async () => {
//       try {
//         if (!keyword) {
//           setSuggestions([]);
//           return;
//         }

//         const res = await api.get("/products", {
//           params: {
//             search: keyword,
//             limit: 5,
//           },
//         });

//         setSuggestions(res.data.products || []);
//       } catch (err) {
//         console.log(err);
//       }
//     }, 300);

//     return () => clearTimeout(suggestionDebounce.current);
//   }, [searchText, showSuggestions]);

//   /* ----------------- Manual Search ----------------- */
//   const handleSearch = (keyword) => {
//     if (!keyword?.trim()) return;
//     setShowDropdown(false);
//     onSearch(keyword.trim());
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch(searchText);
//   };

//   return (
//     <div className="relative w-full max-w-xl">
//       {/* Input */}
//       <div className="flex items-center border rounded-full overflow-hidden shadow-sm bg-white">
//         <input
//           ref={inputRef}
//           type="text"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           onKeyDown={handleKeyDown}
//           onFocus={() => setShowDropdown(true)}
//           placeholder={placeholder}
//           className="flex-1 px-5 py-2 outline-none"
//         />

//         {searchText && (
//           <button
//             onClick={() => setSearchText("")}
//             className="p-2 hover:bg-gray-100 rounded-full"
//           >
//             <X size={16} />
//           </button>
//         )}

//         <button
//           onClick={() => handleSearch(searchText)}
//           className="px-4 py-2 bg-black text-white flex items-center justify-center"
//         >
//           <Search size={18} />
//         </button>
//       </div>

//       {/* Dropdown */}
//       <AnimatePresence>
//         {showDropdown &&
//           (suggestions.length > 0 || trendingKeywords.length > 0) && (
//             <motion.div
//               initial={{ opacity: 0, y: -8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               className="absolute z-50 w-full bg-white shadow-xl rounded-xl mt-2 max-h-96 overflow-y-auto border"
//             >
//               {/* Suggestions */}
//               {suggestions.length > 0 && (
//                 <ul className="divide-y">
//                   {suggestions.map((p) => (
//                     <li
//                       key={p._id}
//                       className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-between"
//                       onClick={() => handleSearch(p.name)}
//                     >
//                       <span>{p.name}</span>
//                       <span className="text-sm text-gray-400">
//                         ৳{p.price}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               )}

//               {/* Trending */}
//               {trendingKeywords.length > 0 && (
//                 <div className="px-4 py-3">
//                   <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">
//                     Trending
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {trendingKeywords.map((t) => (
//                       <button
//                         key={t}
//                         onClick={() => handleSearch(t)}
//                         className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
//                       >
//                         {t}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           )}
//       </AnimatePresence>
//     </div>
//   );
// }





















// "use client";

// import api from "@/lib/apiServer";
// import { AnimatePresence, motion } from "framer-motion";
// import { Search, X } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// export default function SearchBar({
//   placeholder = "Search products...",
//   onSearch,
//   trendingKeywords = [],
//   autoFocus = false,
//   showSuggestions = true,
// }) {
//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const inputRef = useRef(null);
//   const searchDebounce = useRef(null);
//   const skipAutoSearch = useRef(false); // click হলে auto search skip

//   /* ----------------- Auto Focus ----------------- */
//   useEffect(() => {
//     if (autoFocus) inputRef.current?.focus();
//   }, [autoFocus]);

//   /* ----------------- Debounced Auto Search ----------------- */
// //   useEffect(() => {
// //     if (!showSuggestions) return;

// //     const keyword = searchText.trim();

// //     // click selection skip করবে auto search
// //     if (skipAutoSearch.current) {
// //       skipAutoSearch.current = false;
// //       return;
// //     }

// //     if (searchDebounce.current) clearTimeout(searchDebounce.current);

// //     if (!keyword) {
// //       setSuggestions([]);
// //       onSearch?.(""); // empty text → reset results
// //       return;
// //     }

// //     searchDebounce.current = setTimeout(async () => {
// //       try {
// //         const res = await api.get("/products", {
// //           params: { search: keyword, limit: 5 },
// //         });
// //         setSuggestions(res.data.products || []);
// //         onSearch?.(keyword); // ⭐ type করার সাথে সাথে data load
// //       } catch (err) {
// //         console.log(err);
// //       }
// //     }, 300);

// //     return () => clearTimeout(searchDebounce.current);
// //   }, [searchText]);

// useEffect(() => {
//   if (!showSuggestions) return;

//   const keyword = searchText.trim();

//   // Debounce
//   if (searchDebounce.current) clearTimeout(searchDebounce.current);

//   searchDebounce.current = setTimeout(async () => {
//     try {
//       if (!keyword) {
//         // ⭐ Wrap state update in microtask to avoid cascading render
//         queueMicrotask(() => {
//           setSuggestions([]);
//           onSearch?.(""); // empty text → reset results
//         });
//         return;
//       }

//       const res = await api.get("/products", {
//         params: { search: keyword, limit: 5 },
//       });

//       queueMicrotask(() => {
//         setSuggestions(res.data.products || []);
//         onSearch?.(keyword); // live search
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }, 300);

//   return () => clearTimeout(searchDebounce.current);
// }, [searchText, showSuggestions, onSearch]);


//   /* ----------------- Handle Click Suggestion ----------------- */
//   const handleSearch = (keyword) => {
//     if (!keyword?.trim()) return;

//     skipAutoSearch.current = true; // avoid double auto search
//     setSearchText(keyword);
//     setShowDropdown(false);

//     onSearch(keyword); // ⭐ live click search
//   };

//   /* ----------------- Handle KeyDown (optional) ----------------- */
//   const handleKeyDown = (e) => {
//     // যদি চাই Enter press না থাকুক, তাহলে এইটা remove বা comment করতে পারো
//     // if (e.key === "Enter") handleSearch(searchText);
//   };

//   /* ----------------- Close dropdown on outside click ----------------- */
//   useEffect(() => {
//     const handler = (e) => {
//       if (!inputRef.current?.contains(e.target)) setShowDropdown(false);
//     };
//     document.addEventListener("click", handler);
//     return () => document.removeEventListener("click", handler);
//   }, []);

//   return (
//     <div className="relative w-full max-w-xl">
//       {/* Input */}
//       <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
//         <input
//           ref={inputRef}
//           type="text"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           onKeyDown={handleKeyDown}
//           onFocus={() => setShowDropdown(true)}
//           placeholder={placeholder}
//           className="flex-1 px-4 py-2 outline-none"
//         />
//         {searchText && (
//           <button
//             onClick={() => setSearchText("")}
//             className="p-2 hover:bg-gray-100"
//           >
//             <X size={16} />
//           </button>
//         )}
//         <button
//           onClick={() => handleSearch(searchText)}
//           className="p-2 bg-black text-white flex items-center justify-center"
//         >
//           <Search size={16} />
//         </button>
//       </div>

//       {/* Dropdown */}
//       <AnimatePresence>
//         {showDropdown && (suggestions.length > 0 || trendingKeywords.length > 0) && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="absolute z-50 w-full bg-white shadow-lg rounded-lg mt-1 max-h-80 overflow-y-auto"
//           >
//             {/* Suggestions */}
//             {suggestions.length > 0 && (
//               <ul className="divide-y">
//                 {suggestions.map((p) => (
//                   <li
//                     key={p._id}
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => handleSearch(p.name)}
//                   >
//                     {p.name}
//                   </li>
//                 ))}
//               </ul>
//             )}

//             {/* Trending keywords */}
//             {trendingKeywords.length > 0 && (
//               <div className="px-4 py-2">
//                 <p className="text-gray-400 text-sm mb-1">Trending</p>
//                 <ul className="flex flex-wrap gap-2">
//                   {trendingKeywords.map((t) => (
//                     <li
//                       key={t}
//                       className="cursor-pointer text-sm bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200"
//                       onClick={() => handleSearch(t)}
//                     >
//                       {t}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }













// "use client";

// import api from "@/lib/apiServer";
// import { AnimatePresence, motion } from "framer-motion";
// import { Search, X } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";

// export default function SearchBar({
//   placeholder = "Search products...",
//   onSearch,
//   trendingKeywords = [],
//   autoFocus = false,
//   showSuggestions = true,
// }) {
//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const inputRef = useRef(null);
//   const searchDebounce = useRef(null);

//   /* ----------------- Auto Focus ----------------- */
//   useEffect(() => {
//     if (autoFocus) inputRef.current?.focus();
//   }, [autoFocus]);

//   /* ----------------- Debounced Live Search ----------------- */
//   useEffect(() => {
//     if (!showSuggestions) return;

//     const keyword = searchText.trim();

//     // clear previous debounce
//     if (searchDebounce.current) clearTimeout(searchDebounce.current);

//     searchDebounce.current = setTimeout(async () => {
//       try {
//         if (!keyword) {
//           queueMicrotask(() => {
//             setSuggestions([]);
//             onSearch?.(""); // reset parent results
//           });
//           return;
//         }

//         const res = await api.get("/products", {
//           params: { search: keyword, limit: 5 },
//         });

//         queueMicrotask(() => {
//           setSuggestions(res.data.products || []);
//           onSearch?.(keyword); // live search
//         });
//       } catch (err) {
//         console.log(err);
//       }
//     }, 250); // 250ms debounce

//     return () => clearTimeout(searchDebounce.current);
//   }, [searchText, showSuggestions, onSearch]);

//   /* ----------------- Handle Click Search ----------------- */
//   const handleSearch = (keyword) => {
//     if (!keyword?.trim()) return;
//     setShowDropdown(false);
//     setSearchText(keyword.trim());
//     onSearch?.(keyword.trim());
//   };

//   return (
//     <div className="relative w-full max-w-xl">
//       {/* ----------------- Search Input ----------------- */}
//       <div className="flex items-center border rounded-lg shadow-md overflow-hidden transition focus-within:ring-2 focus-within:ring-indigo-500">
//         <input
//           ref={inputRef}
//           type="text"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           onFocus={() => setShowDropdown(true)}
//           placeholder={placeholder}
//           className="flex-1 px-4 py-2 outline-none text-sm md:text-base"
//         />
//         {searchText && (
//           <button
//             onClick={() => setSearchText("")}
//             className="p-2 hover:bg-gray-100 transition"
//           >
//             <X size={16} />
//           </button>
//         )}
//         <button
//           onClick={() => handleSearch(searchText)}
//           className="p-2 bg-black text-white flex items-center justify-center hover:bg-gray-900 transition"
//         >
//           <Search size={16} />
//         </button>
//       </div>

//       {/* ----------------- Suggestions Dropdown ----------------- */}
//       <AnimatePresence>
//         {showDropdown && (suggestions.length > 0 || trendingKeywords.length > 0) && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="absolute z-50 w-full bg-white shadow-lg rounded-lg mt-1 max-h-80 overflow-y-auto border border-gray-200"
//           >
//             {/* Live Suggestions */}
//             {suggestions.length > 0 && (
//               <ul className="divide-y">
//                 {suggestions.map((p) => (
//                   <li
//                     key={p._id}
//                     className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
//                     onClick={() => handleSearch(p.name)}
//                   >
//                     {/* Small Image */}
//                     <div className="w-10 h-10 relative flex-shrink-0">
//                       {p.mainImage ? (
//                         <Image
//                           src={p.mainImage}
//                           alt={p.name}
//                           fill
//                           className="object-contain rounded"
//                         />
//                       ) : (
//                         <div className="bg-gray-200 w-full h-full rounded" />
//                       )}
//                     </div>
//                     <span className="text-sm truncate">{p.name}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}

//             {/* Trending Keywords */}
//             {trendingKeywords.length > 0 && (
//               <div className="px-3 py-2">
//                 <p className="text-gray-400 text-xs mb-1">Trending</p>
//                 <ul className="flex flex-wrap gap-2">
//                   {trendingKeywords.map((t) => (
//                     <li
//                       key={t}
//                       className="cursor-pointer text-xs bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200 transition"
//                       onClick={() => handleSearch(t)}
//                     >
//                       {t}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }














"use client";

import api from "@/lib/apiServer";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function NavbarSearch({
  placeholder = "Search products...",
  onSearch,
  trendingKeywords = [],
}) {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  /* ----------------- Auto Focus on Expand ----------------- */
  useEffect(() => {
    if (expanded) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [expanded]);

  /* ----------------- Debounced Live Search ----------------- */
  useEffect(() => {
    const keyword = searchText.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        if (!keyword) {
          queueMicrotask(() => {
            setSuggestions([]);
            onSearch?.("");
          });
          return;
        }

        const res = await api.get("/products", {
          params: { search: keyword, limit: 5 },
        });

        queueMicrotask(() => {
          setSuggestions(res.data.products || []);
          onSearch?.(keyword);
        });
      } catch (err) {
        console.log(err);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [searchText, onSearch]);

  /* ----------------- Handle Search ----------------- */
  const handleSearch = (keyword) => {
    if (!keyword?.trim()) return;
    setSearchText(keyword.trim());
    setShowDropdown(false);
    onSearch?.(keyword.trim());
    setExpanded(false);
  };

  return (
    <div className="relative flex-1">
      {/* ----------------- Compact Navbar Input ----------------- */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 transition shadow-sm"
        >
          <Search size={18} />
          <span className="hidden md:inline text-sm">Search</span>
        </button>
      )}

      {/* ----------------- Expanded Overlay ----------------- */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-50 flex justify-center items-start pt-24 px-4 md:px-20"
          >
            <div className="w-full max-w-3xl relative">
              {/* Input */}
              <div className="flex items-center border rounded-lg shadow-md overflow-hidden transition focus-within:ring-2 focus-within:ring-indigo-500 bg-white">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={placeholder}
                  onFocus={() => setShowDropdown(true)}
                  className="flex-1 px-4 py-3 outline-none text-base md:text-lg"
                />
                {searchText && (
                  <button
                    onClick={() => setSearchText("")}
                    className="p-2 hover:bg-gray-100 transition"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleSearch(searchText)}
                  className="p-3 bg-black text-white flex items-center justify-center hover:bg-gray-900 transition"
                >
                  <Search size={16} />
                </button>
                <button
                  onClick={() => setExpanded(false)}
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Dropdown Suggestions */}
              <AnimatePresence>
                {showDropdown && (suggestions.length > 0 || trendingKeywords.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full bg-white shadow-lg rounded-lg mt-2 max-h-96 overflow-y-auto border border-gray-200"
                  >
                    {suggestions.length > 0 && (
                      <ul className="divide-y">
                        {suggestions.map((p) => (
                          <li
                            key={p._id}
                            className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => handleSearch(p.name)}
                          >
                            <div className="w-12 h-12 relative flex-shrink-0">
                              {p.mainImage ? (
                                <Image
                                  src={p.mainImage}
                                  alt={p.name}
                                  fill
                                  className="object-contain rounded"
                                />
                              ) : (
                                <div className="bg-gray-200 w-full h-full rounded" />
                              )}
                            </div>
                            <span className="truncate text-sm md:text-base">{p.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {trendingKeywords.length > 0 && (
                      <div className="px-4 py-3">
                        <p className="text-gray-400 text-xs mb-1">Trending</p>
                        <ul className="flex flex-wrap gap-2">
                          {trendingKeywords.map((t) => (
                            <li
                              key={t}
                              className="cursor-pointer text-xs bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200 transition"
                              onClick={() => handleSearch(t)}
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
