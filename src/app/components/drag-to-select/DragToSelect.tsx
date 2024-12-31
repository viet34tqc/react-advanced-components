'use client';

import { useRef, useState } from 'react';

const items = Array.from({ length: 30 }, (_, i) => i + '');

// Check if element 1 is intersecting with element 2
function isIntersecting(rect1: DOMRect, rect2: DOMRect) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

// Our purpose is to draw a rectangle while dragging
// Which includes the magnitude and direction of the rect
// And this represents a vector
class DOMVector {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly magnitudeX: number,
    readonly magnitudeY: number
  ) {
    this.x = x;
    this.y = y;
    this.magnitudeX = magnitudeX;
    this.magnitudeY = magnitudeY;
  }

  toDOMRect(): DOMRect {
    return new DOMRect(
      // When we drag from right to left, we need to reduce the x value, that's when this.x + this.magnitudeX < this.x
      Math.min(this.x, this.x + this.magnitudeX),
      Math.min(this.y, this.y + this.magnitudeY),
      Math.abs(this.magnitudeX),
      Math.abs(this.magnitudeY)
    );
  }
}

const DragToSelect = () => {
  const [dragVector, setDragVector] = useState<DOMVector | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );
  const selectionRect = dragVector ? dragVector.toDOMRect() : null;
  const containerRef = useRef<HTMLDivElement>(null);
  const updateSelectedItems = (dragVector: DOMVector) => {
    if (containerRef.current === null) return;
    const result: Record<string, boolean> = {};
    const containerRect = containerRef.current.getBoundingClientRect();

    containerRef.current.querySelectorAll('[data-item]').forEach(el => {
      const itemRect = el.getBoundingClientRect();

      const x = itemRect.x - containerRect.x;
      const y = itemRect.y - containerRect.y;
      const translatedItemRect = new DOMRect(
        x,
        y,
        itemRect.width,
        itemRect.height
      );

      if (!isIntersecting(dragVector.toDOMRect(), translatedItemRect)) {
        return;
      }

      if (
        el instanceof HTMLElement &&
        el.dataset.item &&
        typeof el.dataset.item === 'string'
      ) {
        result[el.dataset.item] = true;
      }
    });

    setSelectedItems(result);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // we only want to start drag events from the left pointer button
    // e.button for right pointer button returns 2
    if (e.button !== 0) return;

    const containerRect = e.currentTarget.getBoundingClientRect();

    // The selection reac is absolute to the container, so we need to calculate its position based on the position of the container
    setDragVector(
      new DOMVector(
        e.clientX - containerRect.x, // this equals the top value of the rect in the container
        e.clientY - containerRect.y,
        0,
        0
      )
    );
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragVector == null) return;

    const containerRect = e.currentTarget.getBoundingClientRect();

    // e.client and containerRect are relative to the window, so we need to calculate the position of the current pointer relative to the container first
    // Think of it like this: edge of window ---- container edge ---- pointer location
    const x = e.clientX - containerRect.x;
    const y = e.clientY - containerRect.y;

    const nextDragVector = new DOMVector(
      dragVector.x,
      dragVector.y,
      // Now we calculate how long the pointer has moved, which is the magnitude of the vector
      x - dragVector.x,
      y - dragVector.y
    );

    setDragVector(nextDragVector);
    updateSelectedItems(nextDragVector);
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="px-2 border-2 border-black">selectable area</div>
        {Object.keys(selectedItems).length > 0 && (
          <div className="px-2 border-2 border-black">
            count: {Object.keys(selectedItems).length}
          </div>
        )}
      </div>
      <div
        className="relative z-0 grid grid-cols-8 sm:grid-cols-10 gap-4 p-4 border-2 border-black -translate-y-0.5"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDragVector(null)}
        ref={containerRef}
      >
        {items.map(item => (
          <div
            className={`border-2 size-10 border-black flex justify-center items-center ${
              selectedItems[item]
                ? 'bg-black text-white'
                : 'bg-white text-black'
            }`}
            data-item={item}
            key={item}
          >
            {item}
          </div>
        ))}
        {selectionRect && (
          <div
            className="absolute border-slate-700 border-2 bg-slate-700/30"
            style={{
              top: selectionRect.y,
              left: selectionRect.x,
              width: selectionRect.width,
              height: selectionRect.height,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DragToSelect;
