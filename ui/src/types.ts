interface Hourly {
  hour: number;
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
  measuredTime: string;
  name: string;
  shortName: string;
  stationId: number;
  timeWindowEnd: string;
  timeWindowStart: string;
  unit: string;
  value: number;
}

export interface TmsStationData {
  id: number;
  tmsNumber: number;
  dataUpdatedTime: string;
  sensorValues: SensorValue[];
}

export interface TmsStationDetails {
  id: number;
  tmsNumber: number;
  name: string;
  collectionStatus: string;
  state: string;
  dataUpdatedTime: string;
  collectionInterval: number;
  names: {
    fi: string;
    sv: string;
    en: string;
  };
  roadAddress: {
    roadNumber: number;
    roadSection: number;
    distanceFromRoadSectionStart: number;
    carriageway: string;
    side: string;
    contractArea: string;
    contractAreaCode: number;
  };
  liviId: string;
  country: string;
  startTime: string;
  repairMaintenanceTime: string;
  annualMaintenanceTime: string;
  purpose: string;
  municipality: string;
  municipalityCode: number;
  province: string;
  provinceCode: number;
  direction1Municipality: string;
  direction1MunicipalityCode: number;
  direction2Municipality: string;
  direction2MunicipalityCode: number;
  stationType: string;
  calculatorDeviceType: string;
  sensors: number[];
  freeFlowSpeed1: number;
  freeFlowSpeed2: number;
}
