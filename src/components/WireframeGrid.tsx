"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card } from "@/components/ui/card";
import GridCell from "./GridCell";
import WireframeToolbar from "./WireframeToolbar";
import PropertiesPane from "./PropertiesPane";
import ComponentSidebar from "./ComponentSidebar";
import ExportModal from "./ExportModal";
import PreviewModal from "./PreviewModal";
import PageTabs from "./PageTabs";
import JourneyCanvas from "./JourneyCanvas";

export interface GridContent {
  id: string;
  type: "button" | "input" | "card" | "table" | "badge" | "avatar" | "tabs" | "accordion" | "alert" | "sidebar" | "select" | "checkbox" | "radio" | "switch" | "slider" | "textarea" | "calendar" | "datepicker" | "dropdown" | "popover" | "tooltip" | "progress" | "separator" | "skeleton" | "barchart" | "linechart" | "areachart" | "piechart";
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

interface PageNode {
  pageId: string;
  position: { x: number; y: number };
}

interface Connection {
  id: string;
  fromPageId: string;
  fromComponentId?: string;
  toPageId: string;
  toComponentId?: string;
}

interface Page {
  id: string;
  name: string;
  contents: GridContent[];
}

export default function WireframeGrid() {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [mode, setMode] = useState<"pages" | "journeys">("pages");
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [pages, setPages] = useState<Page[]>([
    { id: "page-1", name: "Page 1", contents: [] }
  ]);
  const [activePage, setActivePage] = useState("page-1");
  const [pageNodes, setPageNodes] = useState<PageNode[]>([
    { pageId: "page-1", position: { x: 100, y: 100 } }
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedContent, setSelectedContent] = useState<GridContent | null>(null);
  const [pendingComponentType, setPendingComponentType] = useState<GridContent["type"] | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Get current page contents
  const currentPage = pages.find(p => p.id === activePage);
  const contents = currentPage?.contents || [];

  // Helper to update current page contents
  const setContents = (newContents: GridContent[] | ((prev: GridContent[]) => GridContent[])) => {
    setPages(pages.map(page => 
      page.id === activePage 
        ? { ...page, contents: typeof newContents === 'function' ? newContents(page.contents) : newContents }
        : page
    ));
  };

  const handlePageAdd = () => {
    const newPageNum = pages.length + 1;
    const newPageId = `page-${Date.now()}`;
    const newPage: Page = {
      id: newPageId,
      name: `Page ${newPageNum}`,
      contents: []
    };
    setPages([...pages, newPage]);
    setActivePage(newPageId);
    
    // Add node for journey canvas
    setPageNodes([...pageNodes, {
      pageId: newPageId,
      position: { x: 100 + (pages.length * 300), y: 100 }
    }]);
  };

  const handlePageRename = (pageId: string, name: string) => {
    setPages(pages.map(page => 
      page.id === pageId ? { ...page, name } : page
    ));
  };

  const handlePageDelete = (pageId: string) => {
    if (pages.length === 1) return; // Don't delete last page
    
    const pageIndex = pages.findIndex(p => p.id === pageId);
    const newPages = pages.filter(p => p.id !== pageId);
    setPages(newPages);
    
    // Remove from journey nodes
    setPageNodes(pageNodes.filter(n => n.pageId !== pageId));
    
    // Remove connections involving this page
    setConnections(connections.filter(c => 
      c.fromPageId !== pageId && c.toPageId !== pageId
    ));
    
    // Switch to adjacent page if deleting active page
    if (pageId === activePage) {
      const newActivePage = newPages[Math.max(0, pageIndex - 1)].id;
      setActivePage(newActivePage);
    }
  };

  const handleDeviceChange = (newDevice: "desktop" | "mobile") => {
    setDevice(newDevice);
    // Adjust default grid size based on device
    if (newDevice === "mobile") {
      setCols(4);
      setRows(12);
    } else {
      setCols(8);
      setRows(8);
    }
  };

  const addRow = () => setRows(prev => prev + 1);
  const removeRow = () => setRows(prev => Math.max(1, prev - 1));
  const addCol = () => setCols(prev => prev + 1);
  const removeCol = () => setCols(prev => Math.max(1, prev - 1));
  const setRowsDirectly = (value: number) => setRows(Math.max(1, value));
  const setColsDirectly = (value: number) => setCols(Math.max(1, value));

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

  const handlePreview = () => {
    setPreviewModalOpen(true);
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
      <ComponentSidebar 
        onSelectComponent={handleComponentSelect}
        selectedContent={selectedContent}
        onUpdateContent={handleUpdateContent}
        onDeselectComponent={() => setSelectedContent(null)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <WireframeToolbar
          contentCount={contents.length}
          onExport={handleExport}
          mode={mode}
          onModeChange={setMode}
        />

        {/* Page Tabs (only in pages mode) */}
        {mode === "pages" && (
          <PageTabs
            pages={pages}
            activePage={activePage}
            onPageChange={setActivePage}
            onPageAdd={handlePageAdd}
            onPageRename={handlePageRename}
            onPageDelete={handlePageDelete}
            onClearAll={handleClearAll}
            onPreview={handlePreview}
            contentCount={contents.length}
            rows={rows}
            cols={cols}
            onRowsChange={setRowsDirectly}
            onColsChange={setColsDirectly}
            device={device}
            onDeviceChange={handleDeviceChange}
          />
        )}

        {/* Journey Canvas (only in journeys mode) */}
        {mode === "journeys" ? (
          <div className="flex-1 overflow-hidden">
            <JourneyCanvas 
              pages={pages}
              pageNodes={pageNodes}
              connections={connections}
              onPageNodesChange={setPageNodes}
              onConnectionsChange={setConnections}
              onPageSelect={(pageId) => {
                setActivePage(pageId);
                setMode("pages");
              }}
            />
          </div>
        ) : (
          /* Grid Container */
          <div className="flex-1 bg-[#F5F5F5] p-8 overflow-hidden flex flex-col">
            {pendingComponentType && (
              <div className="mb-4 p-3 bg-neutral-100 border border-neutral-300 rounded text-sm text-neutral-700 max-w-fit">
                <strong className="capitalize">{pendingComponentType}</strong> selected. Click or drag to an empty cell to place it.
              </div>
            )}
            <div className={`flex-1 flex items-center justify-center ${device === "mobile" ? "max-w-md mx-auto" : ""}`}>
              <div 
                className="w-full h-full"
                style={{
                  display: 'grid',
                  gridTemplateRows: `repeat(${rows}, 1fr)`,
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: '8px',
                  maxHeight: '100%',
                  maxWidth: device === "mobile" ? '100%' : '100%'
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
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        contents={contents}
        rows={rows}
        cols={cols}
        pages={pages}
        connections={connections}
      />

      {/* Preview Modal */}
      <PreviewModal
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        contents={contents}
        rows={rows}
        cols={cols}
      />
    </div>
  );
}
