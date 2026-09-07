"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useStockSearch } from "@/hooks/use-stocks";

export function StockSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(query.trim());
  const { data: results = [], isFetching } = useStockSearch(debouncedQuery);
  const isOpen = debouncedQuery.length >= 2;

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setQuery("");
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function select(symbol: string) {
    setQuery("");
    router.push(`/stocks/${encodeURIComponent(symbol)}`);
  }

  return (
    <div className="relative w-full max-w-xl" ref={rootRef}>
      <Input
        id="stock-search"
        label="Search stocks"
        placeholder="Search by company or symbol"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(-1);
        }}
        onKeyDown={(event) => {
          if (!results.length) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, results.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
          } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            select(results[activeIndex].symbol);
          } else if (event.key === "Escape") {
            setQuery("");
          }
        }}
        icon={<Search className="h-4 w-4" />}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="stock-search-results"
        aria-autocomplete="list"
      />
      {isOpen && (
        <div id="stock-search-results" role="listbox" className="absolute z-30 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-border-primary bg-bg-elevated p-1 shadow-xl">
          {isFetching && <p className="px-3 py-3 text-sm text-text-secondary">Searching…</p>}
          {!isFetching && !results.length && <p className="px-3 py-3 text-sm text-text-secondary">No stocks found.</p>}
          {!isFetching && results.map((stock, index) => (
            <button
              key={stock.symbol}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(stock.symbol)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left ${activeIndex === index ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"}`}
            >
              <span><strong className="text-sm text-text-primary">{stock.symbol}</strong><span className="ml-2 text-xs text-text-secondary">{stock.name}</span></span>
              <span className="text-xs text-text-tertiary">{stock.exchange}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
