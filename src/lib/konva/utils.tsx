import { intersection } from 'martinez-polygon-clipping'

export interface ShapeData {
  id: string;
  label: string;
  x: number;
  y: number;
  points: number[];
  sides: {
    ab: number;
    bc: number;
    cd: number;
    da: number;
  };
  angles: {
    a: number;
    b: number;
    c: number;
    d: number;
    aRadStr: string;
    bRadRadStr: string;
    cRadStr: string;
    dRadStr: string;
  };
  area: number;
  totalAngleDeg: number;
  totalAngleRadStr: string;
  fillColor?: string;
  isIntersection?: boolean; 
}

export const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
};

export const formatRadian = (rad: number) => {
  const piVal = rad / Math.PI;
  if (Math.abs(piVal - 1) < 0.001) return "π";
  if (Math.abs(piVal - 0.5) < 0.001) return "π/2";
  if (Math.abs(piVal - 2) < 0.001) return "2π";
  return `${piVal.toFixed(2)}π`;
};

export const getPolygonArea = (points: number[]) => {
  let area = 0;
  for (let i = 0; i < points.length; i += 2) {
    const x1 = points[i];
    const y1 = points[i + 1];
    const x2 = points[(i + 2) % points.length];
    const y2 = points[(i + 3) % points.length];
    area += (x1 * y2 - x2 * y1);
  }
  return Math.abs(area / 2);
};

export const getSideLabelPos = (x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, offset: number) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  let nx = -dy;
  let ny = dx;
  if (nx * (midX - cx) + ny * (midY - cy) < 0) {
    nx = -nx;
    ny = -ny;
  }
  const len = Math.sqrt(nx*nx + ny*ny);
  const scale = len ? offset / len : 0;
  return { x: midX + nx * scale, y: midY + ny * scale };
};

export const getVertexLabelPos = (vx: number, vy: number, cx: number, cy: number, offset: number) => {
  const dx = vx - cx;
  const dy = vy - cy;
  const len = Math.sqrt(dx*dx + dy*dy);
  const scale = len ? offset / len : 0;
  return { x: vx + dx * scale, y: vy + dy * scale };
};

export const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const getAngle = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => {
  const ab = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
  const bc = Math.sqrt(Math.pow(bx - cx, 2) + Math.pow(by - cy, 2));
  const ac = Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2));
  const val = (ab * ab + bc * bc - ac * ac) / (2 * ab * bc);
  return Math.acos(Math.max(-1, Math.min(1, val)));
};

export const calculateGeometryFromPoints = (points: number[]) => {
  const [ax, ay, bx, by, cx, cy, dx, dy] = points;
  
  const sides = {
    ab: Math.round(getDistance(ax, ay, bx, by)),
    bc: Math.round(getDistance(bx, by, cx, cy)),
    cd: Math.round(getDistance(cx, cy, dx, dy)),
    da: Math.round(getDistance(dx, dy, ax, ay)),
  };

  const angleA = getAngle(dx, dy, ax, ay, bx, by);
  const angleB = getAngle(ax, ay, bx, by, cx, cy);
  const angleC = getAngle(bx, by, cx, cy, dx, dy);
  const angleD = getAngle(cx, cy, dx, dy, ax, ay);

  const angles = {
    a: angleA,
    b: angleB,
    c: angleC,
    d: angleD,
    aRadStr: formatRadian(angleA),
    bRadRadStr: formatRadian(angleB),
    cRadStr: formatRadian(angleC),
    dRadStr: formatRadian(angleD),
  };

  const area = Math.round(getPolygonArea(points));
  const totalAngleRad = angleA + angleB + angleC + angleD;

  return { 
    sides, 
    angles, 
    area, 
    totalAngleDeg: Math.round((totalAngleRad * 180) / Math.PI),
    totalAngleRadStr: formatRadian(totalAngleRad)
  };
};

export const getBounds = (points: number[]) => {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < points.length; i += 2) {
    const px = points[i], py = points[i+1];
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);
    minY = Math.min(minY, py);
    maxY = Math.max(maxY, py);
  }
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
};

export const getSignedArea = (coords: number[][]) => {
  let area = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    area += coords[i][0] * coords[i + 1][1] - coords[i + 1][0] * coords[i][1];
  }
  return area / 2;
};

export const getIntersectionPoints = (shape1Points: number[], shape2Points: number[]): number[][] | null => {
  const toCoordinates = (pts: number[]) => {
    const coords: [number, number][] = [];
    for (let i = 0; i < pts.length; i += 2) {
      coords.push([pts[i], pts[i + 1]]);
    }
    if (coords.length > 0 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
       coords.push([coords[0][0], coords[0][1]]);
    }
    if (getSignedArea(coords) < 0) coords.reverse();
    return [coords];
  };

  const poly1 = toCoordinates(shape1Points);
  const poly2 = toCoordinates(shape2Points);
  const result = intersection(poly1, poly2);

  if (!result || result.length === 0) return null;
  
  let polygons: number[][][][] = [];
  if (Array.isArray(result[0]) && Array.isArray(result[0][0]) && typeof result[0][0][0] === 'number') {
     polygons = [result as unknown as number[][][]];
  } else {
     polygons = result as unknown as number[][][][];
  }

  return polygons.map((polygon) => {
      const flatPoints: number[] = [];
      const ring = polygon[0]; 
      for (const point of ring) {
          const [x, y] = point;
          flatPoints.push(x, y);
      }
      return flatPoints;
  });
};

export const calculateAllIntersections = (shapes: ShapeData[]): ShapeData[] => {
  const results: ShapeData[] = [];
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const s1 = shapes[i];
      const s2 = shapes[j];
      
      const absPoints1 = s1.points.map((p, idx) => p + (idx % 2 === 0 ? s1.x : s1.y));
      const absPoints2 = s2.points.map((p, idx) => p + (idx % 2 === 0 ? s2.x : s2.y));
      
      const intersects = getIntersectionPoints(absPoints1, absPoints2);
      if (intersects) {
        intersects.forEach((points, idx) => {
            const geo = calculateGeometryFromPoints(points);
            results.push({
                id: `intersection-${s1.id}-${s2.id}-${idx}`,
                label: `Overlap ${s1.label}&${s2.label}`,
                x: 0,
                y: 0,
                points,
                ...geo,
                fillColor: "red",
                isIntersection: true
            });
        });
      }
    }
  }
  return results;
};