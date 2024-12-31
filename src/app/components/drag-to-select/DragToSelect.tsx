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

  // This is the DOMRect that represents the selection box
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

const getDiagonalLength = (x: number, y: number): number => {
  // This is the Pythagorean theorem: a^2 + b^2 = c^2
  // We want to find the length of the diagonal, which is c
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

const DragToSelect = () => {
  const [dragVector, setDragVector] = useState<DOMVector | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // This is the DOMRect that represents the selection box
  const selectionRect = dragVector ? dragVector.toDOMRect() : null;

  const updateSelectedItems = (dragVector: DOMVector) => {
    if (containerRef.current === null) return;
    const result: Record<string, boolean> = {};
    const containerRect = containerRef.current.getBoundingClientRect();

    containerRef.current.querySelectorAll('[data-item]').forEach(el => {
      const itemRect = el.getBoundingClientRect();

      const x = itemRect.x - containerRect.x;
      const y = itemRect.y - containerRect.y;

      const itemRectInsideContainer = new DOMRect(
        x,
        y,
        itemRect.width,
        itemRect.height
      );

      if (!isIntersecting(dragVector.toDOMRect(), itemRectInsideContainer)) {
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

    // Only trigger pointer event (e.pointerId) for this element (e.currentTarget)
    // This prevent non-pointer events (ex: hover) from triggering while we dragging
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragVector == null) return;

    const containerRect = e.currentTarget.getBoundingClientRect();

    // We focus on the container so that we can listen to ESC key events to cancel the drag
    containerRef.current?.focus();

    // e.client and containerRect are relative to the window, so we need to calculate the position of the current pointer relative to the container first
    // Think of it like this: edge of window ---- container edge ---- pointer location
    const x = e.clientX - containerRect.x;
    const y = e.clientY - containerRect.y;

    // Now we calculate how long the pointer has moved, which is the magnitude of the vector
    const nextMagnitudeX = x - dragVector.x;
    const nextMagnitudeY = y - dragVector.y;

    const nextDragVector = new DOMVector(
      dragVector.x,
      dragVector.y,
      nextMagnitudeX,
      nextMagnitudeY
    );

    // Prevent premature dragging, like clicking on the item
    // we only want to start dragging when the pointer has moved at least 10px
    if (!isDragging && getDiagonalLength(nextMagnitudeX, nextMagnitudeY) < 10) {
      return;
    }
    setIsDragging(true);

    setDragVector(nextDragVector);
    updateSelectedItems(nextDragVector);
  };

  const handlePointerUp = () => {
    // This happens when we drag and release the pointer immediately
    if (!isDragging) {
      setSelectedItems({});
      setDragVector(null);
    } else {
      // When isDragging is true and we release the pointer, we want to reset the drag vector
      setDragVector(null);
      setIsDragging(false);
    }
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
        className="relative z-0 grid grid-cols-8 sm:grid-cols-10 gap-4 p-4 border-2 border-black select-none focus:outline-none focus:border-dashed  -translate-y-0.5"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        ref={containerRef}
        // We need tabIndex to -1 so that containerRef.current, which is a non-focusable element, can be focused programmatically
        tabIndex={-1}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.preventDefault();
            setSelectedItems({});
            setDragVector(null);
          }
        }}
      >
        {items.map(item => (
          <div
            className={`border-2 size-10 border-slate-900 flex justify-center items-center hover:bg-pink-500 ${
              selectedItems[item]
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-900'
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
