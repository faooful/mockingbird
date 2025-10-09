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
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startRows = content.span.rows;
    const startCols = content.span.cols;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // Calculate new dimensions based on direction
      let newRows = startRows;
      let newCols = startCols;

      if (direction === "s" || direction === "se") {
        // Each row is 60px + 4px gap = 64px
        const maxAllowedRows = maxRows - content.position.row;
        newRows = Math.max(1, Math.min(maxAllowedRows, startRows + Math.round(deltaY / 64)));
      }

      if (direction === "e" || direction === "se") {
        // Each column is 80px + 4px gap = 84px
        const maxAllowedCols = maxCols - content.position.col;
        newCols = Math.max(1, Math.min(maxAllowedCols, startCols + Math.round(deltaX / 84)));
      }

      onResize(content.id, { rows: newRows, cols: newCols });
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
        className="absolute bottom-1 right-1 w-3 h-3 cursor-se-resize bg-blue-500 hover:bg-blue-600 transition-colors rounded-sm"
        onMouseDown={(e) => handleMouseDown(e, "se")}
      />
      
      {/* Bottom edge resizer */}
      <div
        className="absolute bottom-1 left-1 right-4 h-1 cursor-s-resize hover:bg-blue-400 transition-colors"
        onMouseDown={(e) => handleMouseDown(e, "s")}
      />
      
      {/* Right edge resizer */}
      <div
        className="absolute top-1 bottom-4 right-1 w-1 cursor-e-resize hover:bg-blue-400 transition-colors"
        onMouseDown={(e) => handleMouseDown(e, "e")}
      />
    </>
  );
}
