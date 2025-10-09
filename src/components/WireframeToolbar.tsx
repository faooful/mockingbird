"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WireframeToolbarProps {
  rows: number;
  cols: number;
  contentCount: number;
  onAddRow: () => void;
  onRemoveRow: () => void;
  onAddCol: () => void;
  onRemoveCol: () => void;
  onClearAll: () => void;
  onExport: () => void;
}

export default function WireframeToolbar({
  rows,
  cols,
  contentCount,
  onAddRow,
  onRemoveRow,
  onAddCol,
  onRemoveCol,
  onClearAll,
  onExport
}: WireframeToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200">
      {/* Left side - Grid Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-300 rounded px-3 py-1.5">
          <input
            type="number"
            value={cols}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val > cols) onAddCol();
              else if (val < cols) onRemoveCol();
            }}
            className="w-8 text-center text-sm bg-transparent border-none focus:outline-none"
            min="1"
          />
          <span className="text-xs text-neutral-600">Columns</span>
        </div>

        <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-300 rounded px-3 py-1.5">
          <input
            type="number"
            value={rows}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val > rows) onAddRow();
              else if (val < rows) onRemoveRow();
            }}
            className="w-8 text-center text-sm bg-transparent border-none focus:outline-none"
            min="1"
          />
          <span className="text-xs text-neutral-600">Rows</span>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          disabled={contentCount === 0}
          className="text-xs text-neutral-600 hover:text-neutral-900"
        >
          Clear
        </Button>
        <Button
          variant="outline"
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
