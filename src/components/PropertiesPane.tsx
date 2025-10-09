"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GridContent } from "./WireframeGrid";

interface PropertiesPaneProps {
  selectedContent: GridContent | null;
  onUpdateContent: (contentId: string, updates: Partial<GridContent>) => void;
  onClose: () => void;
}

export default function PropertiesPane({ selectedContent, onUpdateContent, onClose }: PropertiesPaneProps) {
  if (!selectedContent) {
    return (
      <div className="w-80 border-l border-neutral-300 bg-neutral-100 h-full flex items-center justify-center">
        <p className="text-neutral-500 text-sm">Select a component to edit its properties</p>
      </div>
    );
  }

  const props = selectedContent.properties || {};

  const handlePropertyChange = (property: string, value: any) => {
    const updatedProperties = { ...props, [property]: value };
    onUpdateContent(selectedContent.id, { properties: updatedProperties });
  };

  const getArrayProp = (propName: string): any[] => {
    return (props[propName] as any[]) || [];
  };

  const renderPropertyEditor = () => {
    switch (selectedContent.type) {
      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={props.text || "Click me"}
                onChange={(e) => handlePropertyChange("text", e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div>
              <Label htmlFor="button-variant">Variant</Label>
              <select
                id="button-variant"
                value={props.variant || "default"}
                onChange={(e) => handlePropertyChange("variant", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="default">Default</option>
                <option value="destructive">Destructive</option>
                <option value="outline">Outline</option>
                <option value="secondary">Secondary</option>
                <option value="ghost">Ghost</option>
                <option value="link">Link</option>
              </select>
            </div>
          </div>
        );

      case "input":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="input-placeholder">Placeholder</Label>
              <Input
                id="input-placeholder"
                value={props.placeholder || "Enter text..."}
                onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
                placeholder="Placeholder text"
              />
            </div>
            <div>
              <Label htmlFor="input-type">Type</Label>
              <select
                id="input-type"
                value={props.inputType || "text"}
                onChange={(e) => handlePropertyChange("inputType", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="tel">Phone</option>
              </select>
            </div>
          </div>
        );

      case "card":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-title">Title</Label>
              <Input
                id="card-title"
                value={props.title || "Card Title"}
                onChange={(e) => handlePropertyChange("title", e.target.value)}
                placeholder="Card title"
              />
            </div>
            <div>
              <Label htmlFor="card-description">Description</Label>
              <Input
                id="card-description"
                value={props.description || "Card description goes here"}
                onChange={(e) => handlePropertyChange("description", e.target.value)}
                placeholder="Card description"
              />
            </div>
            <div>
              <Label htmlFor="card-content">Content</Label>
              <textarea
                id="card-content"
                value={props.content || "This is a card component that can be used for content blocks."}
                onChange={(e) => handlePropertyChange("content", e.target.value)}
                placeholder="Card content"
                className="w-full p-2 border rounded h-20 resize-none"
              />
            </div>
          </div>
        );

      case "table":
        return (
          <div className="space-y-4">
            <div>
              <Label>Table Rows</Label>
              <div className="space-y-2">
                {(getArrayProp("rows").length > 0 ? getArrayProp("rows") : [
                  { name: "John Doe", status: "Active", date: "2024-01-15" },
                  { name: "Jane Smith", status: "Inactive", date: "2024-01-14" }
                ]).map((row: any, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={row.name}
                      onChange={(e) => {
                        const newRows = [...getArrayProp("rows")];
                        newRows[index] = { ...newRows[index], name: e.target.value };
                        handlePropertyChange("rows", newRows);
                      }}
                      placeholder="Name"
                      className="flex-1"
                    />
                    <Input
                      value={row.status}
                      onChange={(e) => {
                        const newRows = [...getArrayProp("rows")];
                        newRows[index] = { ...newRows[index], status: e.target.value };
                        handlePropertyChange("rows", newRows);
                      }}
                      placeholder="Status"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const newRows = getArrayProp("rows").filter((_: any, i: number) => i !== index);
                        handlePropertyChange("rows", newRows);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newRows = [...getArrayProp("rows"), { name: "New Row", status: "Active", date: "2024-01-01" }];
                    handlePropertyChange("rows", newRows);
                  }}
                >
                  Add Row
                </Button>
              </div>
            </div>
          </div>
        );

      case "badge":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="badge-text">Badge Text</Label>
              <Input
                id="badge-text"
                value={props.text || "Badge"}
                onChange={(e) => handlePropertyChange("text", e.target.value)}
                placeholder="Badge text"
              />
            </div>
            <div>
              <Label htmlFor="badge-variant">Variant</Label>
              <select
                id="badge-variant"
                value={props.variant || "default"}
                onChange={(e) => handlePropertyChange("variant", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="default">Default</option>
                <option value="secondary">Secondary</option>
                <option value="destructive">Destructive</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </div>
        );

      case "avatar":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="avatar-name">Name</Label>
              <Input
                id="avatar-name"
                value={props.name || "User Name"}
                onChange={(e) => handlePropertyChange("name", e.target.value)}
                placeholder="User name"
              />
            </div>
            <div>
              <Label htmlFor="avatar-email">Email</Label>
              <Input
                id="avatar-email"
                value={props.email || "user@example.com"}
                onChange={(e) => handlePropertyChange("email", e.target.value)}
                placeholder="User email"
              />
            </div>
            <div>
              <Label htmlFor="avatar-fallback">Fallback Initials</Label>
              <Input
                id="avatar-fallback"
                value={props.fallback || "UN"}
                onChange={(e) => handlePropertyChange("fallback", e.target.value)}
                placeholder="Fallback initials"
                maxLength={2}
              />
            </div>
          </div>
        );

      case "tabs":
        return (
          <div className="space-y-4">
            <div>
              <Label>Tabs</Label>
              <div className="space-y-2">
                {(getArrayProp("tabs").length > 0 ? getArrayProp("tabs") : [
                  { id: "tab1", label: "Tab 1", content: "Content for Tab 1" },
                  { id: "tab2", label: "Tab 2", content: "Content for Tab 2" },
                  { id: "tab3", label: "Tab 3", content: "Content for Tab 3" }
                ]).map((tab: any, index: number) => (
                  <div key={index} className="border rounded p-2">
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tab.label}
                        onChange={(e) => {
                          const newTabs = [...getArrayProp("tabs")];
                          newTabs[index] = { ...newTabs[index], label: e.target.value };
                          handlePropertyChange("tabs", newTabs);
                        }}
                        placeholder="Tab label"
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const newTabs = getArrayProp("tabs").filter((_: any, i: number) => i !== index);
                          handlePropertyChange("tabs", newTabs);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                    <textarea
                      value={tab.content}
                      onChange={(e) => {
                        const newTabs = [...getArrayProp("tabs")];
                        newTabs[index] = { ...newTabs[index], content: e.target.value };
                        handlePropertyChange("tabs", newTabs);
                      }}
                      placeholder="Tab content"
                      className="w-full p-2 border rounded h-16 resize-none"
                    />
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newTabs = [...getArrayProp("tabs"), { 
                      id: `tab${Date.now()}`, 
                      label: `Tab ${getArrayProp("tabs").length + 1}`, 
                      content: `Content for Tab ${getArrayProp("tabs").length + 1}` 
                    }];
                    handlePropertyChange("tabs", newTabs);
                  }}
                >
                  Add Tab
                </Button>
              </div>
            </div>
          </div>
        );

      case "accordion":
        return (
          <div className="space-y-4">
            <div>
              <Label>Accordion Items</Label>
              <div className="space-y-2">
                {(getArrayProp("items").length > 0 ? getArrayProp("items") : [
                  { id: "item-1", title: "Section 1", content: "This is the content for section 1. It can contain any type of content." },
                  { id: "item-2", title: "Section 2", content: "This is the content for section 2. You can add more sections as needed." }
                ]).map((item: any, index: number) => (
                  <div key={index} className="border rounded p-2">
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...getArrayProp("items")];
                          newItems[index] = { ...newItems[index], title: e.target.value };
                          handlePropertyChange("items", newItems);
                        }}
                        placeholder="Section title"
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const newItems = getArrayProp("items").filter((_: any, i: number) => i !== index);
                          handlePropertyChange("items", newItems);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                    <textarea
                      value={item.content}
                      onChange={(e) => {
                        const newItems = [...getArrayProp("items")];
                        newItems[index] = { ...newItems[index], content: e.target.value };
                        handlePropertyChange("items", newItems);
                      }}
                      placeholder="Section content"
                      className="w-full p-2 border rounded h-16 resize-none"
                    />
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newItems = [...getArrayProp("items"), { 
                      id: `item-${Date.now()}`, 
                      title: `Section ${getArrayProp("items").length + 1}`, 
                      content: `This is the content for section ${getArrayProp("items").length + 1}.` 
                    }];
                    handlePropertyChange("items", newItems);
                  }}
                >
                  Add Section
                </Button>
              </div>
            </div>
          </div>
        );

      case "alert":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="alert-title">Title</Label>
              <Input
                id="alert-title"
                value={props.title || "Heads up!"}
                onChange={(e) => handlePropertyChange("title", e.target.value)}
                placeholder="Alert title"
              />
            </div>
            <div>
              <Label htmlFor="alert-description">Description</Label>
              <textarea
                id="alert-description"
                value={props.description || "You can add components to your app using the cli."}
                onChange={(e) => handlePropertyChange("description", e.target.value)}
                placeholder="Alert description"
                className="w-full p-2 border rounded h-20 resize-none"
              />
            </div>
            <div>
              <Label htmlFor="alert-variant">Variant</Label>
              <select
                id="alert-variant"
                value={props.variant || "default"}
                onChange={(e) => handlePropertyChange("variant", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="default">Default</option>
                <option value="destructive">Destructive</option>
              </select>
            </div>
          </div>
        );

      case "sidebar":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="sidebar-title">Title</Label>
              <Input
                id="sidebar-title"
                value={props.title || "Navigation"}
                onChange={(e) => handlePropertyChange("title", e.target.value)}
                placeholder="Sidebar title"
              />
            </div>
            <div>
              <Label>Menu Items</Label>
              <div className="space-y-2">
                {(getArrayProp("menuItems").length > 0 ? getArrayProp("menuItems") : ["Dashboard", "Projects", "Settings"]).map((item: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...getArrayProp("menuItems")];
                        newItems[index] = e.target.value;
                        handlePropertyChange("menuItems", newItems);
                      }}
                      placeholder="Menu item"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const newItems = getArrayProp("menuItems").filter((_: any, i: number) => i !== index);
                        handlePropertyChange("menuItems", newItems);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newItems = [...getArrayProp("menuItems"), `New Item ${getArrayProp("menuItems").length + 1}`];
                    handlePropertyChange("menuItems", newItems);
                  }}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return <p className="text-muted-foreground">No properties available for this component.</p>;
    }
  };

  return (
    <div className="w-80 border-l border-neutral-300 bg-neutral-100 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-neutral-300">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-normal">Properties</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">×</Button>
        </div>
        <p className="text-xs text-neutral-600 capitalize">{selectedContent.type} Component</p>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pt-4">
        {renderPropertyEditor()}
      </CardContent>
    </div>
  );
}
