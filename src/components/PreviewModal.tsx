"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GridContent } from "./WireframeGrid";
import ShadcnComponent from "./ShadcnComponent";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contents: GridContent[];
  rows: number;
  cols: number;
}

export default function PreviewModal({ open, onOpenChange, contents, rows, cols }: PreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden flex flex-col" style={{ maxWidth: "95vw", maxHeight: "90vh", width: "95vw" }}>
        <DialogHeader>
          <DialogTitle>Preview Layout</DialogTitle>
          <DialogDescription>
            Preview how your layout will look when rendered
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full border border-neutral-200 rounded-lg overflow-hidden bg-white">
            <div
              style={{
                display: "grid",
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                width: "100%",
                height: "100%",
                gap: "1rem",
                padding: "1rem"
              }}
            >
              {contents.map((content) => (
                <div
                  key={content.id}
                  className="[&>div:first-child]:border-0 [&>div:first-child]:rounded-none [&>*]:w-full [&>*]:h-full"
                  style={{
                    gridRow: `${content.position.row + 1} / ${content.position.row + content.span.rows + 1}`,
                    gridColumn: `${content.position.col + 1} / ${content.position.col + content.span.cols + 1}`,
                  }}
                >
                  <ShadcnComponent content={content} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

