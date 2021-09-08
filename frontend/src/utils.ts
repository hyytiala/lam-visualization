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

interface ColorState {
  [propertyName: string]: string;
}

export const COLORS: ColorState = {
  Cars: "#ec9a29",
  Trucks: "#a8201a",
  Busses: "#0f8b8d",
};

export const getBadgeColor = (roadNumber: number) => {
  switch (roadNumber.toString().length) {
    case 1:
      return "danger";
    case 2:
      return "warning";
    case 3:
      return "light";
    default:
      return "primary";
  }
};
