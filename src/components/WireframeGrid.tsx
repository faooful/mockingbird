"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card } from "@/components/ui/card";
import GridCell from "./GridCell";
import WireframeToolbar from "./WireframeToolbar";
import PropertiesPane from "./PropertiesPane";
import ComponentSidebar from "./ComponentSidebar";
import ExportModal from "./ExportModal";

export interface GridContent {
  id: string;
  type: "button" | "input" | "card" | "table" | "badge" | "avatar" | "tabs" | "accordion" | "alert" | "sidebar";
  span: {
    rows: number;
    cols: number;
  };
  position: {
    row: number;
    col: number;
  };
  properties?: Record<string, any>;
}

export default function WireframeGrid() {
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [contents, setContents] = useState<GridContent[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedContent, setSelectedContent] = useState<GridContent | null>(null);
  const [pendingComponentType, setPendingComponentType] = useState<GridContent["type"] | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const addRow = () => setRows(prev => prev + 1);
  const removeRow = () => setRows(prev => Math.max(1, prev - 1));
  const addCol = () => setCols(prev => prev + 1);
  const removeCol = () => setCols(prev => Math.max(1, prev - 1));

  const handleCellClick = (row: number, col: number) => {
    const content = getContentForCell(row, col);
    if (content) {
      setSelectedContent(content);
      setSelectedCell(null);
      setPendingComponentType(null);
    } else if (pendingComponentType) {
      // Add component directly if one is selected from sidebar
      handleAddContent(pendingComponentType, row, col);
      setPendingComponentType(null);
    } else {
      setSelectedCell({ row, col });
      setSelectedContent(null);
    }
  };

  const handleCellDrop = (row: number, col: number, data: string) => {
    // Check if cell is already occupied
    const existingContent = getContentForCell(row, col);
    if (existingContent) return;

    // Check if we're moving an existing component
    const movingContent = contents.find(c => c.id === data);
    
    if (movingContent) {
      // Moving existing component to new position
      setContents(contents.map(c => 
        c.id === data 
          ? { ...c, position: { row, col } }
          : c
      ));
    } else {
      // Adding new component from sidebar
      handleAddContent(data as GridContent["type"], row, col);
      setPendingComponentType(null);
    }
  };

  const handleComponentSelect = (type: GridContent["type"]) => {
    setPendingComponentType(type);
    setSelectedContent(null);
  };

  const handleAddContent = (type: GridContent["type"], row?: number, col?: number) => {
    const position = row !== undefined && col !== undefined ? { row, col } : selectedCell;
    if (!position) return;

    const newContent: GridContent = {
      id: `content-${Date.now()}`,
      type,
      span: { rows: 1, cols: 1 },
      position,
      properties: {},
    };

    setContents(prev => [...prev, newContent]);
    setSelectedCell(null);
  };

  const handleUpdateContent = (contentId: string, updates: Partial<GridContent>) => {
    setContents(prev => prev.map(content => 
      content.id === contentId 
        ? { ...content, ...updates }
        : content
    ));
    // Update selected content if it's the one being edited
    if (selectedContent?.id === contentId) {
      setSelectedContent(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleResizeContent = (contentId: string, newSpan: { rows: number; cols: number }) => {
    setContents(prev => prev.map(content => {
      if (content.id !== contentId) return content;
      
      // Ensure the new span doesn't exceed grid boundaries
      const maxRows = rows - content.position.row;
      const maxCols = cols - content.position.col;
      
      const constrainedSpan = {
        rows: Math.max(1, Math.min(newSpan.rows, maxRows)),
        cols: Math.max(1, Math.min(newSpan.cols, maxCols))
      };
      
      return { ...content, span: constrainedSpan };
    }));
  };

  const handleDeleteContent = (contentId: string) => {
    setContents(prev => prev.filter(content => content.id !== contentId));
  };

  const handleClearAll = () => {
    setContents([]);
  };

  const handleExport = () => {
    setExportModalOpen(true);
  };

  const getContentForCell = (row: number, col: number) => {
    return contents.find(content => 
      row >= content.position.row && 
      row < content.position.row + content.span.rows &&
      col >= content.position.col && 
      col < content.position.col + content.span.cols
    );
  };

  const isCellOccupied = (row: number, col: number) => {
    return contents.some(content => 
      row >= content.position.row && 
      row < content.position.row + content.span.rows &&
      col >= content.position.col && 
      col < content.position.col + content.span.cols
    );
  };

  const isCellMainContent = (row: number, col: number) => {
    return contents.some(content => 
      content.position.row === row && 
      content.position.col === col
    );
  };

  return (
    <div className="flex h-full w-full">
      {/* Component Sidebar */}
      <ComponentSidebar onSelectComponent={handleComponentSelect} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <WireframeToolbar
          rows={rows}
          cols={cols}
          contentCount={contents.length}
          onAddRow={addRow}
          onRemoveRow={removeRow}
          onAddCol={addCol}
          onRemoveCol={removeCol}
          onClearAll={handleClearAll}
          onExport={handleExport}
        />

        {/* Grid Container */}
        <div className="flex-1 bg-[#F5F5F5] p-12 overflow-auto">
          {pendingComponentType && (
            <div className="mb-4 p-3 bg-neutral-100 border border-neutral-300 rounded text-sm text-neutral-700 max-w-fit">
              <strong className="capitalize">{pendingComponentType}</strong> selected. Click or drag to an empty cell to place it.
            </div>
          )}
          <div 
            className="w-full h-full"
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${rows}, minmax(100px, 1fr))`,
              gridTemplateColumns: `repeat(${cols}, minmax(120px, 1fr))`,
              gap: '8px'
            }}
          >
            {/* Render all cells in the grid */}
            {Array.from({ length: rows * cols }, (_, index) => {
              const rowIndex = Math.floor(index / cols);
              const colIndex = index % cols;
              const content = getContentForCell(rowIndex, colIndex);
              const isOccupied = isCellOccupied(rowIndex, colIndex);
              const isMainContent = isCellMainContent(rowIndex, colIndex);
              
              return (
                <GridCell
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  content={isMainContent ? content : undefined}
                  isOccupied={isOccupied && !isMainContent}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onDrop={handleCellDrop}
                  isSelected={selectedContent?.id === content?.id}
                  onResize={handleResizeContent}
                  onDelete={handleDeleteContent}
                  maxRows={rows}
                  maxCols={cols}
                  contentSpan={content?.span}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        contents={contents}
        rows={rows}
        cols={cols}
      />
    </div>
  );
}
