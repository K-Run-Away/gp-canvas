'use client';

import { useState } from 'react';

export default function WellbeingChecklist() {
  const [checks, setChecks] = useState({
    movement: false,
    relaxation: false,
    nourishment: false
  });

  const handleCheck = (type: keyof typeof checks) => {
    setChecks(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Wellbeing Checklist</h2>
      
      <div className="space-y-4">
        {/* Movement Break */}
        <div 
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
            checks.movement 
              ? 'bg-green-100 border-2 border-green-500' 
              : 'bg-gray-50 border-2 border-gray-200 hover:border-green-300'
          }`}
          onClick={() => handleCheck('movement')}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {checks.movement ? (
                <span className="text-green-600 text-xl">✓</span>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
              )}
            </div>
            <label className={`flex-grow text-lg font-medium cursor-pointer ${
              checks.movement ? 'line-through text-gray-500' : 'text-gray-700'
            }`}>
              🏃‍♂️ Active Movement Break
            </label>
          </div>
        </div>

        {/* Relaxation Break */}
        <div 
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
            checks.relaxation 
              ? 'bg-blue-100 border-2 border-blue-500' 
              : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleCheck('relaxation')}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {checks.relaxation ? (
                <span className="text-blue-600 text-xl">✓</span>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
              )}
            </div>
            <label className={`flex-grow text-lg font-medium cursor-pointer ${
              checks.relaxation ? 'line-through text-gray-500' : 'text-gray-700'
            }`}>
              🧘‍♀️ Relaxation Break
            </label>
          </div>
        </div>

        {/* Nourishment Break */}
        <div 
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
            checks.nourishment 
              ? 'bg-purple-100 border-2 border-purple-500' 
              : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
          }`}
          onClick={() => handleCheck('nourishment')}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {checks.nourishment ? (
                <span className="text-purple-600 text-xl">✓</span>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
              )}
            </div>
            <label className={`flex-grow text-lg font-medium cursor-pointer ${
              checks.nourishment ? 'line-through text-gray-500' : 'text-gray-700'
            }`}>
              🍎 Nourishment Break
            </label>
          </div>
        </div>

        {/* Progress Message */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {Object.values(checks).every(check => check) ? (
            <p className="text-green-600 font-medium">
              🎉 Great job taking care of yourself today!
            </p>
          ) : (
            <p>
              {Object.values(checks).filter(check => check).length} of 3 breaks completed
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 