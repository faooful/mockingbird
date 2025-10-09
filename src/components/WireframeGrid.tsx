"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GridCell from "./GridCell";
import ContentSelector from "./ContentSelector";
import WireframeToolbar from "./WireframeToolbar";
import PropertiesPane from "./PropertiesPane";

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

  const addRow = () => setRows(prev => prev + 1);
  const removeRow = () => setRows(prev => Math.max(1, prev - 1));
  const addCol = () => setCols(prev => prev + 1);
  const removeCol = () => setCols(prev => Math.max(1, prev - 1));

  const handleCellClick = (row: number, col: number) => {
    const content = getContentForCell(row, col);
    if (content) {
      setSelectedContent(content);
      setSelectedCell(null);
    } else {
      setSelectedCell({ row, col });
      setSelectedContent(null);
    }
  };

  const handleAddContent = (type: GridContent["type"]) => {
    if (!selectedCell) return;

    const newContent: GridContent = {
      id: `content-${Date.now()}`,
      type,
      span: { rows: 1, cols: 1 },
      position: selectedCell,
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
    const exportData = {
      grid: { rows, cols },
      contents: contents.map(content => ({
        ...content,
        position: { ...content.position },
        span: { ...content.span }
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wireframe.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <div className="flex h-full">
      <div className="flex-1 space-y-6">
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

        {/* Grid */}
        <Card className="p-4">
          <div 
            className="mx-auto border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${rows}, 60px)`,
              gridTemplateColumns: `repeat(${cols}, 80px)`,
              gap: '4px',
              width: 'fit-content'
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
        </Card>

        {/* Content Selector Dialog */}
        <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Content to Cell ({selectedCell?.row}, {selectedCell?.col})</DialogTitle>
            </DialogHeader>
            <ContentSelector onSelect={handleAddContent} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Properties Pane */}
      <PropertiesPane
        selectedContent={selectedContent}
        onUpdateContent={handleUpdateContent}
        onClose={() => setSelectedContent(null)}
      />
    </div>
  );
}
