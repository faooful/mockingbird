"use client";

import { Button } from "@/components/ui/button";

interface WireframeToolbarProps {
  contentCount: number;
  onExport: () => void;
  mode: "pages" | "journeys";
  onModeChange: (mode: "pages" | "journeys") => void;
}

export default function WireframeToolbar({
  contentCount,
  onExport,
  mode,
  onModeChange
}: WireframeToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200">
      {/* Spacer for layout */}
      <div className="flex-1"></div>

      {/* Center - Mode Toggle */}
      <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-300 rounded p-1">
        <button
          onClick={() => onModeChange("pages")}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            mode === "pages" 
              ? "bg-white text-neutral-900 shadow-sm font-medium" 
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Pages
        </button>
        <button
          onClick={() => onModeChange("journeys")}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            mode === "journeys" 
              ? "bg-white text-neutral-900 shadow-sm font-medium" 
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Journeys
        </button>
      </div>

      {/* Right side - Export button */}
      <div className="flex-1 flex justify-end">
        <Button
          variant="default"
          size="sm"
          onClick={onExport}
          disabled={contentCount === 0}
          className="text-xs"
        >
          Export
        </Button>
      </div>
    </div>
  );
}
