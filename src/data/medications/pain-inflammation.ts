import { Medication } from '../../services/dmd';

export const painAndInflammation: Medication[] = [
  { search: 'ibuprofen', display: 'Ibuprofen' },
  { search: 'paracetamol', display: 'Paracetamol' },
  { search: 'codeine-phosphate', display: 'Codeine' },
  { search: 'morphine', display: 'Morphine' },
  { search: 'tramadol-hydrochloride', display: 'Tramadol' },
  { search: 'naproxen', display: 'Naproxen' },
  { search: 'diclofenac-sodium', display: 'Diclofenac' },
  { search: 'aspirin', display: 'Aspirin' },
  { search: 'oxycodone-hydrochloride', display: 'Oxycodone' },
  { search: 'fentanyl', display: 'Fentanyl' },
  { search: 'pregabalin', display: 'Pregabalin' },
  { search: 'gabapentin', display: 'Gabapentin' },
] as const; 