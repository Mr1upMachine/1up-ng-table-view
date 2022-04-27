export type PeriodicElementColumnKeys =
  | 'position'
  | 'name'
  | 'weight'
  | 'symbol';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
