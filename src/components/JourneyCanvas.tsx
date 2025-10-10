"use client";

import { useState, useRef, useCallback } from "react";
import { GridContent } from "./WireframeGrid";

interface Page {
  id: string;
  name: string;
  contents: GridContent[];
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

interface JourneyCanvasProps {
  pages: Page[];
  pageNodes: PageNode[];
  connections: Connection[];
  onPageNodesChange: (nodes: PageNode[]) => void;
  onConnectionsChange: (connections: Connection[]) => void;
  onPageSelect: (pageId: string) => void;
}

// Color palette for connections
const CONNECTION_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

export default function JourneyCanvas({ 
  pages, 
  pageNodes: initialPageNodes,
  connections: initialConnections,
  onPageNodesChange,
  onConnectionsChange,
  onPageSelect 
}: JourneyCanvasProps) {
  const [pageNodes, setPageNodes] = useState<PageNode[]>(initialPageNodes);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<{ pageId: string; componentId?: string } | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<{ pageId: string; componentId: string } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Helper to update page nodes
  const updatePageNodesState = (nodes: PageNode[] | ((prev: PageNode[]) => PageNode[])) => {
    const newNodes = typeof nodes === 'function' ? nodes(pageNodes) : nodes;
    setPageNodes(newNodes);
    onPageNodesChange(newNodes);
  };

  // Helper to update connections
  const updateConnectionsState = (conns: Connection[] | ((prev: Connection[]) => Connection[])) => {
    const newConns = typeof conns === 'function' ? conns(connections) : conns;
    setConnections(newConns);
    onConnectionsChange(newConns);
  };

  // Get color for a connection
  const getConnectionColor = (connection: Connection) => {
    const index = connections.findIndex(c => c.id === connection.id);
    return CONNECTION_COLORS[index % CONNECTION_COLORS.length];
  };

  const handleNodeMouseDown = (e: React.MouseEvent, pageId: string) => {
    e.stopPropagation();
    const node = pageNodes.find(n => n.pageId === pageId);
    if (!node) return;

    setDraggingNode(pageId);
    setDragOffset({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode) {
      updatePageNodesState(pageNodes.map(node => 
        node.pageId === draggingNode
          ? { ...node, position: { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } }
          : node
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleComponentClick = (pageId: string, componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (connectingFrom) {
      // Create connection
      if (connectingFrom.pageId !== pageId || connectingFrom.componentId !== componentId) {
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          fromPageId: connectingFrom.pageId,
          fromComponentId: connectingFrom.componentId,
          toPageId: pageId,
          toComponentId: componentId
        };
        updateConnectionsState([...connections, newConnection]);
      }
      setConnectingFrom(null);
    } else {
      // Start connecting
      setConnectingFrom({ pageId, componentId });
    }
  };

  const handlePageClick = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (connectingFrom && connectingFrom.componentId) {
      // Connect component to page
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        fromPageId: connectingFrom.pageId,
        fromComponentId: connectingFrom.componentId,
        toPageId: pageId
      };
      updateConnectionsState([...connections, newConnection]);
      setConnectingFrom(null);
    }
  };

  const handleCanvasClick = () => {
    setConnectingFrom(null);
  };

  const handleDeleteConnection = (connectionId: string) => {
    updateConnectionsState(connections.filter(c => c.id !== connectionId));
  };

  const getNodePosition = (pageId: string) => {
    return pageNodes.find(n => n.pageId === pageId)?.position || { x: 0, y: 0 };
  };

  const getPage = (pageId: string) => {
    return pages.find(p => p.id === pageId);
  };

  return (
    <div 
      ref={canvasRef}
      className="w-full h-full bg-neutral-50 relative overflow-auto"
      style={{
        backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {connections.map(connection => {
          const fromPos = getNodePosition(connection.fromPageId);
          const toPos = getNodePosition(connection.toPageId);
          const color = getConnectionColor(connection);
          const isSamePage = connection.fromPageId === connection.toPageId;
          
          // Offset for component positions within the node
          const fromY = fromPos.y + 60 + (connection.fromComponentId ? 40 : 0);
          const toY = toPos.y + 60;
          
          const fromX = fromPos.x + 150;
          const toX = toPos.x + 150;

          return (
            <g key={connection.id}>
              <path
                d={`M ${fromX} ${fromY} C ${fromX + 100} ${fromY}, ${toX - 100} ${toY}, ${toX} ${toY}`}
                stroke={color}
                strokeWidth="2"
                strokeDasharray={isSamePage ? "5,5" : "0"}
                fill="none"
                className="pointer-events-auto hover:opacity-50 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConnection(connection.id);
                }}
              />
              <circle
                cx={toX}
                cy={toY}
                r="4"
                fill={color}
                className="pointer-events-none"
              />
              {isSamePage && (
                <text
                  x={(fromX + toX) / 2}
                  y={(fromY + toY) / 2 - 10}
                  fill={color}
                  fontSize="10"
                  fontWeight="500"
                  className="pointer-events-none"
                  textAnchor="middle"
                >
                  UI
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Page nodes */}
      {pageNodes.map(node => {
        const page = getPage(node.pageId);
        if (!page) return null;

        return (
          <div
            key={node.pageId}
            className="absolute bg-white border-2 border-neutral-300 rounded-lg shadow-lg"
            style={{
              left: node.position.x,
              top: node.position.y,
              width: 300,
              zIndex: draggingNode === node.pageId ? 100 : 10,
              cursor: draggingNode === node.pageId ? 'grabbing' : 'grab'
            }}
          >
            {/* Header */}
            <div
              className="bg-neutral-100 px-4 py-3 border-b border-neutral-300 rounded-t-lg cursor-grab"
              onMouseDown={(e) => handleNodeMouseDown(e, node.pageId)}
              onClick={(e) => handlePageClick(node.pageId, e)}
            >
              <h3 className="font-semibold text-sm">{page.name}</h3>
              <p className="text-xs text-neutral-500">{page.contents.length} component(s)</p>
            </div>

            {/* Components list */}
            <div className="p-3 max-h-48 overflow-y-auto">
              {page.contents.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">No components</p>
              ) : (
                <div className="space-y-1">
                  {[...page.contents]
                    .sort((a, b) => {
                      if (a.position.row !== b.position.row) {
                        return a.position.row - b.position.row;
                      }
                      return a.position.col - b.position.col;
                    })
                    .map(component => {
                      const isConnecting = connectingFrom?.pageId === node.pageId && connectingFrom?.componentId === component.id;
                      const isHovered = hoveredComponent?.pageId === node.pageId && hoveredComponent?.componentId === component.id;
                      const connection = connections.find(c => 
                        (c.fromPageId === node.pageId && c.fromComponentId === component.id) ||
                        (c.toPageId === node.pageId && c.toComponentId === component.id)
                      );
                      const connectionColor = connection ? getConnectionColor(connection) : null;
                      
                      return (
                        <div
                          key={component.id}
                          className={`
                            flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer transition-colors
                            ${isConnecting ? 'bg-blue-100 border border-blue-300' : 'hover:bg-neutral-100'}
                            ${isHovered ? 'bg-neutral-100' : ''}
                          `}
                          style={connectionColor ? {
                            borderLeft: `3px solid ${connectionColor}`,
                            backgroundColor: `${connectionColor}10`
                          } : undefined}
                          onClick={(e) => handleComponentClick(node.pageId, component.id, e)}
                          onMouseEnter={() => setHoveredComponent({ pageId: node.pageId, componentId: component.id })}
                          onMouseLeave={() => setHoveredComponent(null)}
                        >
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: connectionColor || '#a3a3a3' }}
                          ></div>
                          <span className="capitalize flex-1">{component.type}</span>
                          <span className="text-neutral-400">
                            {component.span.cols}×{component.span.rows}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-3 py-2 border-t border-neutral-200 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPageSelect(node.pageId);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit Page →
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

