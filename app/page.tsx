"use client";

import { useActionState, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "motion/react";
import { searchAction } from "@/app/actions/search";
import BookCard from "@/app/components/BookCard";
import { getRecentBooks } from "./actions/recentbooks";
import Link from "next/link";

const initialState = { books: [], query: "" };

export default function HomePage() {
  const [state, formAction, isPending] = useActionState(
    searchAction,
    initialState,
  );
  const [searchValue, setSearchValue] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [recentBooks, setRecentBooks] = useState<
    {
      bookId: string;
      bookTitle: string;
      bookCover: string | null;
    }[]
  >([]);

  /* Get search history */
  useEffect(() => {
    getRecentBooks().then(setRecentBooks);
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  /* Function to add to search history */
  const saveToHistory = (query: string) => {
    /* Only save the latest 5 searches.  */
    const updated = [query, ...history.filter((h) => h !== query)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
        {/* Animated hero-text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-blue text-sm font-medium tracking-widest uppercase mb-4"
        >
          Litteratur & Recensioner
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-navy tracking-tight mb-4 leading-tight"
        >
          Hitta din nästa bok
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted text-lg mb-12 max-w-md"
        >
          Sök bland miljontals böcker och ta del av andras recensioner
        </motion.p>

        {/* Animated searchfield with search history*/}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          action={formAction}
          onSubmit={() => {
            /* Save to search history */
            if (searchValue.trim()) saveToHistory(searchValue.trim());
            setSearchValue("");
            setShowHistory(false);
          }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xl"
        >
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              autoComplete="off"
              type="text"
              name="query"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              /* When input-field is focused, show search history with delay */
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 150)}
              placeholder="Titel..."
              className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue shadow-sm"
            />
            {/* Search history */}
            {showHistory && history.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-10">
                {history.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={() => {
                      setSearchValue(item);
                      setShowHistory(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-navy hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Search size={12} className="text-muted shrink-0" />
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            type="submit"
            disabled={isPending}
            className="bg-navy text-white text-sm px-7 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
          >
            {isPending ? "Söker..." : "Sök"}
          </button>
        </motion.form>
      </section>

      {/* Results */}
      <section className="px-6 pb-16 max-w-6xl mx-auto w-full">
        {/* Loading */}
        {isPending && (
          <div className="flex justify-center py-16">
            <ClipLoader color="#88ACE0" size={36} />
          </div>
        )}

        {/* No results */}
        {!isPending &&
          state.query &&
          state.books.length === 0 &&
          !state.error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted py-16"
            >
              Inga böcker hittades för "{state.query}"
            </motion.p>
          )}

        {/* Error */}
        {state.error && (
          <p className="text-center text-red-400 py-16">{state.error}</p>
        )}

        {/* Grid with staggered animation */}
        <AnimatePresence>
          {!isPending && state.books.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-muted text-sm mb-6">
                {state.books.length} resultat för "{state.query}"
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {state.books.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Recently reviewed books - only show when no search is active */}
        {!state.query && !isPending && recentBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-navy mb-6">
              Senast recenserade
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {recentBooks.map((book, index) => (
                <motion.div
                  key={book.bookId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/books/${book.bookId}`}>
                    <div className="group flex flex-col gap-3 cursor-pointer">
                      <div className="relative w-full aspect-2-3 rounded-lg overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        {book.bookCover ? (
                          <img
                            src={book.bookCover}
                            alt={book.bookTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-muted text-xs">
                              Ingen bild
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-navy text-sm line-clamp-2 leading-snug px-1">
                        {book.bookTitle}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
