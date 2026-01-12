import { useState, useMemo, useEffect } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import type Konva from 'konva'
import { ModeToggle } from "@/components/mode-toggle"
import { useTheme } from "@/components/theme-provider"

// Import extracted modules from /lib/konva
import { calculateAllIntersections } from "@/lib/konva/utils"
import { Ruler, GridLines } from "@/lib/konva/components"
import { KonvaShape } from "@/lib/konva/KonvaShape"
import { IntersectionShape } from "@/lib/konva/IntersectionShape"
import { InfoCard } from "@/lib/konva/InfoCard"
import { DetailDialog } from "@/lib/konva/DetailDialog"
import { useShapeDrawing } from "@/lib/konva/useShapeDrawing"
import { useCanvasSync } from "@/lib/konva/useCanvasSync"

/**
 * Main Page HomePage.
 */
export function HomePage() {
  const { theme } = useTheme();
  const stageWidth = 1000;
  const stageHeight = 400;

  // Use Canvas Sync for state management (Local & DB)
  const { shapes, setShapes, userId } = useCanvasSync();
  
  // State for the currently selected object
  const [selectedShape, setSelectedShape] = useState<any>(null);
  // Shift key state for vertex edit mode
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  // Hovered node state for cursor management
  const [hoveredNode, setHoveredNode] = useState<Konva.Node | null>(null);

  // Use custom hook for drawing logic
  const { 
    isDrawing, 
    newShapeStart, 
    currentMousePos, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp 
  } = useShapeDrawing({ setShapes, setSelectedShape });

  /**
   * Intersection calculation.
   */
  const intersectionShapes = useMemo(() => {
    return calculateAllIntersections(shapes);
  }, [shapes]);

  /**
   * Keyboard SHIFT detection.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  /**
   * Cursor management.
   */
  useEffect(() => {
    if (hoveredNode) {
      const container = hoveredNode.getStage()?.container();
      if (container) {
        const isVertex = hoveredNode.name() === 'vertex-circle';
        container.style.cursor = isVertex 
            ? (isShiftPressed ? 'crosshair' : 'pointer')
            : 'pointer';
      }
    }
  }, [isShiftPressed, hoveredNode]);

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const gridColor = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";
  const strokeColor = isDark ? "white" : "black";
  const textColor = isDark ? "#cccccc" : "#333333";

  const handleClear = () => setShapes([]);

  const handleDeleteShape = (id: string) => {
    setShapes(prev => prev.filter(s => s.id !== id));
    setSelectedShape(null); 
  };

  const handleDragParent = (dx: number, dy: number, parentId: string) => {
    setShapes(prev => prev.map(s => {
      if (s.id === parentId) {
        return { ...s, x: s.x + dx, y: s.y + dy };
      }
      return s;
    }));
  };

  return (
    <div className="relative h-screen w-full bg-background text-foreground flex flex-col overflow-hidden font-sans">
      <div className="absolute top-4 right-4 z-20">
        <ModeToggle />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4 overflow-hidden">
        <InfoCard hasShapes={shapes.length > 0} onClear={handleClear} />

        <div className="relative p-10 bg-transparent shrink-0">
          <div className="absolute top-0 left-10 right-10 h-10 flex items-end pb-1"><Ruler length={stageWidth} orientation="horizontal" mode="centered" step={50} tickSide="out" /></div>
          <div className="absolute left-0 top-10 bottom-10 w-10 flex justify-end pr-1"><Ruler length={stageHeight} orientation="vertical" step={50} tickSide="in" /></div>
          <div className="absolute right-0 top-10 bottom-10 w-10 flex justify-start pl-1"><Ruler length={stageHeight} orientation="vertical" mode="centered" step={50} tickSide="out" /></div>
          <div className="absolute bottom-0 left-10 right-10 h-10 flex items-start pt-1"><Ruler length={stageWidth} orientation="horizontal" step={50} tickSide="in" /></div>

          <div className="border bg-canvas relative z-10 shadow-lg cursor-crosshair" style={{ width: stageWidth, height: stageHeight }}>
            <Stage 
                width={stageWidth} 
                height={stageHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
              <GridLines width={stageWidth} height={stageHeight} stroke={gridColor} step={50} />
              <Layer>
                {shapes.map((shape) => (
                  <KonvaShape 
                    key={shape.id}
                    shape={shape}
                    strokeColor={strokeColor}
                    textColor={textColor}
                    onClick={setSelectedShape}
                    onUpdate={(updatedShape) => {
                      setShapes(prev => prev.map(s => s.id === updatedShape.id ? updatedShape : s));
                    }}
                    setHoveredNode={setHoveredNode}
                    draggable
                    isShiftPressed={isShiftPressed}
                    stageWidth={stageWidth}
                    stageHeight={stageHeight}
                  />
                ))}

                {intersectionShapes.map((shape, i) => (
                  <IntersectionShape
                    key={`intersect-${i}`}
                    points={shape.points}
                    topShapeId={shape.id} // Note: This mapping depends on calculateAllIntersections logic
                    index={i}
                    stageHeight={stageHeight}
                    stageWidth={stageWidth}
                    isDark={isDark}
                    onDragMoveParent={handleDragParent}
                    onSelect={setSelectedShape}
                  />
                ))}
                
                {isDrawing && newShapeStart && currentMousePos && (
                    <Rect
                        x={Math.min(newShapeStart.x, currentMousePos.x)}
                        y={Math.min(newShapeStart.y, currentMousePos.y)}
                        width={Math.abs(currentMousePos.x - newShapeStart.x)}
                        height={Math.abs(currentMousePos.y - newShapeStart.y)}
                        stroke={strokeColor}
                        strokeWidth={2}
                        dash={[5, 5]}
                        opacity={0.7}
                    />
                )}
              </Layer>
            </Stage>
          </div>
        </div>
        <div className="text-[10px] opacity-30 font-mono">User ID: {userId}</div>
      </div>
      
      <DetailDialog 
        selectedShape={selectedShape} 
        onClose={() => setSelectedShape(null)} 
        onDelete={handleDeleteShape}
        isShapeExists={!!selectedShape && shapes.some(s => s.id === selectedShape.id)}
      />
    </div>
  )
}
