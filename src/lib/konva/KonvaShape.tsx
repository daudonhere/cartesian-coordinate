import Konva from 'konva';
import { Group, Line, Text, Circle } from 'react-konva';
import { getBounds, getPolygonArea, getSideLabelPos, getVertexLabelPos, calculateGeometryFromPoints, formatRadian } from './utils';
import type { ShapeData } from './utils';
import { ShapeCenterSummary } from './components';

export const KonvaShape = ({ 
  shape, 
  strokeColor, 
  textColor, 
  onClick,
  onUpdate,
  setHoveredNode,
  draggable = false,
  forceCenter = false,
  isShiftPressed = false,
  stageWidth = 1000,
  stageHeight = 400,
  showDetailedLabels = true,
  showSummary = true
}: { 
  shape: ShapeData; 
  strokeColor: string; 
  textColor: string; 
  onClick?: (shape: ShapeData) => void;
  onUpdate?: (newShape: ShapeData) => void;
  setHoveredNode: (node: Konva.Node | null) => void;
  draggable?: boolean;
  forceCenter?: boolean;
  isShiftPressed?: boolean;
  stageWidth?: number;
  stageHeight?: number;
  showDetailedLabels?: boolean;
  showSummary?: boolean;
}) => {
  const { x, y, points, sides, angles, label } = shape;
  const [ax, ay, bx, by, cx, cy, dx, dy] = points;
  
  const b = getBounds(points);
  const midX = (b.minX + b.maxX) / 2;
  const midY = (b.minY + b.maxY) / 2;
  
  const centerX = midX;
  const centerY = midY;
  const area = getPolygonArea(points);
  
  const sumAnglesRad = angles.a + angles.b + angles.c + angles.d;
  const sumAnglesDeg = Math.round((sumAnglesRad * 180) / Math.PI);

  const vertices = [
    { x: ax, y: ay, label: 'A', ang: angles.a, idx: 0 },
    { x: bx, y: by, label: 'B', ang: angles.b, idx: 1 },
    { x: cx, y: cy, label: 'C', ang: angles.c, idx: 2 },
    { x: dx, y: dy, label: 'D', ang: angles.d, idx: 3 },
  ];

  const getDynamicOffset = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    return dy > dx ? 35 : 20;
  };

  const posAB = getSideLabelPos(ax, ay, bx, by, centerX, centerY, getDynamicOffset(ax, ay, bx, by));
  const posBC = getSideLabelPos(bx, by, cx, cy, centerX, centerY, getDynamicOffset(bx, by, cx, cy));
  const posCD = getSideLabelPos(cx, cy, dx, dy, centerX, centerY, getDynamicOffset(cx, cy, dx, dy));
  const posDA = getSideLabelPos(dx, dy, ax, ay, centerX, centerY, getDynamicOffset(dx, dy, ax, ay));

  const groupX = forceCenter ? 0 : x;
  const groupY = forceCenter ? 0 : y;
  
  const offset = forceCenter ? { x: centerX, y: centerY } : { x: 0, y: 0 };

  const handlePointDragMove = (idx: number, e: { target: { x: () => number; y: () => number } }) => {
    const node = e.target;
    const newPoints = [...points];
    newPoints[idx * 2] = node.x();
    newPoints[idx * 2 + 1] = node.y();
    
    const { sides: newSides, angles: newAngles } = calculateGeometryFromPoints(newPoints);
    
    if (onUpdate) {
      onUpdate({
        ...shape,
        points: newPoints,
        sides: newSides,
        angles: newAngles
      });
    }
  };

  return (
    <Group 
      x={groupX} y={groupY} 
      draggable={draggable}
      offset={offset}
      dragBoundFunc={(pos) => {
        const newX = Math.max(-b.minX, Math.min(pos.x, stageWidth - b.maxX));
        const newY = Math.max(-b.minY, Math.min(pos.y, stageHeight - b.maxY));
        
        return { x: newX, y: newY };
      }}
      onDragMove={(e) => {
        if (e.target.nodeType === 'Group') {
           onUpdate?.({
             ...shape,
             x: e.target.x(),
             y: e.target.y()
           });
        }
      }}
      onClick={() => onClick?.(shape)}
      onTap={() => onClick?.(shape)}
      onMouseEnter={(e) => {
        setHoveredNode(e.target);
        if (!draggable) {
           const container = e.target.getStage()?.container();
           if (container) container.style.cursor = "default";
           return;
        }
        if (e.target.className !== 'vertex-circle') {
           const container = e.target.getStage()?.container();
           if (container) container.style.cursor = "pointer";
        }
      }}
      onMouseLeave={(e) => {
        setHoveredNode(null);
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "default";
      }}
    >
      <Line
        points={points}
        closed
        stroke={strokeColor}
        strokeWidth={1}
        fill={shape.fillColor || "transparent"}
        opacity={0.5}
      />

      {showDetailedLabels && (
        <>
          <Text 
            x={posAB.x} y={posAB.y} 
            text={`AB ${sides.ab}px`} 
            fontSize={10} fontFamily="serif" fontStyle="italic bold" fill={textColor} 
            width={120} align="center" offsetX={60} offsetY={5}
          />
          <Text 
            x={posBC.x} y={posBC.y} 
            text={`BC ${sides.bc}px`} 
            fontSize={10} fontFamily="serif" fontStyle="italic bold" fill={textColor} 
            width={120} align="center" offsetX={60} offsetY={5}
          />
          <Text 
            x={posCD.x} y={posCD.y} 
            text={`CD ${sides.cd}px`} 
            fontSize={10} fontFamily="serif" fontStyle="italic bold" fill={textColor} 
            width={120} align="center" offsetX={60} offsetY={5}
          />
          <Text 
            x={posDA.x} y={posDA.y} 
            text={`DA ${sides.da}px`} 
            fontSize={10} fontFamily="serif" fontStyle="italic bold" fill={textColor} 
            width={120} align="center" offsetX={60} offsetY={5}
          />
        </>
      )}

      {vertices.map((v) => {
        const outerPos = getVertexLabelPos(v.x, v.y, centerX, centerY, 30);
        const innerPos = getVertexLabelPos(v.x, v.y, centerX, centerY, -30);

        return (
          <Group key={v.idx}>
             <Circle 
                name="vertex-circle"
                x={v.x} y={v.y} 
                radius={6} 
                fill="transparent" 
                stroke="transparent"
                draggable={draggable && isShiftPressed}
                dragBoundFunc={(pos) => {
                  return {
                    x: Math.max(0, Math.min(pos.x, stageWidth)),
                    y: Math.max(0, Math.min(pos.y, stageHeight))
                  };
                }}
                onDragMove={(e) => handlePointDragMove(v.idx, e)}
                onMouseEnter={(e) => {
                  setHoveredNode(e.target);
                  const node = e.target as unknown as { fill: (color: string) => void };
                  node.fill('red'); 
                  const container = e.target.getStage()!.container();
                  if (draggable) {
                    container.style.cursor = 'crosshair'; 
                  } else {
                    container.style.cursor = 'default';
                  }
                }}
                onMouseLeave={(e) => {
                  setHoveredNode(null);
                  const node = e.target as unknown as { fill: (color: string) => void };
                  node.fill('transparent');
                  const container = e.target.getStage()?.container();
                  if (container) container.style.cursor = "default";
                }}
             />
             <Circle x={v.x} y={v.y} radius={3} fill={strokeColor} listening={false} />
             
             {showDetailedLabels && (
               <>
                 <Text 
                   x={outerPos.x} 
                   y={outerPos.y}
                   text={`∠${v.label} ${Math.round(v.ang * 180 / Math.PI)}°`} 
                   fontSize={12} fontFamily="serif" fontStyle="italic bold" fill={textColor}
                   offsetX={25} offsetY={6}
                 />
                 <Text 
                   x={innerPos.x} 
                   y={innerPos.y}
                   text={formatRadian(v.ang)}
                   fontSize={11} fontFamily="serif" fontStyle="italic" fill={textColor} 
                   opacity={0.9}
                   offsetX={10} offsetY={6}
                 />
               </>
             )}
          </Group>
        );
      })}

      {showSummary && (
        <ShapeCenterSummary 
           label={label}
           area={area}
           totalAngleDeg={sumAnglesDeg}
           totalAngleRad={formatRadian(sumAnglesRad)}
           x={centerX}
           y={centerY}
           color={textColor}
        />
      )}

    </Group>
  );
};