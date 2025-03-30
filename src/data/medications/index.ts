import { Medication } from '../../services/dmd';
import { antibiotics } from './antibiotics';
import { painAndInflammation } from './pain-inflammation';

// Combine all medication lists
export const commonMedications: Medication[] = [
  ...antibiotics,
  ...painAndInflammation,
  // Add more categories as they become available
]; 