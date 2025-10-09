"use client";

import { GridContent } from "./WireframeGrid";
import { cn } from "@/lib/utils";
import ContentResizer from "./ContentResizer";
import ShadcnComponent from "./ShadcnComponent";

interface GridCellProps {
  row: number;
  col: number;
  content?: GridContent;
  isOccupied: boolean;
  isSelected: boolean;
  onClick: () => void;
  onResize?: (contentId: string, newSpan: { rows: number; cols: number }) => void;
  onDelete?: (contentId: string) => void;
  maxRows?: number;
  maxCols?: number;
  contentSpan?: { rows: number; cols: number };
}

export default function GridCell({ 
  content, 
  isOccupied, 
  isSelected, 
  onClick,
  onResize,
  onDelete,
  maxRows = 8,
  maxCols = 8,
  contentSpan
}: GridCellProps) {
  const getContentDisplay = () => {
    if (!content) return null;

    const baseContent = <ShadcnComponent content={content} span={contentSpan || { rows: 1, cols: 1 }} />;

    if (!onResize) return baseContent;

    return (
      <div className="relative w-full h-full group">
        {baseContent}
        <ContentResizer 
          content={content} 
          maxRows={maxRows} 
          maxCols={maxCols} 
          onResize={onResize} 
        />
        {/* Delete button */}
        <button
          className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(content.id);
          }}
          title="Delete content"
        >
          ×
        </button>
        {/* Span indicator */}
        {contentSpan && (contentSpan.rows > 1 || contentSpan.cols > 1) && (
          <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded opacity-75">
            {contentSpan.cols}×{contentSpan.rows}
          </div>
        )}
      </div>
    );
  };

  // Hide this cell if it's part of a span but not the main content cell
  if (isOccupied && !content) {
    return null; // Don't render occupied cells - CSS Grid will handle the spanning
  }

  return (
    <div
      className={cn(
        "border border-gray-300 rounded cursor-pointer transition-all duration-200",
        "hover:border-gray-400 hover:bg-gray-50",
        isSelected && "border-blue-500 bg-blue-50 ring-2 ring-blue-200",
        content && "border-2 border-blue-400 bg-white"
      )}
      onClick={onClick}
      style={{
        gridRow: content && contentSpan ? `span ${contentSpan.rows}` : undefined,
        gridColumn: content && contentSpan ? `span ${contentSpan.cols}` : undefined,
      }}
    >
      {content ? (
        getContentDisplay()
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          Click to add
        </div>
      )}
    </div>
  );
}
