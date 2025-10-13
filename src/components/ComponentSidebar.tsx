"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GridContent } from "./WireframeGrid";
import { cn } from "@/lib/utils";

interface ComponentSidebarProps {
  onSelectComponent: (type: GridContent["type"]) => void;
  selectedContent: GridContent | null;
  onUpdateContent: (id: string, updates: Partial<GridContent>) => void;
  onDeselectComponent: () => void;
}

export default function ComponentSidebar({ onSelectComponent, selectedContent, onUpdateContent, onDeselectComponent }: ComponentSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Components", "Data Viz"])
  );

  const componentCategories = [
    {
      name: "Components",
      components: [
        { type: "button" as const, label: "Button" },
        { type: "input" as const, label: "Input" },
        { type: "textarea" as const, label: "Textarea" },
        { type: "select" as const, label: "Select" },
        { type: "checkbox" as const, label: "Checkbox" },
        { type: "radio" as const, label: "Radio" },
        { type: "switch" as const, label: "Switch" },
        { type: "slider" as const, label: "Slider" },
        { type: "card" as const, label: "Card" },
        { type: "table" as const, label: "Table" },
        { type: "badge" as const, label: "Badge" },
        { type: "avatar" as const, label: "Avatar" },
        { type: "tabs" as const, label: "Tabs" },
        { type: "dropdown" as const, label: "Dropdown" },
        { type: "sidebar" as const, label: "Sidebar" },
        { type: "alert" as const, label: "Alert" },
        { type: "progress" as const, label: "Progress" },
        { type: "skeleton" as const, label: "Skeleton" },
        { type: "tooltip" as const, label: "Tooltip" },
        { type: "popover" as const, label: "Popover" },
        { type: "accordion" as const, label: "Accordion" },
        { type: "separator" as const, label: "Separator" },
        { type: "calendar" as const, label: "Calendar" },
        { type: "datepicker" as const, label: "Date Picker" },
      ]
    },
    {
      name: "Data Viz",
      components: [
        { type: "barchart" as const, label: "Bar Chart" },
        { type: "linechart" as const, label: "Line Chart" },
        { type: "areachart" as const, label: "Area Chart" },
        { type: "piechart" as const, label: "Pie Chart" },
      ]
    }
  ];

  const components = componentCategories.flatMap(cat => cat.components);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  // Filter categories and components based on search
  const filteredCategories = searchQuery
    ? componentCategories.map(category => ({
        ...category,
        components: category.components.filter(component =>
          component.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.components.length > 0)
    : componentCategories;

  const getComponentPreview = (type: GridContent["type"]) => {
    switch (type) {
      case "button":
        return <Button size="sm" className="pointer-events-none text-xs h-7 px-3">Button</Button>;
      case "input":
        return <Input placeholder="Input" className="text-xs h-7 w-full pointer-events-none" />;
      case "textarea":
        return <div className="border rounded text-xs p-1 pointer-events-none w-full h-12 text-neutral-400">Textarea</div>;
      case "select":
        return <div className="border rounded text-xs p-1 pointer-events-none w-full h-7 flex items-center justify-between"><span>Select</span><span>▼</span></div>;
      case "checkbox":
        return <div className="border rounded w-4 h-4 pointer-events-none flex items-center justify-center text-xs">✓</div>;
      case "radio":
        return <div className="border rounded-full w-4 h-4 pointer-events-none flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-black"></div></div>;
      case "switch":
        return <div className="w-10 h-5 bg-neutral-300 rounded-full pointer-events-none relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div></div>;
      case "slider":
        return <div className="w-full h-2 bg-neutral-300 rounded pointer-events-none relative"><div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full"></div></div>;
      case "card":
        return (
          <Card className="w-full h-12 pointer-events-none">
            <CardHeader className="p-2">
              <CardTitle className="text-xs">Card</CardTitle>
            </CardHeader>
          </Card>
        );
      case "table":
        return (
          <div className="border rounded text-xs p-1.5 pointer-events-none w-full h-12 flex items-center justify-center">
            <div className="font-semibold">Table</div>
          </div>
        );
      case "badge":
        return <Badge className="pointer-events-none text-xs">Badge</Badge>;
      case "avatar":
        return (
          <Avatar className="w-10 h-10 pointer-events-none">
            <AvatarFallback className="text-xs">AV</AvatarFallback>
          </Avatar>
        );
      case "tabs":
        return (
          <div className="border rounded text-xs p-1.5 pointer-events-none w-full h-12">
            <div className="flex gap-1">
              <div className="border-b-2 border-black px-2 py-0.5">Tab 1</div>
              <div className="px-2 py-0.5 text-neutral-400">Tab 2</div>
            </div>
          </div>
        );
      case "accordion":
        return (
          <div className="border rounded text-xs p-2 pointer-events-none w-full h-12 flex items-center justify-between">
            <span>Item</span>
            <span className="text-neutral-400">▼</span>
          </div>
        );
      case "alert":
        return (
          <Alert className="p-2 pointer-events-none h-12 flex items-center">
            <div className="text-xs">Alert</div>
          </Alert>
        );
      case "dropdown":
        return <div className="border rounded text-xs p-1 pointer-events-none w-full h-7 flex items-center justify-between"><span>Menu</span><span>▼</span></div>;
      case "popover":
        return <div className="border rounded text-xs p-2 pointer-events-none bg-white shadow-sm">Popover</div>;
      case "tooltip":
        return <div className="bg-black text-white text-xs px-2 py-1 rounded pointer-events-none">Tooltip</div>;
      case "calendar":
        return <div className="border rounded text-xs p-1 pointer-events-none w-full h-12 grid grid-cols-7 gap-0.5 text-center">{[...Array(7)].map((_, i) => <div key={i} className="text-[8px]">{i+1}</div>)}</div>;
      case "datepicker":
        return <div className="border rounded text-xs p-1 pointer-events-none w-full h-7 flex items-center justify-between"><span>Pick date</span><span>📅</span></div>;
      case "progress":
        return <div className="w-full h-2 bg-neutral-200 rounded pointer-events-none"><div className="w-3/5 h-full bg-black rounded"></div></div>;
      case "separator":
        return <div className="w-full h-px bg-neutral-300 pointer-events-none"></div>;
      case "skeleton":
        return <div className="w-full h-8 bg-neutral-200 rounded animate-pulse pointer-events-none"></div>;
      case "sidebar":
        return (
          <div className="border-l-4 border-neutral-400 pl-2 text-xs pointer-events-none h-12 flex items-center">
            Sidebar
          </div>
        );
      case "barchart":
        return (
          <div className="w-full h-12 pointer-events-none flex items-end justify-around gap-0.5 px-1 pb-1">
            <div className="w-3 bg-blue-500 h-8"></div>
            <div className="w-3 bg-blue-500 h-6"></div>
            <div className="w-3 bg-blue-500 h-10"></div>
            <div className="w-3 bg-blue-500 h-5"></div>
          </div>
        );
      case "linechart":
        return (
          <div className="w-full h-12 pointer-events-none relative">
            <svg viewBox="0 0 40 20" className="w-full h-full">
              <polyline points="0,15 10,10 20,12 30,5 40,8" fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
            </svg>
          </div>
        );
      case "areachart":
        return (
          <div className="w-full h-12 pointer-events-none relative">
            <svg viewBox="0 0 40 20" className="w-full h-full">
              <polygon points="0,20 0,15 10,10 20,12 30,5 40,8 40,20" fill="#3b82f6" opacity="0.3"/>
              <polyline points="0,15 10,10 20,12 30,5 40,8" fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
            </svg>
          </div>
        );
      case "piechart":
        return (
          <div className="w-12 h-12 pointer-events-none relative">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <circle r="16" cx="16" cy="16" fill="#3b82f6"/>
              <circle r="16" cx="16" cy="16" fill="#60a5fa" strokeDasharray="25 75" strokeDashoffset="25" stroke="transparent" strokeWidth="32"/>
              <circle r="16" cx="16" cy="16" fill="#93c5fd" strokeDasharray="15 85" strokeDashoffset="50" stroke="transparent" strokeWidth="32"/>
            </svg>
          </div>
        );
      default:
        return <div className="text-xs text-neutral-400">+</div>;
    }
  };

  const handlePropertyChange = (key: string, value: any) => {
    if (!selectedContent) return;
    onUpdateContent(selectedContent.id, {
      properties: {
        ...selectedContent.properties,
        [key]: value
      }
    });
  };

  return (
    <div className="w-64 border-r border-neutral-300 bg-white h-full flex flex-col">
      {selectedContent ? (
        /* Details Panel */
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex items-center gap-2">
            <button
              onClick={onDeselectComponent}
              className="hover:bg-neutral-100 p-1 rounded transition-colors"
              title="Back to components"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-sm font-semibold capitalize">{selectedContent.type}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <p className="text-xs text-neutral-500 mb-1">
                Position: Row {selectedContent.position.row + 1}, Col {selectedContent.position.col + 1}
              </p>
              <p className="text-xs text-neutral-500">
                Size: {selectedContent.span.cols} × {selectedContent.span.rows}
              </p>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-xs font-semibold mb-3">Properties</h4>
                
                {/* Common properties based on component type */}
                {selectedContent.type === "button" && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Text</Label>
                      <Input
                        value={selectedContent.properties?.text || ""}
                        onChange={(e) => handlePropertyChange("text", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Button text"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Variant</Label>
                      <Select
                        value={selectedContent.properties?.variant || "default"}
                        onValueChange={(value) => handlePropertyChange("variant", value)}
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="destructive">Destructive</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="ghost">Ghost</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Size</Label>
                      <Select
                        value={selectedContent.properties?.size || "default"}
                        onValueChange={(value) => handlePropertyChange("size", value)}
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                          <SelectItem value="icon">Icon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {selectedContent.type === "badge" && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Text</Label>
                      <Input
                        value={selectedContent.properties?.text || ""}
                        onChange={(e) => handlePropertyChange("text", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Badge text"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Variant</Label>
                      <Select
                        value={selectedContent.properties?.variant || "default"}
                        onValueChange={(value) => handlePropertyChange("variant", value)}
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="destructive">Destructive</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {selectedContent.type === "input" && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Placeholder</Label>
                      <Input
                        value={selectedContent.properties?.placeholder || ""}
                        onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Enter placeholder"
                      />
                    </div>
                  </div>
                )}

                {selectedContent.type === "card" && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={selectedContent.properties?.title || ""}
                        onChange={(e) => handlePropertyChange("title", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Card title"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={selectedContent.properties?.description || ""}
                        onChange={(e) => handlePropertyChange("description", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Card description"
                      />
                    </div>
                  </div>
                )}

                {selectedContent.type === "alert" && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={selectedContent.properties?.title || ""}
                        onChange={(e) => handlePropertyChange("title", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Alert title"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={selectedContent.properties?.description || ""}
                        onChange={(e) => handlePropertyChange("description", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Alert description"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Variant</Label>
                      <Select
                        value={selectedContent.properties?.variant || "default"}
                        onValueChange={(value) => handlePropertyChange("variant", value)}
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="destructive">Destructive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {(selectedContent.type === "checkbox" || selectedContent.type === "radio" || selectedContent.type === "switch") && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={selectedContent.properties?.label || ""}
                        onChange={(e) => handlePropertyChange("label", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Label text"
                      />
                    </div>
                  </div>
                )}

                {selectedContent.type === "progress" && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Value (%)</Label>
                      <Input
                        type="number"
                        value={selectedContent.properties?.value || 60}
                        onChange={(e) => handlePropertyChange("value", parseInt(e.target.value))}
                        className="text-xs h-8"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                )}

                {(selectedContent.type === "barchart" || selectedContent.type === "linechart" || selectedContent.type === "areachart" || selectedContent.type === "piechart") && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={selectedContent.properties?.title || ""}
                        onChange={(e) => handlePropertyChange("title", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Chart title"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      ) : (
        /* Components List */
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm"
            />
          </div>

          <div className="relative flex-1 overflow-hidden">
            {/* Gradient fade at top */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-white/0 pointer-events-none z-10"></div>
            
            <div className="h-full overflow-y-auto p-3 space-y-4">
            {filteredCategories.map((category) => (
              <div key={category.name}>
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between mb-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900"
                >
                  <span>{category.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedCategories.has(category.name) ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {expandedCategories.has(category.name) && (
                  <div className="grid grid-cols-2 gap-2">
                    {category.components.map((component) => (
                <div
                  key={component.type}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("componentType", component.type);
                    e.dataTransfer.effectAllowed = "copy";
                    setDraggingComponent(component.type);
                    
                    // Create a compact drag preview
                    const dragPreview = (e.target as HTMLElement).cloneNode(true) as HTMLElement;
                    dragPreview.style.width = '140px';
                    dragPreview.style.height = '112px';
                    dragPreview.style.position = 'fixed';
                    dragPreview.style.top = '-1000px';
                    dragPreview.style.opacity = '0.95';
                    dragPreview.style.transform = 'rotate(3deg)';
                    dragPreview.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
                    dragPreview.style.borderRadius = '8px';
                    document.body.appendChild(dragPreview);
                    e.dataTransfer.setDragImage(dragPreview, 70, 56);
                    setTimeout(() => document.body.removeChild(dragPreview), 0);
                  }}
                  onDragEnd={() => setDraggingComponent(null)}
                  onClick={() => onSelectComponent(component.type)}
                  className={cn(
                    "border border-neutral-300 rounded-lg p-3 hover:border-neutral-400 hover:bg-neutral-50 transition-all flex flex-col items-center justify-center gap-2 h-28 cursor-grab active:cursor-grabbing",
                    draggingComponent === component.type && "opacity-20 border-dashed border-blue-300 bg-blue-50/30"
                  )}
                >
                  <div className="flex items-center justify-center flex-1 w-full pointer-events-none">
                    {getComponentPreview(component.type)}
                  </div>
                  <span className="text-xs text-neutral-600 font-medium pointer-events-none">{component.label}</span>
                </div>
              ))}
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
