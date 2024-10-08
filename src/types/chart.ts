export type FilterType = 'daily' | 'weekly' | 'monthly';

export interface TCalorieData {
  date: string;
  enerc: number;
}

export interface TWeightData {
  x: string;
  y: number;
  isDerived: boolean;
}
