import { useState, useRef, useCallback } from "react";

export function useDraggable(initialX: number, initialY: number) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const dragState = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: position.x,
        origY: position.y,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragState.current) return;
        setPosition({
          x: dragState.current.origX + (ev.clientX - dragState.current.startX),
          y: dragState.current.origY + (ev.clientY - dragState.current.startY),
        });
      };

      const onMouseUp = () => {
        dragState.current = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [position.x, position.y]
  );

  return { position, onMouseDown };
}
