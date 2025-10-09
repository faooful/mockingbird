"use client";

import { useRef } from "react";
import { GridContent } from "./WireframeGrid";

interface ContentResizerProps {
  content: GridContent;
  maxRows: number;
  maxCols: number;
  onResize: (contentId: string, newSpan: { rows: number; cols: number }) => void;
}

export default function ContentResizer({ content, maxRows, maxCols, onResize }: ContentResizerProps) {
  const resizerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, direction: "se" | "e" | "s") => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startRows = content.span.rows;
    const startCols = content.span.cols;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // Use a simpler calculation - assume minimum cell size
      const minCellSize = 100; // minimum cell size in pixels
      const gap = 8;
      
      // Calculate new dimensions based on direction
      let newRows = startRows;
      let newCols = startCols;

      if (direction === "s" || direction === "se") {
        const maxAllowedRows = maxRows - content.position.row;
        const rowChange = Math.round(deltaY / (minCellSize + gap));
        newRows = Math.max(1, Math.min(maxAllowedRows, startRows + rowChange));
      }

      if (direction === "e" || direction === "se") {
        const maxAllowedCols = maxCols - content.position.col;
        const colChange = Math.round(deltaX / (minCellSize + gap));
        newCols = Math.max(1, Math.min(maxAllowedCols, startCols + colChange));
      }

      // Only update if dimensions actually changed
      if (newRows !== startRows || newCols !== startCols) {
        onResize(content.id, { rows: newRows, cols: newCols });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      {/* Corner resizer */}
      <div
        ref={resizerRef}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-neutral-400 hover:bg-neutral-600 transition-colors z-50 opacity-0 group-hover:opacity-100"
        onMouseDown={(e) => handleMouseDown(e, "se")}
        title="Drag to resize"
      />
      
      {/* Bottom edge resizer */}
      <div
        className="absolute bottom-0 left-0 right-4 h-2 cursor-s-resize hover:bg-neutral-300 transition-colors z-50 opacity-0 hover:opacity-50"
        onMouseDown={(e) => handleMouseDown(e, "s")}
      />
      
      {/* Right edge resizer */}
      <div
        className="absolute top-0 bottom-4 right-0 w-2 cursor-e-resize hover:bg-neutral-300 transition-colors z-50 opacity-0 hover:opacity-50"
        onMouseDown={(e) => handleMouseDown(e, "e")}
      />
    </>
  );
}
