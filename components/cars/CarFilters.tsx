"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";

const models = [
  "All",
  "Model S",
  "Model 3",
  "Model X",
  "Model Y",
  "Cybertruck",
];
const statuses = ["New", "Pre-Owned", "Demo Vehicle"];

export default function CarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [localZipCode, setLocalZipCode] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  useEffect(() => {
    const zip = searchParams.get("zip") || "";
    const statusParams = searchParams.getAll("status");
    setLocalZipCode(zip);
    setSelectedStatuses(statusParams.length > 0 ? statusParams : ["New"]);
  }, [searchParams]);

  const currentModel = searchParams.get("model") || "All";
  const searchQuery = searchParams.get("search") || "";

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "All") params.delete(key);
    else params.set(key, value);
    router.push(`/cars?${params.toString()}`, { scroll: false });
  };

  const toggleStatus = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(newStatuses);
    params.delete("status");
    newStatuses.forEach((s) => params.append("status", s));
    router.push(`/cars?${params.toString()}`, { scroll: false });
  };

  const handleZipCodeUpdate = (zip: string) => {
    const params = new URLSearchParams(searchParams.toString());
    zip.trim() ? params.set("zip", zip) : params.delete("zip");
    router.push(`/cars?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value.trim() ? params.set("search", value) : params.delete("search");
    router.push(`/cars?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push("/cars", { scroll: false });
    setSelectedStatuses(["New"]);
    setLocalZipCode("");
  };

  const hasActiveFilters =
    currentModel !== "All" ||
    selectedStatuses.length !== 1 ||
    selectedStatuses[0] !== "New" ||
    localZipCode.trim() !== "" ||
    searchQuery.trim() !== "";

  return (
    <div className="mb-12 space-y-6 animate-tesla-reveal max-w-full">
      {/* 1. Optimized Header Navigation - Fixed Overlapping for small screens */}
      <div className="flex justify-center md:justify-start">
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/10 overflow-x-auto no-scrollbar max-w-full">
          {models.map((m) => (
            <button
              key={m}
              onClick={() => updateParams("model", m)}
              className={`px-4 md:px-6 py-2 text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-bold rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                currentModel === m
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                  : "text-gray-400 hover:text-black dark:hover:text-white"
              }`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Search & Filter Trigger - Refined Grid */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative group flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
          <input
            type="text"
            placeholder="Search specifications, VIN..."
            defaultValue={searchQuery}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleSearch((e.target as HTMLInputElement).value)
            }
            onBlur={(e) => handleSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all"
          />
        </div>

        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center justify-between gap-4 px-6 py-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-all min-w-[200px]">
          <div className="flex items-center gap-3 truncate">
            <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="truncate">{localZipCode || "Enter zip"}</span>
          </div>
          <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>

      {/* 3. Active Filters Display - Improved spacing */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {currentModel !== "All" && (
            <Tag
              label={currentModel}
              onRemove={() => updateParams("model", "All")}
            />
          )}
          {selectedStatuses.map((status) => (
            <Tag
              key={status}
              label={status}
              onRemove={() => toggleStatus(status)}
            />
          ))}
          {localZipCode && (
            <Tag
              label={`Zip: ${localZipCode}`}
              variant="red"
              onRemove={() => {
                setLocalZipCode("");
                handleZipCodeUpdate("");
              }}
            />
          )}
          <button
            onClick={resetFilters}
            className="text-[10px] uppercase font-bold text-gray-400 hover:text-red-600 transition-colors tracking-widest pl-2">
            Reset All
          </button>
        </div>
      )}

      {/* Mobile Sidebar - Same Logic, improved z-index and width handling */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative w-full max-w-[380px] h-full bg-white dark:bg-[#0a0a0a] p-8 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-tesla uppercase tracking-tighter dark:text-white">
                Filters
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 dark:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-10 flex-grow">
              <FilterSection title="Condition">
                {statuses.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-3 cursor-pointer group py-1">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => toggleStatus(status)}
                      className="w-5 h-5 rounded border-gray-300 dark:bg-white/5 dark:border-white/10 checked:bg-red-600"
                    />
                    <span className="text-sm dark:text-gray-300">{status}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Location">
                <div className="relative mt-4">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={localZipCode}
                    onChange={(e) => setLocalZipCode(e.target.value)}
                    onBlur={() => handleZipCodeUpdate(localZipCode)}
                    className="w-full px-4 py-4 pl-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm"
                  />
                </div>
              </FilterSection>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest">
              Apply Filter
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// Sub-components for cleaner structure and fixed spacing
function Tag({
  label,
  onRemove,
  variant = "default",
}: {
  label: string;
  onRemove: () => void;
  variant?: "default" | "red";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-tight ${
        variant === "red"
          ? "bg-red-600/10 text-red-600"
          : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300"
      }`}>
      {label}
      <button
        onClick={onRemove}
        className="hover:text-red-600 transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] mb-4">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
