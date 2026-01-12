import { useState, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type Konva from 'konva';
import { getRandomColor, calculateGeometryFromPoints } from './utils';
import type { ShapeData } from './utils';

interface UseShapeDrawingProps {
  setShapes: Dispatch<SetStateAction<ShapeData[]>>;
  setSelectedShape: Dispatch<SetStateAction<ShapeData | null>>;
}

export function useShapeDrawing({ setShapes, setSelectedShape }: UseShapeDrawingProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShapeStart, setNewShapeStart] = useState<{x: number, y: number} | null>(null);
  const [currentMousePos, setCurrentMousePos] = useState<{x: number, y: number} | null>(null);

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only start drawing if clicking on empty area (not on a shape)
    // and not right click
    if (e.target !== e.target.getStage()) return;
    if (e.evt.button !== 0) return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setIsDrawing(true);
    setNewShapeStart(pos);
    setCurrentMousePos(pos);
    setSelectedShape(null); // Deselect when starting to draw
  }, [setSelectedShape]);

  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setCurrentMousePos(pos);
    }
  }, [isDrawing]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !newShapeStart || !currentMousePos) {
        setIsDrawing(false);
        setNewShapeStart(null);
        setCurrentMousePos(null);
        return;
    }

    const x1 = newShapeStart.x;
    const y1 = newShapeStart.y;
    const x2 = currentMousePos.x;
    const y2 = currentMousePos.y;
    
    // Ensure minimal size to avoid creating 0 size shapes
    if (Math.abs(x2 - x1) < 5 || Math.abs(y2 - y1) < 5) {
        setIsDrawing(false);
        setNewShapeStart(null);
        setCurrentMousePos(null);
        return;
    }

    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    
    // Relative Points
    const points = [
        0, 0,
        width, 0,
        width, height,
        0, height
    ];

    const { sides, angles } = calculateGeometryFromPoints(points);
    const id = `shape-${Date.now()}`;
    
    setShapes(prev => {
        const nextLabel = String.fromCharCode(65 + (prev.length % 26));
        const newShape: ShapeData = {
          id,
          label: nextLabel,
          x: minX,
          y: minY,
          points: points,
          sides,
          angles,
          fillColor: getRandomColor()
        };
        return [...prev, newShape];
    });
    
    // Reset drawing state
    setIsDrawing(false);
    setNewShapeStart(null);
    setCurrentMousePos(null);
  }, [isDrawing, newShapeStart, currentMousePos, setShapes]);

  return {
    isDrawing,
    newShapeStart,
    currentMousePos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}
