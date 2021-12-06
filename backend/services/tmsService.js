const axios = require("axios").default;
const dataForge = require("data-forge");

const tmsBaseUrl = "https://aineistot.vayla.fi/lam/rawdata";

const header = [
  "id",
  "year",
  "day",
  "hour",
  "minute",
  "second",
  "milliseconds",
  "length",
  "lane",
  "way",
  "vehicleClass",
  "speed",
  "faulty",
  "totaltime",
  "interval",
  "queue",
];

const cars = ["1", "6", "7"];
const trucks = ["2", "4", "5"];
const busses = ["3"];

const getVehicleTypeName = (vehicleType) => {
  if (cars.includes(vehicleType)) {
    return "CAR";
  }
  if (trucks.includes(vehicleType)) {
    return "TRUCK";
  }
  if (busses.includes(vehicleType)) {
    return "BUS";
  }
};

const getHourlyList = (data) =>
  new Array(24).fill(null).map((_, index) => ({
    way1: data.filter(
      (vehicleRow) =>
        vehicleRow.hour === String(index) && vehicleRow.way === "1"
    ).length,
    way2: data.filter(
      (vehicleRow) =>
        vehicleRow.hour === String(index) && vehicleRow.way === "2"
    ).length,
  }));

const getTraffic = async (year, ely, lam, day) => {
  const url = `${tmsBaseUrl}/${year}/${ely}/lamraw_${lam}_${year.slice(
    -2
  )}_${day}.csv`;
  const response = await axios.get(url);
  const data = dataForge
    .fromCSV(response.data, { columnNames: header })
    .toArray()
    .filter((row) => row.faulty === "0")
    .map((validRow) => ({
      hour: validRow.hour,
      way: validRow.way,
      type: getVehicleTypeName(validRow.vehicleClass),
    }));
  const tmsData = {
    total: {
      cars: data.filter((vehicleRow) => vehicleRow.type === "CAR").length,
      trucks: data.filter((vehicleRow) => vehicleRow.type === "TRUCK").length,
      busses: data.filter((vehicleRow) => vehicleRow.type === "BUS").length,
      total: data.length,
    },
    hourly: getHourlyList(data),
  };
  return tmsData;
};

module.exports = {
  getTraffic,
};
