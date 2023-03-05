import { Color } from "react-bootstrap/esm/types";
import { RealTimeDataState, TmsStationData, WayData } from "./types";

export const addStatisticsToData = () => {
  return [];
};

export const getBadgeProps = (
  roadNumber: number
): { bg: string; text?: Color } => {
  switch (roadNumber.toString().length) {
    case 1:
      return { bg: "danger" };
    case 2:
      return { bg: "warning", text: "dark" };
    case 3:
      return { bg: "light", text: "dark" };
    default:
      return { bg: "primary" };
  }
};

export const getHourString = (hour: number): string => {
  if (hour === 24) return "00";
  if (hour < 10) return `0${hour}`;
  return String(hour);
};

const parseWayData = (
  data: TmsStationData,
  way1Key: string,
  way2Key: string
): WayData => {
  const way1 =
    data.sensorValues.find(({ name }) => name === way1Key)?.value ?? 0;
  const way2 =
    data.sensorValues.find(({ name }) => name === way2Key)?.value ?? 0;
  return {
    way1,
    way2,
  };
};

export const parseRealtimeData = (data: TmsStationData): RealTimeDataState => {
  return {
    passes_60: parseWayData(
      data,
      "OHITUKSET_60MIN_KIINTEA_SUUNTA1",
      "OHITUKSET_60MIN_KIINTEA_SUUNTA2"
    ),
    speed_60: parseWayData(
      data,
      "KESKINOPEUS_60MIN_KIINTEA_SUUNTA1",
      "KESKINOPEUS_60MIN_KIINTEA_SUUNTA2"
    ),
    speed_flow: parseWayData(
      data,
      "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA1_VVAPAAS1",
      "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA2_VVAPAAS2"
    ),
  };
};

export const getFlowStatus = (flow: number): number => {
  if (flow > 90) {
    return 0;
  }
  if (flow > 75) {
    return 1;
  }
  if (flow > 25) {
    return 2;
  }
  if (flow > 10) {
    return 3;
  }
  return 4;
};

export const getCollectionStatus = (collectionStatus: string): string =>
  collectionStatus === "REMOVED_TEMPORARILY"
    ? "The station is temporarily unavailable"
    : collectionStatus === "REMOVED_PERMANENTLY"
    ? "The station is no longer in use"
    : "";
