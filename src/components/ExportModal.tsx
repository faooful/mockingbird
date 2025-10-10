"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GridContent } from "./WireframeGrid";

interface Page {
  id: string;
  name: string;
  contents: GridContent[];
}

interface Connection {
  id: string;
  fromPageId: string;
  fromComponentId?: string;
  toPageId: string;
  toComponentId?: string;
}

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contents: GridContent[];
  rows: number;
  cols: number;
  pages: Page[];
  connections: Connection[];
}

export default function ExportModal({ open, onOpenChange, contents, rows, cols, pages, connections }: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const generatePrompt = () => {
    // Sort contents by position for better readability
    const sortedContents = [...contents].sort((a, b) => {
      if (a.position.row !== b.position.row) {
        return a.position.row - b.position.row;
      }
      return a.position.col - b.position.col;
    });

    let prompt = `I need you to build a Next.js app with the following layout and interactions.\n\n`;
    
    // Add multi-page info if there are multiple pages
    if (pages.length > 1) {
      prompt += `## Pages\n\n`;
      prompt += `Create ${pages.length} pages with the same grid structure (${rows}×${cols}):\n`;
      pages.forEach((page) => {
        prompt += `\n### ${page.name}\n`;
        const pageContents = page.contents.sort((a, b) => {
          if (a.position.row !== b.position.row) {
            return a.position.row - b.position.row;
          }
          return a.position.col - b.position.col;
        });
        
        if (pageContents.length === 0) {
          prompt += `Empty page\n`;
        } else {
          prompt += `Components (${pageContents.length} total):\n\n`;
          pageContents.forEach((content, i) => {
            const { type, position, span, properties } = content;
            
            prompt += `${i + 1}. **${type}**\n`;
            prompt += `   - \`gridRow: "${position.row + 1} / ${position.row + span.rows + 1}"\`\n`;
            prompt += `   - \`gridColumn: "${position.col + 1} / ${position.col + span.cols + 1}"\`\n`;
            
            // Add properties if they exist
            if (properties && Object.keys(properties).length > 0) {
              const relevantProps = Object.entries(properties).filter(([, value]) => 
                value !== undefined && value !== null && value !== ''
              );
              
              if (relevantProps.length > 0) {
                prompt += `   - Props: `;
                relevantProps.forEach(([key, value], propIdx) => {
                  if (typeof value === 'object') {
                    prompt += `${key}={${JSON.stringify(value)}}`;
                  } else {
                    prompt += `${key}="${value}"`;
                  }
                  if (propIdx < relevantProps.length - 1) prompt += ', ';
                });
                prompt += `\n`;
              }
            }
            
            prompt += `\n`;
          });
        }
      });
      prompt += `\n`;
    } else {
      // Single page
      prompt += `## Layout\n\n`;
      prompt += `Grid: ${rows} rows × ${cols} columns\n\n`;
      
      prompt += `Components (${sortedContents.length} total):\n\n`;

      sortedContents.forEach((content, i) => {
        const { type, position, span, properties } = content;
        
        prompt += `${i + 1}. **${type}**\n`;
        prompt += `   - \`gridRow: "${position.row + 1} / ${position.row + span.rows + 1}"\`\n`;
        prompt += `   - \`gridColumn: "${position.col + 1} / ${position.col + span.cols + 1}"\`\n`;
        
        // Add properties if they exist
        if (properties && Object.keys(properties).length > 0) {
          const relevantProps = Object.entries(properties).filter(([, value]) => 
            value !== undefined && value !== null && value !== ''
          );
          
          if (relevantProps.length > 0) {
            prompt += `   - Props: `;
            relevantProps.forEach(([key, value], propIdx) => {
              if (typeof value === 'object') {
                prompt += `${key}={${JSON.stringify(value)}}`;
              } else {
                prompt += `${key}="${value}"`;
              }
              if (propIdx < relevantProps.length - 1) prompt += ', ';
            });
            prompt += `\n`;
          }
        }
        
        prompt += `\n`;
      });
      prompt += `\n`;
    }

    // Add user journey/flow information if there are connections
    if (connections.length > 0) {
      prompt += `## Interactions\n\n`;
      prompt += `Wire up these interactions:\n\n`;
      
      // Define UI interaction components vs navigation components
      const uiInteractionTypes = ['popover', 'tooltip', 'dropdown', 'accordion', 'tabs', 'dialog', 'sheet'];
      
      // Separate UI interactions from page navigation
      const pageNavigations = connections.filter(conn => conn.fromPageId !== conn.toPageId);
      const uiInteractions = connections.filter(conn => conn.fromPageId === conn.toPageId);
      
      if (uiInteractions.length > 0) {
        uiInteractions.forEach((conn) => {
          const fromPage = pages.find(p => p.id === conn.fromPageId);
          const fromComponent = conn.fromComponentId 
            ? fromPage?.contents.find(c => c.id === conn.fromComponentId)
            : null;
          const toComponent = conn.toComponentId 
            ? fromPage?.contents.find(c => c.id === conn.toComponentId)
            : null;
          
          if (fromComponent && toComponent) {
            if (uiInteractionTypes.includes(toComponent.type)) {
              prompt += `- When the ${fromComponent.type} is clicked, open/show the ${toComponent.type}\n`;
            } else {
              prompt += `- When the ${fromComponent.type} is clicked, trigger the ${toComponent.type}\n`;
            }
          }
        });
      }
      
      if (pageNavigations.length > 0) {
        if (uiInteractions.length > 0) prompt += `\n`;
        pageNavigations.forEach((conn) => {
          const fromPage = pages.find(p => p.id === conn.fromPageId);
          const toPage = pages.find(p => p.id === conn.toPageId);
          const fromComponent = conn.fromComponentId 
            ? fromPage?.contents.find(c => c.id === conn.fromComponentId)
            : null;
          
          if (fromComponent && fromPage && toPage) {
            prompt += `- When the ${fromComponent.type} on **${fromPage.name}** is clicked, navigate to **${toPage.name}**\n`;
          }
        });
      }
      prompt += `\n`;
    }

    prompt += `## Implementation\n\n`;
    prompt += `Create \`app/page.tsx\` with this structure:\n\n`;
    prompt += `\`\`\`tsx\n`;
    prompt += `"use client";\n\n`;
    prompt += `import { Button } from "@/components/ui/button";\n`;
    prompt += `import { Card } from "@/components/ui/card";\n`;
    prompt += `// ... import other shadcn components as needed\n\n`;
    prompt += `export default function Home() {\n`;
    prompt += `  return (\n`;
    prompt += `    <div className="w-screen h-screen overflow-hidden">\n`;
    prompt += `      <div\n`;
    prompt += `        style={{\n`;
    prompt += `          display: "grid",\n`;
    prompt += `          gridTemplateRows: "repeat(${rows}, 1fr)",\n`;
    prompt += `          gridTemplateColumns: "repeat(${cols}, 1fr)",\n`;
    prompt += `          width: "100%",\n`;
    prompt += `          height: "100%",\n`;
    prompt += `          gap: "1rem",\n`;
    prompt += `        }}\n`;
    prompt += `      >\n`;
    prompt += `        {/* Place each component with its grid placement */}\n`;
    
    // Generate example for first component
    if (sortedContents.length > 0) {
      const first = sortedContents[0];
      prompt += `        <div style={{ gridRow: "${first.position.row + 1} / ${first.position.row + first.span.rows + 1}", gridColumn: "${first.position.col + 1} / ${first.position.col + first.span.cols + 1}" }}>\n`;
      prompt += `          <${first.type.charAt(0).toUpperCase() + first.type.slice(1)} />\n`;
      prompt += `        </div>\n`;
    }
    
    prompt += `        {/* ... repeat for all components listed above */}\n`;
    prompt += `      </div>\n`;
    prompt += `    </div>\n`;
    prompt += `  );\n`;
    prompt += `}\n`;
    prompt += `\`\`\`\n\n`;
    
    prompt += `**Critical points:**\n`;
    prompt += `- Add \`"use client";\` at the top of the file\n`;
    prompt += `- Create a wrapper div for EACH component listed above\n`;
    prompt += `- Use the exact \`gridRow\` and \`gridColumn\` values from the component list\n`;
    prompt += `- Don't skip any components - implement ALL ${sortedContents.length} components\n`;
    if (pages.length > 1) {
      prompt += `- Set up routing for the ${pages.length} pages using Next.js App Router\n`;
    }
    if (connections.length > 0) {
      prompt += `- Wire up the interactions listed in the Interactions section\n`;
    }
    prompt += `\n`;

    // Collect all unique component types across all pages
    const allComponents = pages.length > 1 
      ? pages.flatMap(page => page.contents)
      : sortedContents;
    const componentTypes = [...new Set(allComponents.map(c => c.type))];
    
    if (componentTypes.length > 0) {
      prompt += `Install components:\n`;
      prompt += `\`\`\`bash\n`;
      prompt += `npx shadcn@latest add ${componentTypes.join(' ')}\n`;
      prompt += `\`\`\`\n`;
    }

    return prompt;
  };

  const prompt = generatePrompt();

  // Initialize editable prompt when modal opens
  if (open && !editablePrompt) {
    setEditablePrompt(prompt);
  }

  // Reset when modal closes
  if (!open && editablePrompt) {
    setEditablePrompt("");
    setIsEditing(false);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editablePrompt : prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setEditablePrompt(prompt);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Export Layout Prompt</DialogTitle>
          <DialogDescription>
            {isEditing ? "Edit the prompt as needed" : "Copy this prompt to describe your layout to an AI agent or developer"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {isEditing ? (
            <textarea
              className="w-full h-full min-h-[400px] bg-neutral-100 p-4 rounded-lg text-xs font-mono border border-neutral-300 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-400"
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              spellCheck={false}
            />
          ) : (
            <pre className="bg-neutral-100 p-4 rounded-lg text-xs whitespace-pre-wrap font-mono border border-neutral-300">
              {prompt}
            </pre>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            {isEditing ? (
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Prompt
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleCopy}>
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

