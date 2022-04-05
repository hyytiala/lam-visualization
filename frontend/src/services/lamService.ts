import axios from "axios";

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://app.hyytiala.fi";

export const getStations = async (): Promise<GeoJSON.FeatureCollection> => {
  const response = await axios.get(
    "https://tie.digitraffic.fi/api/v3/metadata/tms-stations"
  );
  return response.data;
};

export const getVolume = async () => {
  const response = await axios.get(
    "https://tie.digitraffic.fi/api/v1/data/tms-data"
  );
  return response.data;
};

export const getStationData = async (
  year: string,
  lam: string,
  day: string
) => {
  const response = await axios.get(
    `${URL}/lam/api?year=${year}&lam=${lam}&day=${day}`
  );
  return response.data;
};
