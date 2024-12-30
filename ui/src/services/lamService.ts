import axios from "axios";
import { TmsData, TmsStationData } from "../types";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8787"
    : "https://api-v2.otto-hyytiala.workers.dev";

const DIGITRAFFIC_API_URL = "https://tie.digitraffic.fi/api/tms/v1";

export const fetchStations = async (): Promise<GeoJSON.FeatureCollection> => {
  const response = await axios.get(`${DIGITRAFFIC_API_URL}/stations`);
  return response.data;
};

export const fetchStationData = async (
  id: number
): Promise<GeoJSON.Feature> => {
  const response = await axios.get(`${DIGITRAFFIC_API_URL}/stations/${id}`);
  return response.data;
};

export const getRealTimeData = async (id: number): Promise<TmsStationData> => {
  const response = await axios.get(
    `${DIGITRAFFIC_API_URL}/stations/${id}/data`
  );
  return response.data;
};

export const getStationData = async (
  year: string,
  lam: string,
  day: string
): Promise<TmsData> => {
  const response = await axios.get(
    `${API_URL}/lam/api?year=${year}&lam=${lam}&day=${day}`
  );
  return response.data;
};
