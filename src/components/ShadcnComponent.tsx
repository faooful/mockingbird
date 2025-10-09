"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GridContent } from "./WireframeGrid";

interface ShadcnComponentProps {
  content: GridContent;
  span: { rows: number; cols: number };
}

export default function ShadcnComponent({ content }: ShadcnComponentProps) {
  const props = content.properties || {};
  
  const renderComponent = () => {
    switch (content.type) {
      case "button":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <Button variant={props.variant || "default"} className="w-full h-full">
              {props.text || "Click me"}
            </Button>
          </div>
        );

      case "input":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <Input 
              type={props.inputType || "text"}
              placeholder={props.placeholder || "Enter text..."} 
              className="w-full h-full" 
            />
          </div>
        );

      case "card":
        return (
          <div className="w-full h-full p-2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{props.title || "Card Title"}</CardTitle>
                <CardDescription className="text-xs">{props.description || "Card description goes here"}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {props.content || "This is a card component that can be used for content blocks."}
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "table":
        return (
          <div className="w-full h-full p-2 overflow-auto">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(props.rows || [
                  { name: "John Doe", status: "Active", date: "2024-01-15" },
                  { name: "Jane Smith", status: "Inactive", date: "2024-01-14" }
                ]).map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs">{row.name}</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant={row.status === "Active" ? "secondary" : "outline"} className="text-xs">
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      case "badge":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <Badge variant={props.variant || "default"} className="text-xs">
              {props.text || "Badge"}
            </Badge>
          </div>
        );

      case "avatar":
        return (
          <div className="w-full h-full flex items-center justify-center gap-2 p-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="text-xs">{props.fallback || "UN"}</AvatarFallback>
            </Avatar>
            <div className="text-xs">
              <p className="font-medium">{props.name || "User Name"}</p>
              <p className="text-muted-foreground">{props.email || "user@example.com"}</p>
            </div>
          </div>
        );

      case "tabs":
        const tabs = props.tabs || [
          { id: "tab1", label: "Tab 1", content: "Content for Tab 1" },
          { id: "tab2", label: "Tab 2", content: "Content for Tab 2" },
          { id: "tab3", label: "Tab 3", content: "Content for Tab 3" }
        ];
        return (
          <div className="w-full h-full p-2">
            <Tabs defaultValue={tabs[0]?.id} className="h-full">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
                {tabs.map((tab: any) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab: any) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-2 h-full">
                  <Card className="h-full">
                    <CardContent className="p-2">
                      <p className="text-xs">{tab.content}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        );

      case "accordion":
        const items = props.items || [
          { id: "item-1", title: "Section 1", content: "This is the content for section 1. It can contain any type of content." },
          { id: "item-2", title: "Section 2", content: "This is the content for section 2. You can add more sections as needed." }
        ];
        return (
          <div className="w-full h-full p-2 overflow-auto">
            <Accordion type="single" collapsible className="w-full">
              {items.map((item: any) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-xs">{item.title}</AccordionTrigger>
                  <AccordionContent className="text-xs">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        );

      case "alert":
        return (
          <div className="w-full h-full p-2">
            <Alert className={props.variant === "destructive" ? "border-destructive" : ""}>
              <AlertTitle className="text-sm">{props.title || "Heads up!"}</AlertTitle>
              <AlertDescription className="text-xs">
                {props.description || "You can add components to your app using the cli."}
              </AlertDescription>
            </Alert>
          </div>
        );

      case "sidebar":
        const menuItems = props.menuItems || ["Dashboard", "Projects", "Settings"];
        return (
          <div className="w-full h-full p-2">
            <div className="border rounded-lg h-full p-2">
              <h3 className="font-semibold mb-2 text-sm">{props.title || "Navigation"}</h3>
              <nav className="space-y-1">
                {menuItems.map((item: string, index: number) => (
                  <Button key={index} variant="ghost" className="w-full justify-start text-xs h-8">
                    {item}
                  </Button>
                ))}
              </nav>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Unknown component
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-white rounded border">
      {renderComponent()}
    </div>
  );
}
