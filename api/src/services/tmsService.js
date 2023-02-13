const axios = require("axios").default;
const dataForge = require("data-forge");

const tmsBaseUrl = "https://tie-test.digitraffic.fi/api/tms/history/raw";

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

const getTraffic = async (year, lam, day) => {
  const url = `${tmsBaseUrl}/lamraw_${lam}_${year.slice(-2)}_${day}.csv`;
  const response = await axios.get(url);

  const dataSet = dataForge
    .fromCSV(response.data, { columnNames: header })
    .filter((row) => row.faulty === "0")
    .map((validRow) => ({
      hour: validRow.hour,
      way: validRow.way,
      type: getVehicleTypeName(validRow.vehicleClass),
      speed: Number.parseInt(validRow.speed),
    }));

  const totalData = dataSet
    .groupBy((row) => row.type)
    .select((group) => ({
      type: group.first().type,
      count: group.count(),
    }))
    .inflate()
    .toArray();

  const hourlyData = dataSet
    .groupBy((row) => row.hour)
    .select((group) => ({
      hour: Number.parseInt(group.first().hour),
      way1: group.filter((row) => row.way === "1").count(),
      way2: group.filter((row) => row.way === "2").count(),
    }))
    .orderBy((row) => row.hour)
    .inflate()
    .toArray();

  const speedData = dataForge
    .fromCSV(response.data, { columnNames: header })
    .filter((row) => row.faulty === "0")
    .map((validRow) => ({
      speed: Number.parseInt(validRow.speed),
    }))
    .summarize({
      speed: {
        average: (series) => series.average(),
        max: (series) => series.max(),
      },
    });

  const tmsData = {
    total: {
      cars: totalData.find(({ type }) => type === "CAR").count,
      trucks: totalData.find(({ type }) => type === "TRUCK").count,
      busses: totalData.find(({ type }) => type === "BUS").count,
      total: dataSet.count(),
    },
    speeds: speedData,
    hourly: hourlyData,
  };
  return tmsData;
};

module.exports = {
  getTraffic,
};
