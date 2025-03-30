import { NextResponse } from 'next/server';
import fs from 'fs/promises';  // Using promise-based fs
import path from 'path';
import { commonMedications } from '@/data/medications';
import type { Medication } from '@/services/dmd';

// Cache for medications to avoid reading the file on every request
let medicationsCache: Medication[] | null = null;

// Load medications from CSV
async function loadMedicationsFromCSV() {
  if (medicationsCache) {
    return medicationsCache;
  }

  try {
    const csvPath = path.join(process.cwd(), 'data', 'medications.csv');
    const fileContent = await fs.readFile(csvPath, 'utf-8');
    const medications = fileContent
      .split('\n')
      .filter(line => line.trim()) // Remove empty lines
      .map(line => ({
        display: line.trim(),
        search: line.trim().toLowerCase().replace(/\s+/g, '-'),
      }));
    
    // Cache the results and combine with common medications
    medicationsCache = [...medications, ...commonMedications];
    return medicationsCache;
  } catch (error) {
    console.error('Error loading medications from CSV:', error);
    return commonMedications;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ medications: [] });
  }

  const allMedications = await loadMedicationsFromCSV();
  const searchTerm = query.toLowerCase().trim();
  
  const results = allMedications.filter(med =>
    med.display.toLowerCase().includes(searchTerm) ||
    med.search.toLowerCase().includes(searchTerm)
  ).slice(0, 10); // Limit to 10 results for better performance

  return NextResponse.json({ medications: results });
} 