import { Stage, Layer, Group } from 'react-konva';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { KonvaShape } from './KonvaShape';
import { getBounds, formatRadian } from './utils';
import type { ShapeData } from './utils';

interface DetailDialogProps {
  selectedShape: ShapeData | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  isShapeExists: boolean;
}

export function DetailDialog({ selectedShape, onClose, onDelete, isShapeExists }: DetailDialogProps) {
  if (!selectedShape) return null;

  const bounds = getBounds(selectedShape.points);
  const padding = 40; 
  const scaleX = (400 - padding) / (bounds.width || 1);
  const scaleY = (300 - padding) / (bounds.height || 1);
  const scale = Math.min(scaleX, scaleY, 1.5);

  const noop = () => {};

  return (
    <Dialog open={!!selectedShape} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-fit w-auto">
        <DialogHeader>
          <DialogTitle>Shape Information</DialogTitle>
          <DialogDescription>
            Details about the selected shape.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
            <div className="border rounded-md overflow-hidden bg-background self-center">
              <Stage width={400} height={300}>
                <Layer>
                  <Group x={200} y={150} scaleX={scale} scaleY={scale}>
                    <KonvaShape 
                        shape={selectedShape} 
                        strokeColor="white" 
                        textColor="white"
                        forceCenter
                        setHoveredNode={noop}
                        stageWidth={400} 
                        stageHeight={300}
                        showDetailedLabels={false}
                        showSummary={true}
                    />
                  </Group>
                </Layer>
              </Stage>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm px-4 whitespace-nowrap">
              <div className="space-y-2">
                  <h3 className="font-medium text-muted-foreground border-b pb-1 mb-2">Sides Lengths</h3>
                  <div className="grid grid-cols-2 gap-4 italic font-bold font-serif">
                    <div>AB = <span>{selectedShape.sides.ab}</span> px</div>
                    <div>BC = <span>{selectedShape.sides.bc}</span> px</div>
                    <div>CD = <span>{selectedShape.sides.cd}</span> px</div>
                    <div>DA = <span>{selectedShape.sides.da}</span> px</div>
                  </div>
              </div>

              <div className="space-y-2">
                  <h3 className="font-medium text-muted-foreground border-b pb-1 mb-2">Angles Degrees & Radians</h3>
                  <div className="grid grid-cols-2 gap-4 italic font-bold font-serif">
                    <div>∠A = {Math.round(selectedShape.angles.a * 180 / Math.PI)}° <span className="ml-1">{formatRadian(selectedShape.angles.a)}</span></div>
                    <div>∠B = {Math.round(selectedShape.angles.b * 180 / Math.PI)}° <span className="ml-1">{formatRadian(selectedShape.angles.b)}</span></div>
                    <div>∠C = {Math.round(selectedShape.angles.c * 180 / Math.PI)}° <span className="ml-1">{formatRadian(selectedShape.angles.c)}</span></div>
                    <div>∠D = {Math.round(selectedShape.angles.d * 180 / Math.PI)}° <span className="ml-1">{formatRadian(selectedShape.angles.d)}</span></div>
                  </div>
              </div>
            </div>
            
            {isShapeExists && (
              <div className="flex justify-end px-4 pt-4 border-t mt-4">
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => onDelete(selectedShape.id)}
                >
                  Delete Shape
                </Button>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}