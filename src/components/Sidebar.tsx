'use client';

import { useState, useRef, useEffect } from 'react';
import StickyNote from './StickyNote';
import IntegratedTimer from './IntegratedTimer';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(400); // Default width
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < 800) { // Min and max width constraints
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 top-4 z-50 bg-gray-200 p-2 rounded-l-lg shadow-lg hover:bg-gray-300 transition-all duration-200"
      >
        {isOpen ? '→' : '←'}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full bg-gray-50 shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: `${width}px` }}
      >
        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-blue-500"
          onMouseDown={() => setIsResizing(true)}
        />

        {/* Sidebar Content */}
        <div className="p-4 space-y-6">
          <StickyNote />
          <IntegratedTimer />
        </div>
      </div>
    </>
  );
} 