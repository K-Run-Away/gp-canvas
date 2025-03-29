export interface Condition {
  display: string;
  search: string;
}

export async function searchConditions(query: string): Promise<Condition[]> {
  const searchTerm = query.toLowerCase().trim();
  if (searchTerm.length < 2) return [];
  
  try {
    const response = await fetch(`/api/conditions?q=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    return data.conditions;
  } catch (error) {
    console.error('Error searching conditions:', error);
    return [];
  }
} 