import React from 'react';
import { Group, Line, Text } from 'react-konva';
import { calculateGeometryFromPoints, getPolygonArea, getBounds, formatRadian } from './utils';
import type { ShapeData } from './utils';

/**
 * Component to render the intersection area between two objects.
 * Includes visualization of the red polygon, X/Y reference axes, and dimension labels.
 * Supports click interactions (for dialog) and drag (to move the parent object).
 */
export const IntersectionShape = ({
  points,
  topShapeId,
  index,
  stageHeight,
  stageWidth,
  isDark,
  onDragMoveParent,
  onSelect
}: {
  points: number[];
  topShapeId: string;
  index: number;
  stageHeight: number;
  stageWidth: number;
  isDark: boolean;
  onDragMoveParent: (dx: number, dy: number, parentId: string) => void;
  onSelect: (data: ShapeData) => void;
}) => {
  const area = Math.round(getPolygonArea(points));
  const { angles } = calculateGeometryFromPoints(points);
  const sumAnglesRad = Object.values(angles).reduce((acc, curr) => acc + curr, 0);
  const sumAnglesDeg = Math.round((sumAnglesRad * 180) / Math.PI);
  
  const b = getBounds(points);
  const centerX = (b.minX + b.maxX) / 2;
  const centerY = (b.minY + b.maxY) / 2;
  const width = Math.round(b.maxX - b.minX);
  const height = Math.round(b.maxY - b.minY);
  const axisColor = isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)";
  const labelLetter = String.fromCharCode(67 + index); 

  return (
    <Group 
      draggable={true}
      /**
       * Drag Handler on Intersection Object (Object C).
       * Calls callback to parent to move the parent object.
       */
      onDragMove={(e) => {
        const dx = e.target.x();
        const dy = e.target.y();
        // Reset intersection group position so visual offset doesn't accumulate
        e.target.position({ x: 0, y: 0 });
        
        onDragMoveParent(dx, dy, topShapeId);
      }}
      onClick={(e) => {
        e.cancelBubble = true; 
        const { sides, angles } = calculateGeometryFromPoints(points);
        const intersectionData: ShapeData = {
          id: `intersection-${index}`,
          label: labelLetter,
          x: 0,
          y: 0,
          points: points,
          sides,
          angles,
          fillColor: "red"
        };
        onSelect(intersectionData);
      }}
      onMouseEnter={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "pointer";
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "default";
      }}
    >
      {/* X & Y Reference Lines for Intersection (Dashed) */}
      <Line 
        points={[b.minX, 0, b.minX, stageHeight]} 
        stroke={axisColor} 
        strokeWidth={2} 
        dash={[8, 8]}
        listening={false}
      />
      <Line 
        points={[0, b.maxY, stageWidth, b.maxY]} 
        stroke={axisColor} 
        strokeWidth={2} 
        dash={[8, 8]}
        listening={false}
      />

      {/* X and Y Dimension Labels */}
      <Text 
        x={centerX - 30} y={b.minY - 20} 
        text={`X: ${width}px`} 
        fill={isDark ? "#fff" : "#000"} fontSize={12} 
        fontStyle="italic bold" fontFamily="serif"
        align="center" width={60}
        listening={false}
      />
      <Text 
        x={b.maxX + 10} y={centerY - 10} 
        text={`Y: ${height}px`} 
        fill={isDark ? "#fff" : "#000"} fontSize={12} 
        fontStyle="italic bold" fontFamily="serif"
        listening={false}
      />

      {/* Intersection Polygon Visual (Red) */}
      <Line
        points={points}
        closed
        fill="red"
        opacity={0.6}
        stroke="red"
        strokeWidth={1}
        listening={true} 
      />
      {/* Object C / Intersection Label */}
      <Text 
        x={centerX - 60}
        y={centerY - 25}
        text={`${labelLetter}\nTotal ∠${sumAnglesDeg}° ${formatRadian(sumAnglesRad)}\nA = ${area} px²`}
        fill="white"
        fontSize={12}
        fontStyle="bold italic"
        fontFamily="serif"
        align="center"
        width={120}
        listening={false}
      />
    </Group>
  );
};
