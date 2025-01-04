import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PatternModal({ 
  isOpen, 
  onClose, 
  onPatternSelect 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onPatternSelect: (pattern: string) => void;
}) {
  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedNodes([]);
      drawPattern();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedNodes.length > 1) {
      drawPattern();
    }
  }, [selectedNodes]);

  const drawPattern = () => {
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    if (!canvas || !grid) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    if (selectedNodes.length > 1) {
      ctx.beginPath();
      for (let i = 1; i < selectedNodes.length; i++) {
        const fromNode = selectedNodes[i - 1];
        const toNode = selectedNodes[i];

        const fromElement = grid.children[fromNode] as HTMLElement;
        const toElement = grid.children[toNode] as HTMLElement;

        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();

        const fromX = fromRect.left - gridRect.left + fromRect.width / 2;
        const fromY = fromRect.top - gridRect.top + fromRect.height / 2;
        const toX = toRect.left - gridRect.left + toRect.width / 2;
        const toY = toRect.top - gridRect.top + toRect.height / 2;

        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
      }
      ctx.stroke();
    }
  };

  const handleNodeClick = (index: number) => {
    setSelectedNodes(prev => {
      if (prev.includes(index)) {
        return prev.filter((node) => node !== index);
      }
      return [...prev, index];
    });
  };

  const handleConfirm = () => {
    if (selectedNodes.length > 0) {
      const pattern = selectedNodes.map(n => n + 1).join("");
      onPatternSelect(pattern);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Draw Pattern</DialogTitle>
        </DialogHeader>
        <div className="relative w-[300px] h-[300px] mx-auto">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="absolute top-0 left-0 z-10"
          />
          <div
            ref={gridRef}
            className="grid grid-cols-3 gap-4 relative z-20"
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleNodeClick(index)}
                className={`w-16 h-16 rounded-full border-2 ${
                  selectedNodes.includes(index)
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                {selectedNodes.includes(index) && (
                  <span className="text-blue-500 font-bold">
                    {selectedNodes.indexOf(index) + 1}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={selectedNodes.length === 0}>
            Confirm Pattern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}