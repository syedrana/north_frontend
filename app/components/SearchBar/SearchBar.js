// "use client";

// import api from "@/lib/apiServer";
// import { AnimatePresence, motion } from "framer-motion";
// import { Search, X } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";

// export default function NavbarSearch({
//   placeholder = "Search products...",
//   onSearch,
//   trendingKeywords = [],
// }) {
//   const [searchText, setSearchText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [expanded, setExpanded] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const inputRef = useRef(null);
//   const debounceRef = useRef(null);

//   /* ================= AUTO FOCUS ================= */
//   useEffect(() => {
//     if (expanded) {
//       setTimeout(() => inputRef.current?.focus(), 50);
//     }
//   }, [expanded]);

//   /* ================= LIVE SUGGESTIONS ================= */
//   useEffect(() => {
//     const keyword = searchText.trim();

//     if (debounceRef.current) clearTimeout(debounceRef.current);

//     debounceRef.current = setTimeout(async () => {
//       try {
//         if (!keyword) {
//           setSuggestions([]);
//           return;
//         }

//         const res = await api.get("/products", {
//           params: { search: keyword, limit: 5 },
//         });

//         setSuggestions(res.data.products || []);
//       } catch (err) {
//         console.log(err);
//       }
//     }, 250);

//     return () => clearTimeout(debounceRef.current);
//   }, [searchText]);

//   /* ================= HANDLE SEARCH ================= */
//   const handleSearch = (keyword) => {
//     if (!keyword?.trim()) return;

//     setSearchText(keyword.trim());
//     setShowDropdown(false);
//     setExpanded(false);

//     onSearch?.(keyword.trim());
//   };

//   return (
//     <div className="relative flex-1">
//       {!expanded && (
//         <button
//           onClick={() => setExpanded(true)}
//           className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100"
//         >
//           <Search size={18} />
//           <span className="hidden md:inline text-sm">Search</span>
//         </button>
//       )}

//       <AnimatePresence>
//         {expanded && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="fixed inset-0 bg-white z-50 flex justify-center items-start pt-24 px-4"
//           >
//             <div className="w-full max-w-3xl relative">
//               {/* INPUT */}
//               <div className="flex items-center border rounded-lg shadow-md overflow-hidden bg-white">
//                 <input
//                   ref={inputRef}
//                   value={searchText}
//                   onChange={(e) => setSearchText(e.target.value)}
//                   onFocus={() => setShowDropdown(true)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleSearch(searchText);
//                   }}
//                   placeholder={placeholder}
//                   className="flex-1 px-4 py-3 outline-none"
//                 />

//                 {searchText && (
//                   <button
//                     onClick={() => setSearchText("")}
//                     className="p-2 hover:bg-gray-100"
//                   >
//                     <X size={16} />
//                   </button>
//                 )}

//                 <button
//                   onClick={() => handleSearch(searchText)}
//                   className="p-3 bg-black text-white"
//                 >
//                   <Search size={16} />
//                 </button>

//                 <button
//                   onClick={() => setExpanded(false)}
//                   className="absolute top-2 right-2 p-2"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* DROPDOWN */}
//               <AnimatePresence>
//                 {showDropdown &&
//                   (suggestions.length > 0 ||
//                     trendingKeywords.length > 0) && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute z-50 w-full bg-white shadow-lg rounded-lg mt-2"
//                     >
//                       {suggestions.length > 0 && (
//                         <ul className="divide-y">
//                           {suggestions.map((p) => (
//                             <li
//                               key={p._id}
//                               className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50"
//                               onClick={() =>
//                                 handleSearch(p.name)
//                               }
//                             >
//                               <div className="w-12 h-12 relative">
//                                 <Image
//                                   src={
//                                     p.mainImage ||
//                                     "/placeholder.png"
//                                   }
//                                   alt={p.name}
//                                   fill
//                                   className="object-contain rounded"
//                                 />
//                               </div>

//                               <span className="truncate">
//                                 {p.name}
//                               </span>
//                             </li>
//                           ))}
//                         </ul>
//                       )}

//                       {trendingKeywords.length > 0 && (
//                         <div className="px-4 py-3">
//                           <p className="text-gray-400 text-xs mb-1">
//                             Trending
//                           </p>

//                           <ul className="flex flex-wrap gap-2">
//                             {trendingKeywords.map((t) => (
//                               <li
//                                 key={t}
//                                 className="cursor-pointer text-xs bg-gray-100 px-2 py-1 rounded-md"
//                                 onClick={() =>
//                                   handleSearch(t)
//                                 }
//                               >
//                                 {t}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}
//                     </motion.div>
//                   )}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



















"use client";

import useSearchHistory from "@/hooks/useSearchHistory";
import api from "@/lib/apiServer";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Search, TrendingUp, X } from "lucide-react";
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

  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const {
    history,
    saveSearch,
    removeSearch,
    clearAll,
  } = useSearchHistory();

  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    if (expanded) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [expanded]);

  /* ================= FETCH SUGGESTIONS ================= */
  useEffect(() => {
    const keyword = searchText.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        if (!keyword) {
          setSuggestions([]);
          return;
        }

        const res = await api.get("/products", {
          params: { search: keyword, limit: 6 },
        });

        setSuggestions(res.data.products || []);
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchText]);

  /* ================= HANDLE SEARCH ================= */
  const handleSearch = (keyword) => {
    if (!keyword?.trim()) return;

    const clean = keyword.trim();

    saveSearch(clean);

    setExpanded(false);
    onSearch?.(clean);
  };

  /* ================= UI ================= */
  return (
    <div className="relative flex-1">
      {/* Compact */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100"
        >
          <Search size={18} />
          {/* <span className="hidden md:inline text-sm">
            Search
          </span> */}
        </button>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex justify-center items-start pt-20 px-3 md:px-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-3xl">

              {/* INPUT */}
              <div className="flex items-center border rounded-xl shadow-md overflow-hidden bg-white">
                <input
                  ref={inputRef}
                  value={searchText}
                  onChange={(e) =>
                    setSearchText(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      handleSearch(searchText);
                  }}
                  placeholder={placeholder}
                  className="flex-1 px-4 py-3 text-base outline-none"
                />

                {searchText && (
                  <button
                    onClick={() => setSearchText("")}
                    className="p-2"
                  >
                    <X size={18} />
                  </button>
                )}

                <button
                  onClick={() =>
                    handleSearch(searchText)
                  }
                  className="px-4 py-3 bg-black text-white"
                >
                  <Search size={18} />
                </button>

                <button
                  onClick={() => setExpanded(false)}
                  className="px-3"
                >
                  <X size={20} />
                </button>
              </div>

              {/* DROPDOWN */}
              <div className="bg-white mt-2 rounded-xl shadow-lg overflow-hidden">

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <ul>
                    {suggestions.map((p) => (
                      <li
                        key={p._id}
                        onClick={() =>
                          handleSearch(p.name)
                        }
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="w-12 h-12 relative">
                          <Image
                            src={
                              p.mainImage ||
                              "/placeholder.png"
                            }
                            alt={p.name}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <span className="text-sm">
                          {p.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Recent */}
                {!searchText &&
                  history.length > 0 && (
                    <div className="p-4 border-t">
                      <div className="flex justify-between mb-2">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={14} /> Recent
                        </p>

                        <button
                          onClick={clearAll}
                          className="text-xs"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {history.map((h) => (
                          <div
                            key={h}
                            className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-xs"
                          >
                            <span
                              onClick={() =>
                                handleSearch(h)
                              }
                              className="cursor-pointer"
                            >
                              {h}
                            </span>

                            <X
                              size={12}
                              className="ml-1 cursor-pointer"
                              onClick={() =>
                                removeSearch(h)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Trending */}
                {!searchText &&
                  trendingKeywords.length >
                    0 && (
                    <div className="p-4 border-t">
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                        <TrendingUp size={14} /> Trending
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {trendingKeywords.map(
                          (t) => (
                            <span
                              key={t}
                              onClick={() =>
                                handleSearch(t)
                              }
                              className="bg-gray-100 px-2 py-1 rounded-md text-xs cursor-pointer"
                            >
                              {t}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}