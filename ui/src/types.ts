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

export interface WayData {
  way1: number;
  way2: number;
}

export interface RealTimeDataState {
  passes_60: WayData;
  speed_60: WayData;
  speed_flow: WayData;
}

export interface SensorValue {
  id: number;
  roadStationId: number;
  name: string;
  oldName: string;
  shortName: string;
  sensorValue: number;
  sensorUnit: string;
  timeWindowStart: string;
  timeWindowEnd: string;
  measuredTime: string;
}

export interface TmsStation {
  id: number;
  tmsNumber: number;
  measuredTime: string;
  sensorValues: SensorValue[];
}

export interface TmsStationsData {
  dataUpdatedTime: string;
  tmsStations: TmsStation[];
}
