import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface InfoCardProps {
  hasShapes: boolean;
  onClear: () => void;
}

export function InfoCard({ hasShapes, onClear }: InfoCardProps) {
  return (
    <Card className="w-full max-w-270 shrink-0 shadow-sm min-h-[120px]">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-3">
          <header className="shrink-0 flex items-center gap-4">
            <h1 className="text-lg font-medium tracking-widest uppercase opacity-90">Cartesian Coordinate Using KonvaJS</h1>
          </header>
          {hasShapes && (
            <Button 
                onClick={onClear} 
                className="h-7 px-4 bg-red-600 text-white hover:bg-red-700 border-none cursor-pointer text-xs"
              >
                Clear All
            </Button>
          )}
        </div>

        <div className="bg-muted/20 rounded p-3 flex-1 flex items-center justify-center border border-dashed border-foreground/10">
             <div className="flex flex-wrap md:flex-row items-center justify-around w-full gap-x-6 gap-y-3">
                
                {/* Step 1 */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 text-[10px] font-bold border border-blue-500/50">1</div>
                    <div className="flex flex-col">
                        <span className="text-foreground uppercase tracking-tighter text-[8px] opacity-60 leading-none">Create</span>
                        <span className="italic text-[11px] whitespace-nowrap">Click & Drag on canvas to draw</span>
                    </div>
                </div>

                <div className="h-6 w-px bg-foreground/10 hidden lg:block" />

                {/* Step 2 */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px] font-bold border border-green-500/50">2</div>
                    <div className="flex flex-col">
                        <span className="text-foreground uppercase tracking-tighter text-[8px] opacity-60 leading-none">Move</span>
                        <span className="italic text-[11px] whitespace-nowrap">Drag shapes to reposition them</span>
                    </div>
                </div>

                <div className="h-6 w-px bg-foreground/10 hidden lg:block" />

                {/* Step 3 */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-[10px] font-bold border border-amber-500/50">3</div>
                    <div className="flex flex-col">
                        <span className="text-foreground uppercase tracking-tighter text-[8px] opacity-60 leading-none">Modify</span>
                        <span className="italic text-amber-500 text-[11px] whitespace-nowrap font-medium">Hold SHIFT to drag corners</span>
                    </div>
                </div>

                <div className="h-6 w-px bg-foreground/10 hidden lg:block" />

                {/* Step 4 */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 text-[10px] font-bold border border-purple-500/50">4</div>
                    <div className="flex flex-col">
                        <span className="text-foreground uppercase tracking-tighter text-[8px] opacity-60 leading-none">Inspect</span>
                        <span className="italic text-[11px] whitespace-nowrap">Click shape to see detailed info</span>
                    </div>
                </div>

            </div>
        </div>
      </CardContent>
    </Card>
  );
}