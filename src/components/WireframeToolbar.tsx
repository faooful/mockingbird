"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WireframeToolbarProps {
  rows: number;
  cols: number;
  contentCount: number;
  onAddRow: () => void;
  onRemoveRow: () => void;
  onAddCol: () => void;
  onRemoveCol: () => void;
  onClearAll: () => void;
  onExport: () => void;
}

export default function WireframeToolbar({
  rows,
  cols,
  contentCount,
  onAddRow,
  onRemoveRow,
  onAddCol,
  onRemoveCol,
  onClearAll,
  onExport
}: WireframeToolbarProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* Grid Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Grid:</span>
            <div className="flex items-center gap-1">
              <span className="text-sm">Rows:</span>
              <Button variant="outline" size="sm" onClick={onRemoveRow} disabled={rows <= 1}>
                -
              </Button>
              <span className="text-sm w-8 text-center">{rows}</span>
              <Button variant="outline" size="sm" onClick={onAddRow}>+</Button>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-sm">Cols:</span>
              <Button variant="outline" size="sm" onClick={onRemoveCol} disabled={cols <= 1}>
                -
              </Button>
              <span className="text-sm w-8 text-center">{cols}</span>
              <Button variant="outline" size="sm" onClick={onAddCol}>+</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="text-sm text-muted-foreground">
            Grid: {cols}×{rows} | {contentCount} content{contentCount !== 1 ? 's' : ''} added
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClearAll} disabled={contentCount === 0}>
            Clear All
          </Button>
          <Button variant="outline" size="sm" onClick={onExport} disabled={contentCount === 0}>
            Export
          </Button>
        </div>
      </div>
    </Card>
  );
}
