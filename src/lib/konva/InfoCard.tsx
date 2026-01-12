import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MousePointerClick, Move, Expand, Info, Trash2 } from "lucide-react"

interface InfoCardProps {
  hasShapes: boolean;
  onClear: () => void;
}

export function InfoCard({ hasShapes, onClear }: InfoCardProps) {
  return (
    <Card className="w-full max-w-[1080px] shrink-0 shadow-sm border-muted/40">
      <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-bold tracking-tight">Cartesian Coordinate System</CardTitle>
            <p className="text-xs text-muted-foreground">Interactive geometry engine powered by React & Konva</p>
        </div>
        {hasShapes && (
            <Button 
                onClick={onClear} 
                variant="destructive"
                size="sm"
                className="h-8 text-xs gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Clear Canvas
            </Button>
          )}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted/30 border border-muted hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                        <MousePointerClick className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Create</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Click and drag anywhere on the empty canvas to draw a new rectangle.
                </p>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted/30 border border-muted hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                        <Move className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Move</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Drag any shape to reposition it. Overlaps are detected automatically.
                </p>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted/30 border border-muted hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                        <Expand className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Modify</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Hold <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">SHIFT</kbd> and drag the corner vertices to reshape the polygon.
                </p>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted/30 border border-muted hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                        <Info className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Inspect</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Click on any shape (including red intersections) to view geometric details.
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
