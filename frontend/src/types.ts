export interface TmsData {
  total: Total;
  hourly: Hourly[];
}

export interface Hourly {
  way1: number;
  way2: number;
}

export interface Total {
  cars: number;
  trucks: number;
  busses: number;
  total: number;
}

type PieData = {
  name: string;
  value: number;
  total?: number;
};

type BarData = {
  name: number;
  way1: number;
  way2: number;
};

export type DataState = null | { pie: PieData[]; bar: BarData[] };
