import { Medication } from '../../services/dmd';

export const antibiotics: Medication[] = [
  { search: 'amoxicillin', display: 'Amoxicillin' },
  { search: 'flucloxacillin', display: 'Flucloxacillin' },
  { search: 'clarithromycin', display: 'Clarithromycin' },
  { search: 'phenoxymethylpenicillin', display: 'Penicillin V' },
  { search: 'doxycycline', display: 'Doxycycline' },
  { search: 'trimethoprim', display: 'Trimethoprim' },
  { search: 'nitrofurantoin', display: 'Nitrofurantoin' },
  { search: 'metronidazole', display: 'Metronidazole' },
  { search: 'co-amoxiclav', display: 'Co-amoxiclav' },
  { search: 'erythromycin', display: 'Erythromycin' },
  { search: 'azithromycin', display: 'Azithromycin' },
  { search: 'cefalexin', display: 'Cefalexin' },
  { search: 'clindamycin', display: 'Clindamycin' },
  { search: 'gentamicin', display: 'Gentamicin' },
  { search: 'vancomycin', display: 'Vancomycin' },
] as const; 