"use client";

import { useActionState, useState } from "react";
import { Search } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "motion/react";
import { searchAction } from "@/app/actions/search";
import BookCard from "@/app/components/BookCard";

const initialState = { books: [], query: "" };

export default function HomePage() {
  const [state, formAction, isPending] = useActionState(
    searchAction,
    initialState,
  );
  const [searchValue, setSearchValue] = useState("");

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

        {/* Animated searchfield */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          action={formAction}
          onSubmit={() => setSearchValue("")}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xl"
        >
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              name="query"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Titel, författare eller ISBN..."
              className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue shadow-sm"
            />
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
      </section>
    </div>
  );
}
