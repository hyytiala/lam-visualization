interface Hourly {
  way1: number;
  way2: number;
}

interface Total {
  cars: number;
  trucks: number;
  busses: number;
  total: number;
}

interface BarData {
  name: string;
  data: number[];
}

export interface TmsData {
  total: Total;
  hourly: Hourly[];
  speeds: {
    average: number;
    max: number;
  };
}

export interface DataState {
  pie: number[];
  bar: BarData[];
  speeds: {
    average: number;
    max: number;
  };
}
