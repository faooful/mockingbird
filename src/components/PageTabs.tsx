"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Page {
  id: string;
  name: string;
}

interface PageTabsProps {
  pages: Page[];
  activePage: string;
  onPageChange: (pageId: string) => void;
  onPageAdd: () => void;
  onPageRename: (pageId: string, name: string) => void;
  onPageDelete: (pageId: string) => void;
  onClearAll: () => void;
  onPreview: () => void;
  contentCount: number;
  rows: number;
  cols: number;
  onRowsChange: (value: number) => void;
  onColsChange: (value: number) => void;
  device: "desktop" | "mobile";
  onDeviceChange: (device: "desktop" | "mobile") => void;
}

export default function PageTabs({ 
  pages, 
  activePage, 
  onPageChange, 
  onPageAdd,
  onPageRename,
  onPageDelete,
  onClearAll,
  onPreview,
  contentCount,
  rows,
  cols,
  onRowsChange,
  onColsChange,
  device,
  onDeviceChange
}: PageTabsProps) {
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [colsInput, setColsInput] = useState(cols.toString());
  const [rowsInput, setRowsInput] = useState(rows.toString());

  // Sync local input state with props
  useEffect(() => {
    setColsInput(cols.toString());
  }, [cols]);

  useEffect(() => {
    setRowsInput(rows.toString());
  }, [rows]);

  const handleDoubleClick = (page: Page) => {
    setEditingPage(page.id);
    setEditName(page.name);
  };

  const handleBlur = (pageId: string) => {
    if (editName.trim()) {
      onPageRename(pageId, editName.trim());
    }
    setEditingPage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, pageId: string) => {
    if (e.key === "Enter") {
      handleBlur(pageId);
    } else if (e.key === "Escape") {
      setEditingPage(null);
    }
  };

  return (
    <div className="flex items-center justify-between bg-neutral-100 border-b border-neutral-200 h-10">
      <div className="flex items-center h-full">
      {pages.map((page) => (
        <div
          key={page.id}
          onClick={() => onPageChange(page.id)}
          className={`
            group relative flex items-center gap-2 px-3 cursor-pointer transition-all min-w-[100px] max-w-[200px] border-r border-neutral-300
            ${activePage === page.id 
              ? "bg-[#F5F5F5] text-neutral-900 h-[calc(100%+1px)] -mb-[1px]" 
              : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300 h-full"
            }
          `}
        >
          {editingPage === page.id ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() => handleBlur(page.id)}
              onKeyDown={(e) => handleKeyDown(e, page.id)}
              className="text-xs bg-transparent border-none outline-none focus:outline-none w-20"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className="text-xs text-neutral-700 select-none"
              onDoubleClick={() => handleDoubleClick(page)}
            >
              {page.name}
            </span>
          )}
          
          {pages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPageDelete(page.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:bg-neutral-300 rounded p-0.5"
            >
              <svg className="w-3 h-3 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}
      
      {/* Add Page Button */}
      <button
        onClick={onPageAdd}
        className="flex items-center justify-center gap-1.5 px-3 h-full hover:bg-neutral-200 transition-colors border-r border-neutral-300"
        title="Add page"
      >
        <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-xs text-neutral-600">New</span>
      </button>
      </div>

      {/* Right side - Controls and Actions */}
      <div className="flex items-center gap-2 mr-2">
        {/* Device Toggle */}
        <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-300 rounded p-1">
          <button
            onClick={() => onDeviceChange("desktop")}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              device === "desktop" 
                ? "bg-white text-neutral-900 shadow-sm" 
                : "text-neutral-500 hover:text-neutral-700"
            }`}
            title="Desktop view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
              <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
              <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
            </svg>
          </button>
          <button
            onClick={() => onDeviceChange("mobile")}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              device === "mobile" 
                ? "bg-white text-neutral-900 shadow-sm" 
                : "text-neutral-500 hover:text-neutral-700"
            }`}
            title="Mobile view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2" />
              <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Grid Controls */}
        <div className="flex items-center gap-2 bg-neutral-100 rounded px-3 py-1.5">
          <input
            type="number"
            value={colsInput}
            onChange={(e) => {
              setColsInput(e.target.value);
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val > 0) {
                onColsChange(val);
              }
            }}
            onBlur={() => {
              // Reset to valid value if input is invalid
              const val = parseInt(colsInput);
              if (isNaN(val) || val <= 0) {
                setColsInput(cols.toString());
              }
            }}
            className="w-8 text-center text-sm bg-white rounded focus:outline-none focus:ring-1 focus:ring-neutral-300 px-1"
            min="1"
          />
          <span className="text-xs text-neutral-600">Columns</span>
        </div>

        <div className="flex items-center gap-2 bg-neutral-100 rounded px-3 py-1.5">
          <input
            type="number"
            value={rowsInput}
            onChange={(e) => {
              setRowsInput(e.target.value);
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val > 0) {
                onRowsChange(val);
              }
            }}
            onBlur={() => {
              // Reset to valid value if input is invalid
              const val = parseInt(rowsInput);
              if (isNaN(val) || val <= 0) {
                setRowsInput(rows.toString());
              }
            }}
            className="w-8 text-center text-sm bg-white rounded focus:outline-none focus:ring-1 focus:ring-neutral-300 px-1"
            min="1"
          />
          <span className="text-xs text-neutral-600">Rows</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          disabled={contentCount === 0}
          className="text-xs text-neutral-600 hover:text-neutral-900 h-7"
        >
          Clear
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          disabled={contentCount === 0}
          className="text-xs h-7"
        >
          Preview
        </Button>
      </div>
    </div>
  );
}

