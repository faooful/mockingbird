"use client";

import { useState } from "react";
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
  onDrop?: (row: number, col: number, componentType: string) => void;
  onResize?: (contentId: string, newSpan: { rows: number; cols: number }) => void;
  onDelete?: (contentId: string) => void;
  maxRows?: number;
  maxCols?: number;
  contentSpan?: { rows: number; cols: number };
}

export default function GridCell({ 
  row,
  col,
  content, 
  isOccupied, 
  isSelected, 
  onClick,
  onDrop,
  onResize,
  onDelete,
  maxRows = 8,
  maxCols = 8,
  contentSpan
}: GridCellProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!content) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const componentType = e.dataTransfer.getData("componentType");
    const movingContentId = e.dataTransfer.getData("movingContentId");
    
    if (componentType && !content && onDrop) {
      // Adding new component from sidebar
      onDrop(row, col, componentType);
    } else if (movingContentId && !content && onDrop) {
      // Moving existing component
      onDrop(row, col, movingContentId);
    }
  };
  const handleDragStart = (e: React.DragEvent) => {
    if (!content) return;
    e.stopPropagation();
    e.dataTransfer.setData("movingContentId", content.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const getContentDisplay = () => {
    if (!content) return null;

    const baseContent = <ShadcnComponent content={content} span={contentSpan || { rows: 1, cols: 1 }} />;

    if (!onResize) return baseContent;

    return (
      <div 
        className="relative w-full h-full group"
        draggable
        onDragStart={handleDragStart}
      >
        <div className="absolute inset-0 overflow-hidden cursor-move">
          {baseContent}
        </div>
        <ContentResizer 
          content={content} 
          maxRows={maxRows} 
          maxCols={maxCols} 
          onResize={onResize} 
        />
        {/* Delete button */}
        <button
          className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20"
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
          <div className="absolute top-1 left-1 bg-neutral-600 text-white text-xs px-1 py-0.5 rounded opacity-75 z-10">
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
        "border border-neutral-200 rounded cursor-pointer transition-all duration-200 bg-white overflow-hidden",
        "hover:border-neutral-300 hover:shadow-sm",
        isSelected && "border-neutral-400 ring-2 ring-neutral-300",
        content && "bg-white shadow-sm border-neutral-300",
        isDragOver && !content && "border-neutral-400 bg-neutral-50 ring-2 ring-neutral-300"
      )}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        gridRow: content && contentSpan ? `span ${contentSpan.rows}` : undefined,
        gridColumn: content && contentSpan ? `span ${contentSpan.cols}` : undefined,
        minWidth: 0,
        minHeight: 0
      }}
    >
      {content ? (
        getContentDisplay()
      ) : (
        <div className="w-full h-full flex items-center justify-center text-neutral-300 text-2xl font-light">
          +
        </div>
      )}
    </div>
  );
}
