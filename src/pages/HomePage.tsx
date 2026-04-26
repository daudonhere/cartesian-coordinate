import { useState, useMemo, useEffect, useRef } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import type Konva from 'konva'
import { ModeToggle } from "@/components/mode-toggle"
import { useTheme } from "@/components/theme-provider"

import { calculateAllIntersections } from "@/lib/konva/utils"
import type { ShapeData } from "@/lib/konva/utils"
import { Ruler, GridLines } from "@/lib/konva/components"
import { KonvaShape } from "@/lib/konva/KonvaShape"
import { IntersectionShape } from "@/lib/konva/IntersectionShape"
import { InfoCard } from "@/lib/konva/InfoCard"
import { DetailDialog } from "@/lib/konva/DetailDialog"
import { useShapeDrawing } from "@/lib/konva/useShapeDrawing"
import { useCanvasSync } from "@/lib/konva/useCanvasSync"

export function HomePage() {
  const { theme } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 1000, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { shapes, setShapes, userId } = useCanvasSync();
  
  const [selectedShape, setSelectedShape] = useState<ShapeData | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<Konva.Node | null>(null);

  const { 
    isDrawing, 
    newShapeStart, 
    currentMousePos, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp 
  } = useShapeDrawing({ setShapes, setSelectedShape });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: Math.max(clientWidth - 80, 300),
          height: Math.max(clientHeight - 80, 200)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const allObjects = useMemo(() => {
    const intersections = calculateAllIntersections(shapes);
    const combined = [...shapes, ...intersections];
    return combined.map((obj, index) => ({
      ...obj,
      displayLabel: String.fromCharCode(65 + index)
    }));
  }, [shapes]);

  const shapesWithLabels = allObjects.filter(obj => !obj.isIntersection);
  const intersectionsWithLabels = allObjects.filter(obj => obj.isIntersection);

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

  useEffect(() => {
    if (hoveredNode) {
      const container = hoveredNode.getStage()?.container();
      if (container) {
        const isVertex = hoveredNode.name() === 'vertex-circle';
        container.style.cursor = isVertex 
            ? (isShiftPressed ? 'cell' : 'pointer')
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

  const stageWidth = dimensions.width;
  const stageHeight = dimensions.height;

  return (
    <div className="relative h-screen w-full bg-background text-foreground flex flex-col overflow-hidden font-sans p-4 md:p-8">
      <div className="absolute top-4 right-4 z-20">
        <ModeToggle />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center gap-6 overflow-hidden w-full max-w-7xl mx-auto">
        <InfoCard hasShapes={shapes.length > 0} onClear={handleClear} />

        <div ref={containerRef} className="flex-1 w-full flex items-center justify-center min-h-0 overflow-hidden">
          <div className="relative p-10 bg-transparent shrink-0">
            <div className="absolute top-0 left-10 right-10 h-10 flex items-end pb-1">
              <Ruler length={stageWidth} orientation="horizontal" mode="centered" step={50} tickSide="out" />
            </div>
            <div className="absolute left-0 top-10 bottom-10 w-10 flex justify-end pr-1">
              <Ruler length={stageHeight} orientation="vertical" mode="centered" step={50} tickSide="in" />
            </div>
            <div className="absolute right-0 top-10 bottom-10 w-10 flex justify-start pl-1">
              <Ruler length={stageHeight} orientation="vertical" mode="centered" step={50} tickSide="out" />
            </div>
            <div className="absolute bottom-0 left-10 right-10 h-10 flex items-start pt-1">
              <Ruler length={stageWidth} orientation="horizontal" mode="centered" step={50} tickSide="in" />
            </div>

            <div className="border border-border bg-canvas relative z-10 shadow-lg cursor-default overflow-hidden" style={{ width: stageWidth + 2, height: stageHeight + 2 }}>
              <Stage 
                  width={stageWidth} 
                  height={stageHeight}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
              >
                <GridLines width={stageWidth} height={stageHeight} stroke={gridColor} step={50} centered />
                <Layer>
                  {shapesWithLabels.map((shape) => (
                    <KonvaShape 
                      key={shape.id}
                      shape={{ ...shape, label: shape.displayLabel }}
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

                  {intersectionsWithLabels.map((shape) => (
                    <IntersectionShape
                      key={shape.id}
                      points={shape.points}
                      topShapeId={shape.id} 
                      label={shape.displayLabel}
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
