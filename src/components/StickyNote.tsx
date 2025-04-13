'use client';

import { useState } from 'react';

export default function StickyNote() {
  const [note, setNote] = useState('');

  return (
    <div className="bg-yellow-100 p-6 rounded-lg shadow-md border-b-4 border-yellow-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        📝 Sticky Note
      </h2>
      
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot down your quick notes here..."
        className="w-full h-40 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 focus:outline-none resize-none font-medium text-gray-700 placeholder-gray-400"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
        }}
      />

      <div className="mt-2 text-right">
        <button
          onClick={() => setNote('')}
          className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          Clear note
        </button>
      </div>
    </div>
  );
} 