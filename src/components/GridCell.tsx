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
  const [isDragging, setIsDragging] = useState(false);

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
    setIsDragging(true);
    e.dataTransfer.setData("movingContentId", content.id);
    e.dataTransfer.effectAllowed = "move";
    
    // Create a compact drag preview matching the component size
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const dragImage = target.cloneNode(true) as HTMLElement;
    dragImage.style.width = `${Math.min(rect.width, 200)}px`;
    dragImage.style.height = `${Math.min(rect.height, 200)}px`;
    dragImage.style.position = 'fixed';
    dragImage.style.top = '-1000px';
    dragImage.style.opacity = '0.9';
    dragImage.style.transform = 'rotate(3deg)';
    dragImage.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, Math.min(rect.width, 200) / 2, Math.min(rect.height, 200) / 2);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
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
        onDragEnd={handleDragEnd}
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

  const isLastRow = row === maxRows - 1;
  const isLastCol = col === maxCols - 1;

  return (
    <div
      className={cn(
        "relative cursor-default transition-all duration-200 group/cell bg-white overflow-hidden",
        // Right border (not on last column)
        !isLastCol && "border-r border-gray-200/20",
        // Bottom border (not on last row)
        !isLastRow && "border-b border-gray-200/20",
        // Empty cell styling
        !content && "border-dashed",
        !content && "hover:border-gray-300/30 hover:bg-gray-50/30",
        // Selected state
        isSelected && "!border-solid !border-gray-300 ring-1 ring-gray-200/30",
        // Cell with content
        content && !isDragging && "!border-solid !border-gray-200/25 shadow-md",
        // Dragging state
        isDragging && "opacity-50 scale-95 !border-dashed !border-blue-400",
        // Drag over state
        isDragOver && !content && "!border-solid !border-blue-500 !bg-blue-50 z-10"
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
      {/* Corner highlights */}
      <div className={cn("absolute top-0.5 left-0.5 w-2 h-2 border-t border-l pointer-events-none", isDragOver ? "border-blue-500" : "border-gray-300/50")}></div>
      <div className={cn("absolute top-0.5 right-0.5 w-2 h-2 border-t border-r pointer-events-none", isDragOver ? "border-blue-500" : "border-gray-300/50")}></div>
      <div className={cn("absolute bottom-0.5 left-0.5 w-2 h-2 border-b border-l pointer-events-none", isDragOver ? "border-blue-500" : "border-gray-300/50")}></div>
      <div className={cn("absolute bottom-0.5 right-0.5 w-2 h-2 border-b border-r pointer-events-none", isDragOver ? "border-blue-500" : "border-gray-300/50")}></div>
      
      {content ? (
        getContentDisplay()
      ) : (
        <div className="w-full h-full"></div>
      )}
    </div>
  );
}
