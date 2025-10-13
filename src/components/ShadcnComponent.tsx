"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Area, AreaChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { GridContent } from "./WireframeGrid";

interface ShadcnComponentProps {
  content: GridContent;
  span?: { rows: number; cols: number };
}

export default function ShadcnComponent({ content, span = { rows: 1, cols: 1 } }: ShadcnComponentProps) {
  const props = content.properties || {};
  
  const renderComponent = () => {
    switch (content.type) {
      case "button":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <Button 
              variant={props.variant || "default"} 
              size={props.size || "default"}
              className="min-w-fit"
            >
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
        // Calculate number of rows based on span height (approximate)
        const rowHeight = 40; // Approximate height per row including header
        const minRows = 2;
        const estimatedRows = Math.max(minRows, Math.floor((span.rows * 100) / rowHeight));
        
        const defaultRows = Array.from({ length: estimatedRows }, (_, i) => ({
          name: `Item ${i + 1}`,
          status: i % 2 === 0 ? "Active" : "Inactive",
          date: `2024-01-${String(15 + i).padStart(2, '0')}`
        }));
        
        return (
          <div className="w-full h-full p-2 overflow-auto flex flex-col">
            <div className="border rounded-md flex-1 flex flex-col overflow-hidden">
              <Table className="text-xs h-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(props.rows || defaultRows).map((row: any, index: number) => (
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
          { id: "tab1", label: "Tab 1" },
          { id: "tab2", label: "Tab 2" },
          { id: "tab3", label: "Tab 3" }
        ];
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <Tabs defaultValue={tabs[0]?.id} className="w-full">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
                {tabs.map((tab: any) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
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

      case "textarea":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full h-full border rounded p-2 text-xs text-neutral-400">
              {props.placeholder || "Enter text..."}
            </div>
          </div>
        );

      case "select":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full border rounded p-2 text-xs flex items-center justify-between">
              <span>{props.value || "Select option"}</span>
              <span>▼</span>
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className="w-full h-full flex items-center justify-center p-2 gap-2">
            <div className="border rounded w-4 h-4 flex items-center justify-center text-xs">
              {props.checked && "✓"}
            </div>
            <span className="text-xs">{props.label || "Checkbox"}</span>
          </div>
        );

      case "radio":
        return (
          <div className="w-full h-full flex items-center justify-center p-2 gap-2">
            <div className="border rounded-full w-4 h-4 flex items-center justify-center">
              {props.selected && <div className="w-2 h-2 rounded-full bg-black"></div>}
            </div>
            <span className="text-xs">{props.label || "Radio"}</span>
          </div>
        );

      case "switch":
        return (
          <div className="w-full h-full flex items-center justify-center p-2 gap-2">
            <div className={`w-10 h-5 rounded-full relative ${props.enabled ? 'bg-black' : 'bg-neutral-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${props.enabled ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
            <span className="text-xs">{props.label || "Switch"}</span>
          </div>
        );

      case "slider":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full h-2 bg-neutral-300 rounded relative">
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full"></div>
            </div>
          </div>
        );

      case "dropdown":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full border rounded p-2 text-xs flex items-center justify-between">
              <span>{props.label || "Menu"}</span>
              <span>▼</span>
            </div>
          </div>
        );

      case "popover":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="border rounded p-2 text-xs bg-white shadow-lg">
              {props.content || "Popover content"}
            </div>
          </div>
        );

      case "tooltip":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="bg-black text-white text-xs px-2 py-1 rounded">
              {props.text || "Tooltip"}
            </div>
          </div>
        );

      case "calendar":
        return (
          <div className="w-full h-full p-2">
            <div className="border rounded p-2 text-xs">
              <div className="font-semibold mb-2">Calendar</div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-[10px] font-semibold">{day}</div>
                ))}
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="text-[10px] p-1">{i + 1}</div>
                ))}
              </div>
            </div>
          </div>
        );

      case "datepicker":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full border rounded p-2 text-xs flex items-center justify-between">
              <span>{props.date || "Pick a date"}</span>
              <span>📅</span>
            </div>
          </div>
        );

      case "progress":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full h-2 bg-neutral-200 rounded">
              <div className="h-full bg-black rounded" style={{ width: `${props.value || 60}%` }}></div>
            </div>
          </div>
        );

      case "separator":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full h-px bg-neutral-300"></div>
          </div>
        );

      case "skeleton":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full h-8 bg-neutral-200 rounded animate-pulse"></div>
          </div>
        );

      case "barchart":
        const barChartData = [
          { month: "Jan", value: 186 },
          { month: "Feb", value: 305 },
          { month: "Mar", value: 237 },
          { month: "Apr", value: 273 },
          { month: "May", value: 209 },
          { month: "Jun", value: 214 },
        ];
        const barChartConfig = {
          value: {
            label: props.title || "Value",
            color: "hsl(var(--chart-1))",
          },
        };
        return (
          <div className="w-full h-full p-2 flex flex-col">
            {props.title && <div className="text-sm font-semibold mb-1">{props.title}</div>}
            <div className="flex-1 min-h-0">
              <ChartContainer config={barChartConfig} className="h-full w-full aspect-auto">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        );

      case "linechart":
        const lineChartData = [
          { month: "Jan", value: 186 },
          { month: "Feb", value: 305 },
          { month: "Mar", value: 237 },
          { month: "Apr", value: 273 },
          { month: "May", value: 209 },
          { month: "Jun", value: 214 },
        ];
        const lineChartConfig = {
          value: {
            label: props.title || "Value",
            color: "hsl(var(--chart-1))",
          },
        };
        return (
          <div className="w-full h-full p-2 flex flex-col">
            {props.title && <div className="text-sm font-semibold mb-1">{props.title}</div>}
            <div className="flex-1 min-h-0">
              <ChartContainer config={lineChartConfig} className="h-full w-full aspect-auto">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        );

      case "areachart":
        const areaChartData = [
          { month: "Jan", value: 186 },
          { month: "Feb", value: 305 },
          { month: "Mar", value: 237 },
          { month: "Apr", value: 273 },
          { month: "May", value: 209 },
          { month: "Jun", value: 214 },
        ];
        const areaChartConfig = {
          value: {
            label: props.title || "Value",
            color: "hsl(var(--chart-1))",
          },
        };
        return (
          <div className="w-full h-full p-2 flex flex-col">
            {props.title && <div className="text-sm font-semibold mb-1">{props.title}</div>}
            <div className="flex-1 min-h-0">
              <ChartContainer config={areaChartConfig} className="h-full w-full aspect-auto">
                <AreaChart data={areaChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.2} />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        );

      case "piechart":
        const pieChartData = [
          { category: "A", value: 275, fill: "hsl(var(--chart-1))" },
          { category: "B", value: 200, fill: "hsl(var(--chart-2))" },
          { category: "C", value: 187, fill: "hsl(var(--chart-3))" },
        ];
        const pieChartConfig = {
          A: {
            label: "Category A",
            color: "hsl(var(--chart-1))",
          },
          B: {
            label: "Category B",
            color: "hsl(var(--chart-2))",
          },
          C: {
            label: "Category C",
            color: "hsl(var(--chart-3))",
          },
        };
        return (
          <div className="w-full h-full p-2 flex flex-col">
            {props.title && <div className="text-sm font-semibold mb-1">{props.title}</div>}
            <div className="flex-1 min-h-0">
              <ChartContainer config={pieChartConfig} className="h-full w-full aspect-auto">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie data={pieChartData} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius="80%">
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
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
    <div className="w-full h-full bg-white rounded border overflow-hidden">
      {renderComponent()}
    </div>
  );
}
