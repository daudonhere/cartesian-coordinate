import React from 'react';
import { Line, Layer, Group, Text } from 'react-konva';

export function Ruler({ 
  length, 
  orientation, 
  step = 100,
  mode = 'standard',
  tickSide = 'out'
}: { 
  length: number; 
  orientation: 'horizontal' | 'vertical'; 
  step?: number;
  mode?: 'standard' | 'centered';
  tickSide?: 'in' | 'out';
}) {
  const ticks: React.ReactNode[] = [];
  const isHorizontal = orientation === 'horizontal';

  const renderTick = (pos: number, label: number) => {
    let flexDirection: 'column' | 'column-reverse' | 'row' | 'row-reverse' = 'column';
    if (isHorizontal) {
      flexDirection = tickSide === 'in' ? 'column-reverse' : 'column';
    } else {
      flexDirection = tickSide === 'in' ? 'row' : 'row-reverse';
    }

    const pixelPos = Math.round(pos);
    return (
      <div
        key={pos}
        className="absolute flex items-center justify-center select-none"
        style={{
          left: isHorizontal ? `${pixelPos}px` : '0',
          top: !isHorizontal ? `${pixelPos}px` : '0',
          width: isHorizontal ? 'auto' : '100%',
          height: isHorizontal ? '100%' : 'auto',
          transform: isHorizontal ? 'translateX(-50%)' : 'translateY(-50%)',
          flexDirection: flexDirection,
          gap: '2px'
        }}
      >
        <span 
          className="text-[9px] text-foreground font-serif italic font-bold leading-none whitespace-nowrap"
          style={{
            transform: isHorizontal ? 'none' : (tickSide === 'in' ? 'translateX(-2px)' : 'translateX(2px)')
          }}
        >
          {label} px
        </span>
        <div 
          className={`bg-foreground/50 shrink-0 ${isHorizontal ? 'w-px h-2' : 'h-px w-2'}`} 
        />
      </div>
    );
  };

  if (mode === 'centered') {
    const center = length / 2;
    for (let pos = center; pos <= length; pos += step) {
      ticks.push(renderTick(pos, Math.round(pos - center)));
    }
    for (let pos = center - step; pos >= 0; pos -= step) {
      ticks.push(renderTick(pos, Math.round(pos - center)));
    }
  } else {
    for (let i = 0; i <= length; i += step) {
      ticks.push(renderTick(i, i));
    }
  }

  return (
    <div className={`relative ${isHorizontal ? 'h-full w-full' : 'w-full h-full'}`}>
      {ticks}
    </div>
  );
}

export function GridLines({ 
  width, 
  height, 
  stroke,
  step = 100,
  centered = false
}: { 
  width: number; 
  height: number; 
  stroke: string;
  step?: number;
  centered?: boolean;
}) {
  const lines: React.ReactNode[] = [];
  const renderAxis = (limit: number, otherLimit: number, isVertical: boolean) => {
    const center = centered ? limit / 2 : 0;
    const draw = (pos: number) => {
      const pixelPos = Math.round(pos) + 0.5;
      lines.push(
        <Line 
          key={`${isVertical ? 'x' : 'y'}-${pos}`} 
          points={isVertical ? [pixelPos, 0, pixelPos, otherLimit] : [0, pixelPos, otherLimit, pixelPos]} 
          stroke={stroke} 
          strokeWidth={0.3} 
          dash={[2, 2]} 
        />
      );
    };
    for (let pos = center; pos <= limit; pos += step) draw(pos);
    if (centered) {
      for (let pos = center - step; pos >= 0; pos -= step) draw(pos);
    }
  };
  renderAxis(width, height, true);
  renderAxis(height, width, false);
  return <Layer listening={false}>{lines}</Layer>;
}

export const ShapeCenterSummary = ({
  label,
  area,
  totalAngleDeg,
  totalAngleRad,
  x,
  y,
  color
}: {
  label: string;
  area: number;
  totalAngleDeg: number;
  totalAngleRad: string;
  x: number;
  y: number;
  color: string;
}) => (
  <Group x={x} y={y}>
    <Text
      x={0}
      y={-35}
      text={label}
      width={120}
      align="center"
      fontSize={24}
      fontFamily="serif"
      fontStyle="italic bold"
      fill={color}
      offsetX={60}
    />
    <Text
      x={0}
      y={-10}
      text={`Total ∠${totalAngleDeg}° ${totalAngleRad}`}
      width={120}
      align="center"
      fontSize={11}
      fontFamily="serif"
      fontStyle="italic bold"
      fill={color}
      offsetX={60}
    />
    <Text
      x={0}
      y={5}
      text={`A = ${area} px²`}
      width={120}
      align="center"
      fontSize={11}
      fontFamily="serif"
      fontStyle="italic bold"
      fill={color}
      opacity={0.9}
      offsetX={60}
    />
  </Group>
);