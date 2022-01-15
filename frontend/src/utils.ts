import { Color } from "react-bootstrap/esm/types";

type Ely =
  | "1"
  | "5"
  | "7"
  | "2"
  | "4"
  | "6"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19";

export const getElyNumber = (ely: Ely): string => {
  switch (ely) {
    case "1":
    case "5":
    case "7":
      return "01";
    case "2":
    case "4":
      return "02";
    case "6":
      return "04";
    case "8":
    case "9":
      return "03";
    case "10":
    case "11":
    case "12":
      return "08";
    case "13":
      return "09";
    case "14":
    case "15":
    case "16":
      return "10";
    case "17":
    case "18":
      return "12";
    case "19":
      return "14";
    default:
      return "01";
  }
};

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
