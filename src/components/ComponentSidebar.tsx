"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert } from "@/components/ui/alert";
import { GridContent } from "./WireframeGrid";

interface ComponentSidebarProps {
  onSelectComponent: (type: GridContent["type"]) => void;
}

export default function ComponentSidebar({ onSelectComponent }: ComponentSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const components = [
    { type: "button" as const, label: "Button" },
    { type: "input" as const, label: "Input" },
    { type: "card" as const, label: "Card" },
    { type: "table" as const, label: "Table" },
    { type: "badge" as const, label: "Badge" },
    { type: "avatar" as const, label: "Avatar" },
    { type: "tabs" as const, label: "Tabs" },
    { type: "accordion" as const, label: "Accordion" },
    { type: "alert" as const, label: "Alert" },
    { type: "sidebar" as const, label: "Sidebar" },
  ];

  const filteredComponents = components.filter(component =>
    component.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getComponentPreview = (type: GridContent["type"]) => {
    switch (type) {
      case "button":
        return <Button size="sm" className="pointer-events-none text-xs h-7 px-3">Button</Button>;
      case "input":
        return <Input placeholder="Input" className="text-xs h-7 w-full pointer-events-none" />;
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
      case "sidebar":
        return (
          <div className="border-l-4 border-neutral-400 pl-2 text-xs pointer-events-none h-12 flex items-center">
            Sidebar
          </div>
        );
      default:
        return <div className="text-xs text-neutral-400">+</div>;
    }
  };

  return (
    <div className="w-64 border-r border-neutral-300 bg-white h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-neutral-200">
        <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">
          M
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-neutral-200">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm"
        />
      </div>

      {/* Components Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {filteredComponents.map((component) => (
            <div
              key={component.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("componentType", component.type);
                e.dataTransfer.effectAllowed = "copy";
              }}
              onClick={() => onSelectComponent(component.type)}
              className="border border-neutral-300 rounded-lg p-3 hover:border-neutral-400 hover:bg-neutral-50 transition-all flex flex-col items-center justify-center gap-2 h-28 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center justify-center flex-1 w-full pointer-events-none">
                {getComponentPreview(component.type)}
              </div>
              <span className="text-xs text-neutral-600 font-medium pointer-events-none">{component.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
