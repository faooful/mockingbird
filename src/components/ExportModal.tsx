"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GridContent } from "./WireframeGrid";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contents: GridContent[];
  rows: number;
  cols: number;
}

export default function ExportModal({ open, onOpenChange, contents, rows, cols }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    // Sort contents by position for better readability
    const sortedContents = [...contents].sort((a, b) => {
      if (a.position.row !== b.position.row) {
        return a.position.row - b.position.row;
      }
      return a.position.col - b.position.col;
    });

    let prompt = `Create a responsive web interface using React and shadcn/ui components with the following layout:\n\n`;
    prompt += `## Grid Layout\n`;
    prompt += `- The layout is organized in a ${rows}x${cols} grid (${rows} rows, ${cols} columns)\n`;
    prompt += `- Use CSS Grid or a similar layout system to achieve this structure\n`;
    prompt += `- Ensure the layout is responsive and adapts to different screen sizes\n\n`;

    prompt += `## Components and Positioning\n\n`;

    sortedContents.forEach((content, index) => {
      const { type, position, span, properties } = content;
      
      prompt += `${index + 1}. **${type.charAt(0).toUpperCase() + type.slice(1)} Component**\n`;
      prompt += `   - Position: Row ${position.row + 1}, Column ${position.col + 1}\n`;
      
      if (span.rows > 1 || span.cols > 1) {
        prompt += `   - Span: ${span.cols} column(s) × ${span.rows} row(s)\n`;
      }
      
      // Add component-specific properties
      if (properties && Object.keys(properties).length > 0) {
        prompt += `   - Properties:\n`;
        Object.entries(properties).forEach(([key, value]) => {
          if (typeof value === 'object') {
            prompt += `     - ${key}: ${JSON.stringify(value)}\n`;
          } else {
            prompt += `     - ${key}: "${value}"\n`;
          }
        });
      }
      
      // Add component-specific guidance
      switch (type) {
        case "button":
          prompt += `   - Use shadcn/ui Button component\n`;
          break;
        case "input":
          prompt += `   - Use shadcn/ui Input component\n`;
          break;
        case "card":
          prompt += `   - Use shadcn/ui Card component with CardHeader, CardTitle, CardDescription, and CardContent\n`;
          break;
        case "table":
          prompt += `   - Use shadcn/ui Table component with TableHeader, TableBody, TableRow, TableCell\n`;
          break;
        case "badge":
          prompt += `   - Use shadcn/ui Badge component\n`;
          break;
        case "avatar":
          prompt += `   - Use shadcn/ui Avatar component with AvatarImage and AvatarFallback\n`;
          break;
        case "tabs":
          prompt += `   - Use shadcn/ui Tabs component with TabsList and TabsTrigger\n`;
          break;
        case "accordion":
          prompt += `   - Use shadcn/ui Accordion component with AccordionItem, AccordionTrigger, and AccordionContent\n`;
          break;
        case "alert":
          prompt += `   - Use shadcn/ui Alert component with AlertTitle and AlertDescription\n`;
          break;
        case "sidebar":
          prompt += `   - Use shadcn/ui navigation components for a sidebar menu\n`;
          break;
      }
      
      prompt += `\n`;
    });

    prompt += `## Additional Requirements\n`;
    prompt += `- Use Tailwind CSS for styling\n`;
    prompt += `- Maintain consistent spacing and alignment across components\n`;
    prompt += `- Ensure all components are properly styled according to shadcn/ui guidelines\n`;
    prompt += `- The layout should be clean, modern, and professional\n`;
    prompt += `- Add appropriate hover states and transitions where applicable\n`;

    return prompt;
  };

  const prompt = generatePrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Export Layout Prompt</DialogTitle>
          <DialogDescription>
            Copy this prompt to describe your layout to an AI agent or developer
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <pre className="bg-neutral-100 p-4 rounded-lg text-xs whitespace-pre-wrap font-mono border border-neutral-300">
            {prompt}
          </pre>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleCopy}>
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

