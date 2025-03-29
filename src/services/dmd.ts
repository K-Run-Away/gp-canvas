export interface Medication {
  display: string;
  search: string;
}

// Import medications from the new structure
import { commonMedications } from '../data/medications';

export { commonMedications };

export async function searchMedications(query: string): Promise<Medication[]> {
  const searchTerm = query.toLowerCase().trim();
  if (searchTerm.length < 2) return [];
  
  try {
    const response = await fetch(`/api/medications?q=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    return data.medications;
  } catch (error) {
    console.error('Error searching medications:', error);
    // Fallback to common medications if API fails
    return commonMedications.filter(med => 
      med.display.toLowerCase().includes(searchTerm) ||
      med.search.toLowerCase().includes(searchTerm)
    );
  }
} 