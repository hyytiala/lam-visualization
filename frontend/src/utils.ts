import { Color } from "react-bootstrap/esm/types";

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
