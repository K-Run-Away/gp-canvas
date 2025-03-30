import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Condition {
  display: string;
  search: string;
}

// Cache for conditions to avoid reading the file on every request
let conditionsCache: Condition[] | null = null;

// Load conditions from CSV
async function loadConditionsFromCSV() {
  if (conditionsCache) {
    return conditionsCache;
  }

  try {
    const csvPath = path.join(process.cwd(), 'data', 'Conditions.csv');
    const fileContent = await fs.readFile(csvPath, 'utf-8');
    const conditions = fileContent
      .split('\n')
      .filter(line => line.trim()) // Remove empty lines
      .map(line => ({
        display: line.trim(),
        search: line.trim().toLowerCase().replace(/\s+/g, '-'),
      }));
    
    // Cache the results
    conditionsCache = conditions;
    return conditionsCache;
  } catch (error) {
    console.error('Error loading conditions from CSV:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  console.log('Conditions API called with query:', query);

  if (!query || query.length < 2) {
    console.log('Query too short, returning empty results');
    return NextResponse.json({ conditions: [] });
  }

  const allConditions = await loadConditionsFromCSV();
  console.log('Loaded conditions count:', allConditions.length);
  
  const searchTerm = query.toLowerCase().trim();
  const results = allConditions.filter(cond =>
    cond.display.toLowerCase().includes(searchTerm) ||
    cond.search.toLowerCase().includes(searchTerm)
  );
  
  console.log('Found matching conditions:', results.length);
  return NextResponse.json({ conditions: results });
} 