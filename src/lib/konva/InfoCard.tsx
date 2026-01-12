import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MousePointerClick, Move, Expand, Info, Trash2 } from "lucide-react"

interface InfoCardProps {
  hasShapes: boolean;
  onClear: () => void;
}

export function InfoCard({ hasShapes, onClear }: InfoCardProps) {
  return (
    <Card className="w-full max-w-[1080px] shrink-0 shadow-sm border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-black dark:text-white">
      <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-bold tracking-tight">Cartesian Coordinate System</CardTitle>
            <p className="text-xs opacity-60">Interactive geometry engine powered by React & Konva</p>
        </div>
        {hasShapes && (
            <Button 
                onClick={onClear} 
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear Canvas
            </Button>
          )}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-neutral-200 dark:bg-neutral-800">
                        <MousePointerClick className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Create</span>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">
                    Click and drag anywhere on the empty canvas to draw a new rectangle.
                </p>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-neutral-200 dark:bg-neutral-800">
                        <Move className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Move</span>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">
                    Drag any shape to reposition it. Overlaps are detected automatically.
                </p>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-neutral-200 dark:bg-neutral-800">
                        <Expand className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Modify</span>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">
                    Hold <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-1.5 font-mono text-[10px] font-medium opacity-100">SHIFT</kbd> and drag the corner vertices to reshape.
                </p>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-neutral-200 dark:bg-neutral-800">
                        <Info className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Inspect</span>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">
                    Click on any shape (including red intersections) to view geometric details.
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}