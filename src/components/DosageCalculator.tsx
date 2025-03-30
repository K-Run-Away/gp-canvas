'use client';

import { useState, useEffect } from 'react';

export default function DosageCalculator() {
  const [weight, setWeight] = useState<number>(0);
  const [dosagePerKg, setDosagePerKg] = useState<number>(0);
  const [dosageUnit, setDosageUnit] = useState<string>('mg');
  const [frequency, setFrequency] = useState<string>('Once per day');
  const [isLiquid, setIsLiquid] = useState<boolean>(false);
  const [concentrationDose, setConcentrationDose] = useState<number>(0);
  const [concentrationVolume, setConcentrationVolume] = useState<number>(0);
  const [concentrationDoseUnit, setConcentrationDoseUnit] = useState<string>('mg');
  const [totalDose, setTotalDose] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);

  useEffect(() => {
    // Calculate total dose whenever weight or dosage per kg changes
    const calculatedDose = weight * dosagePerKg;
    setTotalDose(calculatedDose);

    // Calculate volume if liquid medicine
    if (isLiquid && concentrationDose > 0 && concentrationVolume > 0) {
      // Convert all units to mg for calculation
      let doseInMg = totalDose;
      let concDoseInMg = concentrationDose;

      // Convert dose units
      if (dosageUnit === 'mcg') doseInMg = totalDose / 1000;
      if (dosageUnit === 'g') doseInMg = totalDose * 1000;

      // Convert concentration dose units
      if (concentrationDoseUnit === 'mcg') concDoseInMg = concentrationDose / 1000;
      if (concentrationDoseUnit === 'g') concDoseInMg = concentrationDose * 1000;

      // Calculate volume: (total dose needed / concentration per ml)
      // First get concentration per ml: concDoseInMg / concentrationVolume
      const concPerMl = concDoseInMg / concentrationVolume;
      setVolume(concPerMl > 0 ? (doseInMg / concPerMl) : 0);
    }
  }, [weight, dosagePerKg, dosageUnit, concentrationDose, concentrationDoseUnit, concentrationVolume, isLiquid, totalDose]);

  const frequencies = [
    'Once per day',
    'Twice per day',
    'Three times per day',
    'Four times per day',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours'
  ];

  const doseUnits = ['mcg', 'mg', 'g'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Dosage Calculator</h2>
      
      <div className="space-y-4">
        {/* Weight Input */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600">Your weight</label>
          <div className="flex items-center">
            <input
              type="number"
              value={weight || ''}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right"
              placeholder="0"
            />
            <span className="ml-2 text-sm text-gray-500">kg</span>
          </div>
        </div>

        {/* Dosage per kg Input with Unit Selection */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600">Dosage</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={dosagePerKg || ''}
              onChange={(e) => setDosagePerKg(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right"
              placeholder="0"
            />
            <select
              value={dosageUnit}
              onChange={(e) => setDosageUnit(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {doseUnits.map(unit => (
                <option key={unit} value={unit}>{unit}/kg</option>
              ))}
            </select>
          </div>
        </div>

        {/* Frequency Dropdown */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-48 px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            {frequencies.map((freq) => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
        </div>

        {/* Total Dose Display */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600">Dose</label>
          <div className="flex items-center">
            <input
              type="number"
              value={totalDose || ''}
              readOnly
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right bg-gray-50"
            />
            <span className="ml-2 text-sm text-gray-500">{dosageUnit}</span>
          </div>
        </div>

        {/* Liquid Medicine Toggle */}
        <div className="flex items-center justify-between pt-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isLiquid}
              onChange={(e) => setIsLiquid(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm text-gray-600">Liquid medicine</span>
          </label>
        </div>

        {/* Medicine Concentration (only shown if liquid is selected) */}
        {isLiquid && (
          <>
            {/* Medication Concentration Input */}
            <div className="flex items-center justify-between pt-2">
              <label className="text-sm text-gray-600">Medicine formulation</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={concentrationDose || ''}
                  onChange={(e) => setConcentrationDose(Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-right"
                  placeholder="0"
                />
                <select
                  value={concentrationDoseUnit}
                  onChange={(e) => setConcentrationDoseUnit(e.target.value)}
                  className="px-2 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  {doseUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-500">/</span>
                <input
                  type="number"
                  value={concentrationVolume || ''}
                  onChange={(e) => setConcentrationVolume(Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-right"
                  placeholder="0"
                />
                <span className="text-sm text-gray-500">ml</span>
              </div>
            </div>

            {/* Volume Required Display */}
            <div className="flex items-center justify-between pt-2">
              <label className="text-sm text-gray-600">Volume required</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={volume.toFixed(2)}
                  readOnly
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right bg-gray-50"
                />
                <span className="ml-2 text-sm text-gray-500">ml</span>
              </div>
            </div>
          </>
        )}

        {/* Beta Warning */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-medium text-gray-800">Beta</span>
            <span className="text-xs text-gray-500 italic">Made with ❤️</span>
          </div>
          <p className="text-xs text-gray-600">
            Please verify all calculations independently. This calculator is in beta and should be used as a guide only.
          </p>
        </div>
      </div>
    </div>
  );
} 