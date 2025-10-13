"use client";

import { useState, useRef, useEffect } from "react";
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
  isVisible: boolean;
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
  onPageSelect,
  isVisible
}: JourneyCanvasProps) {
  const [pageNodes, setPageNodes] = useState<PageNode[]>(initialPageNodes);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<{ pageId: string; componentId?: string } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync with parent pageNodes changes
  useEffect(() => {
    setPageNodes(initialPageNodes);
  }, [initialPageNodes]);

  // Sync with parent connections changes
  useEffect(() => {
    setConnections(initialConnections);
  }, [initialConnections]);

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
      // When connecting from a component, ignore clicks on other components
      // User should click on a page header instead
      return;
    } else {
      // Start connecting from this component
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

  // Helper to get display text for a component
  const getComponentDisplayText = (component: GridContent) => {
    const props = component.properties || {};
    
    switch (component.type) {
      case "button":
        return props.text || "Click me";
      case "input":
        return props.placeholder || "Enter text...";
      case "textarea":
        return props.placeholder || "Enter text...";
      case "select":
        return props.label || "Select option";
      case "checkbox":
        return props.label || "Checkbox";
      case "radio":
        return props.label || "Radio option";
      case "switch":
        return props.label || "Toggle";
      case "slider":
        return props.label || "Slider";
      case "card":
        return props.title || "Card";
      case "badge":
        return props.text || "Badge";
      case "alert":
        return props.title || "Alert";
      default:
        return component.type;
    }
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
      <svg 
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${
          isVisible ? "opacity-100 delay-300" : "opacity-0"
        }`} 
        style={{ zIndex: 15 }}
      >
        {connections.map(connection => {
          const fromPos = getNodePosition(connection.fromPageId);
          const toPos = getNodePosition(connection.toPageId);
          const color = getConnectionColor(connection);
          
          // Calculate component position within the page node
          const fromPage = getPage(connection.fromPageId);
          
          const pageTagHeight = 28; // py-1.5 = 6px + 6px + text height ~16px
          const headerHeight = 24; // pt-4 pb-2 = 16px + 8px (invisible header)
          const componentsPaddingTop = 0; // No top padding on px-4 pb-3
          const componentPaddingHorizontal = 16; // px-4 on the components list container
          const componentHeight = 56; // Estimated full height of each component card (py-2 + content)
          const componentGap = 6; // space-y-1.5
          
          let fromY = fromPos.y + pageTagHeight + headerHeight; // Start of components list
          const fromX = fromPos.x + 340 - componentPaddingHorizontal; // Right edge of component cards (not the page card)
          
          // If connecting from a specific component, calculate its position
          if (connection.fromComponentId && fromPage) {
            const sortedComponents = [...fromPage.contents].sort((a, b) => {
              if (a.position.row !== b.position.row) {
                return a.position.row - b.position.row;
              }
              return a.position.col - b.position.col;
            });
            const componentIndex = sortedComponents.findIndex(c => c.id === connection.fromComponentId);
            
            if (componentIndex !== -1) {
              // Position at center of the specific component
              fromY = fromPos.y + pageTagHeight + headerHeight + componentsPaddingTop + (componentIndex * (componentHeight + componentGap)) + (componentHeight / 2);
            }
          }
          
          // Target is always the page header (center)
          const toY = toPos.y + pageTagHeight + (headerHeight / 2); // Center of invisible header
          const toX = toPos.x; // Left edge of the target card

          const midX = (fromX + toX) / 2;
          const cornerRadius = 8; // 8px curve radius
          
          // Calculate path with rounded corners
          const pathData = `
            M ${fromX} ${fromY}
            L ${midX - cornerRadius} ${fromY}
            Q ${midX} ${fromY} ${midX} ${fromY < toY ? fromY + cornerRadius : fromY - cornerRadius}
            L ${midX} ${toY < fromY ? toY + cornerRadius : toY - cornerRadius}
            Q ${midX} ${toY} ${midX + cornerRadius} ${toY}
            L ${toX} ${toY}
          `;
          
          return (
            <g key={connection.id}>
              <path
                d={pathData}
                stroke={color}
                strokeWidth="2"
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
            </g>
          );
        })}
      </svg>

      {/* Page nodes - delayed fade in after background */}
      <div className={`transition-opacity duration-300 ${
        isVisible ? "opacity-100 delay-300" : "opacity-0"
      }`}>
        {pageNodes.map(node => {
        const page = getPage(node.pageId);
        if (!page) return null;

        // Sort components by position
        const sortedComponents = [...page.contents].sort((a, b) => {
          if (a.position.row !== b.position.row) {
            return a.position.row - b.position.row;
          }
          return a.position.col - b.position.col;
        });

        return (
          <div
            key={node.pageId}
            className="absolute"
            style={{
              left: node.position.x,
              top: node.position.y,
              width: 340,
              zIndex: draggingNode === node.pageId ? 30 : 10,
            }}
          >
            {/* Page name tag - positioned outside and clickable for connections */}
            <div 
              className={`relative flex items-center px-3 py-1.5 rounded-t-lg inline-flex transition-all ${
                connectingFrom && connectingFrom.pageId !== node.pageId
                  ? 'bg-blue-100 cursor-pointer hover:bg-blue-200 ring-2 ring-blue-400'
                  : 'bg-amber-100'
              }`}
              onClick={(e) => {
                if (connectingFrom && connectingFrom.pageId !== node.pageId) {
                  handlePageClick(node.pageId, e);
                }
              }}
            >
              <span className={`text-sm font-semibold ${
                connectingFrom && connectingFrom.pageId !== node.pageId
                  ? 'text-blue-800'
                  : 'text-amber-800'
              }`}>
                {page.name}
              </span>
              {/* Extension that goes behind the card */}
              <div className={`absolute left-0 right-0 bottom-0 h-3 translate-y-full -z-10 ${
                connectingFrom && connectingFrom.pageId !== node.pageId
                  ? 'bg-blue-100'
                  : 'bg-amber-100'
              }`}></div>
            </div>
            
            {/* Card */}
            <div className="bg-white border border-neutral-200 rounded-xl shadow-lg relative z-0">
              {/* Header - invisible but draggable */}
              <div
                className="px-5 pt-4 pb-2 cursor-grab active:cursor-grabbing"
                onMouseDown={(e) => handleNodeMouseDown(e, node.pageId)}
              >
              </div>

            {/* Components List */}
            {sortedComponents.length > 0 ? (
              <div className="px-4 pb-3">
                <div className="space-y-1.5">
                  {sortedComponents.map(component => {
                    const isConnecting = connectingFrom?.pageId === node.pageId && connectingFrom?.componentId === component.id;
                    const connection = connections.find(c => 
                      c.fromPageId === node.pageId && c.fromComponentId === component.id
                    );
                    const connectionColor = connection ? getConnectionColor(connection) : null;
                    const displayText = getComponentDisplayText(component);
                    
                    return (
                      <div
                        key={component.id}
                        className={`px-3 py-2 bg-white rounded-md cursor-pointer transition-all ${
                          isConnecting 
                            ? 'border border-blue-400 ring-2 ring-blue-100' 
                            : connectionColor 
                              ? 'shadow-xl border-[3px]' 
                              : 'border border-neutral-200 hover:shadow-sm'
                        }`}
                        style={connectionColor ? {
                          borderColor: connectionColor,
                          borderStyle: 'solid',
                        } : undefined}
                        onClick={(e) => handleComponentClick(node.pageId, component.id, e)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-neutral-900 capitalize">{component.type}</span>
                          {connection && (
                            <button 
                              className="p-0.5 hover:bg-neutral-100 rounded flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConnection(connection.id);
                              }}
                            >
                              <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <div className="flex items-start">
                          <span className="text-xs text-neutral-600">
                            {connection 
                              ? `Route to ${getPage(connection.toPageId)?.name || 'destination'}`
                              : displayText
                            }
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-5 pb-4">
                <p className="text-xs text-neutral-400 italic">No components</p>
              </div>
            )}

            {/* Edit page link */}
            <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPageSelect(node.pageId);
                }}
                className="text-xs text-neutral-500 hover:text-neutral-700 font-medium"
              >
                Edit in Pages
              </button>
            </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

