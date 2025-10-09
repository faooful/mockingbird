"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { GridContent } from "./WireframeGrid";

interface ContentSelectorProps {
  onSelect: (type: GridContent["type"]) => void;
}

export default function ContentSelector({ onSelect }: ContentSelectorProps) {
  const contentTypes = [
    {
      type: "button" as const,
      label: "Button",
      description: "Interactive button component",
      preview: <Button size="sm">Button</Button>,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    {
      type: "input" as const,
      label: "Input Field",
      description: "Text input component",
      preview: <Input placeholder="Input..." className="w-32" />,
      color: "bg-green-50 border-green-200 hover:bg-green-100"
    },
    {
      type: "card" as const,
      label: "Card",
      description: "Content container with header",
      preview: <div className="w-32 h-16 border rounded p-2 text-xs">Card Preview</div>,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
    },
    {
      type: "table" as const,
      label: "Table",
      description: "Data table component",
      preview: <div className="w-32 h-16 border rounded p-1 text-xs">Table<br/>Preview</div>,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100"
    },
    {
      type: "badge" as const,
      label: "Badge",
      description: "Status indicator component",
      preview: <Badge>Badge</Badge>,
      color: "bg-pink-50 border-pink-200 hover:bg-pink-100"
    },
    {
      type: "avatar" as const,
      label: "Avatar",
      description: "User profile image",
      preview: <Avatar className="w-6 h-6"><AvatarFallback>U</AvatarFallback></Avatar>,
      color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
    },
    {
      type: "tabs" as const,
      label: "Tabs",
      description: "Tabbed interface",
      preview: <div className="w-32 h-16 border rounded p-1 text-xs">Tabs<br/>Preview</div>,
      color: "bg-teal-50 border-teal-200 hover:bg-teal-100"
    },
    {
      type: "accordion" as const,
      label: "Accordion",
      description: "Collapsible content sections",
      preview: <div className="w-32 h-16 border rounded p-1 text-xs">Accordion<br/>Preview</div>,
      color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100"
    },
    {
      type: "alert" as const,
      label: "Alert",
      description: "Notification message",
      preview: <div className="w-32 h-16 border rounded p-1 text-xs bg-yellow-50">Alert<br/>Preview</div>,
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
    },
    {
      type: "sidebar" as const,
      label: "Sidebar",
      description: "Navigation sidebar",
      preview: <div className="w-32 h-16 border rounded p-1 text-xs">Sidebar<br/>Preview</div>,
      color: "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {contentTypes.map((contentType) => (
        <Card 
          key={contentType.type}
          className={`p-3 cursor-pointer transition-all duration-200 border-2 ${contentType.color}`}
          onClick={() => onSelect(contentType.type)}
        >
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              {contentType.preview}
            </div>
            <h3 className="font-medium text-sm">{contentType.label}</h3>
            <p className="text-xs text-muted-foreground">{contentType.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
