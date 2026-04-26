import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MousePointerClick, Hand, Plus, Pointer, Trash2 } from "lucide-react"

interface InfoCardProps {
  hasShapes: boolean;
  onClear: () => void;
}

export function InfoCard({ hasShapes, onClear }: InfoCardProps) {
  return (
    <Card className="w-full max-w-[1080px] shrink-0 shadow-sm border-border bg-card text-card-foreground">
      <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-bold tracking-tight">Cartesian Coordinate System</CardTitle>
            <p className="text-xs text-muted-foreground">Interactive geometry engine powered by React & Konva</p>
        </div>
        {hasShapes && (
            <Button 
                onClick={onClear} 
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-2 border-input hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Clear Canvas
            </Button>
          )}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-muted">
                        <MousePointerClick className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">Create</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Click and drag anywhere on the empty canvas to draw a new rectangle.
                </p>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-muted">
                        <Hand className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">Move</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Drag any shape to reposition it. Overlaps are detected automatically.
                </p>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-muted">
                        <Plus className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">Modify</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Hold <strong className="font-bold text-foreground">SHIFT</strong> and drag the corner vertices to reshape.
                </p>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-muted">
                        <Pointer className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">Inspect</span>
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