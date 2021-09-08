import React, { useEffect, useState, useRef } from "react";
import { getStations, getVolume } from "../../services/lamService";
import styles from "./map.module.scss";
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from "../../layers";
import MapModal from "../MapModal/MapModal";
import { MAPBOX_TOKEN, MAPBOX_STYLE } from "../../config";
import LoadingModal from "../LoadingModal/LoadingModal";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = MAPBOX_TOKEN;

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<null | mapboxgl.Map>(null);
  const [stationData, setStationData] =
    useState<GeoJSON.FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<GeoJSON.Feature | null>(null);

  const closeModal = () => setSelected(null);

  useEffect(() => {
    setLoading(true);
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current as HTMLElement,
        style: MAPBOX_STYLE,
        center: [26.444, 65.4536],
        zoom: 5,
      });
    }
    const fetchStations = async () => {
      try {
        const stations = await getStations();
        const data = await getVolume();

        const newdata = {
          ...stations,
          features: stations.features.map((station) => {
            const sensor = data.tmsStations.filter(
              (s: any) => s.id === station.id
            )[0];
            const way1 = sensor.sensorValues.filter(
              (v: any) => v.name === "OHITUKSET_60MIN_KIINTEA_SUUNTA1"
            )[0];
            const way2 = sensor.sensorValues.filter(
              (v: any) => v.name === "OHITUKSET_60MIN_KIINTEA_SUUNTA2"
            )[0];
            const avg1 = sensor.sensorValues.filter(
              (v: any) => v.name === "KESKINOPEUS_60MIN_KIINTEA_SUUNTA1"
            )[0];
            const avg2 = sensor.sensorValues.filter(
              (v: any) => v.name === "KESKINOPEUS_60MIN_KIINTEA_SUUNTA2"
            )[0];
            return {
              ...station,
              properties: {
                ...station.properties,
                passes: {
                  way1: way1 ? way1.sensorValue : -1,
                  way2: way2 ? way2.sensorValue : -1,
                  total:
                    way1 && way2 ? way1.sensorValue + way1.sensorValue : -1,
                },
                speed: {
                  way1: avg1 ? avg1.sensorValue : -1,
                  way2: avg2 ? avg2.sensorValue : -1,
                  total:
                    avg1 && avg2
                      ? (avg1.sensorValue + avg2.sensorValue) / 2
                      : -1,
                },
              },
            };
          }),
        };
        setStationData(newdata);
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    };
    map.current.on("load", () => {
      fetchStations();
    });
  }, []);

  useEffect(() => {
    if (map.current && !map.current.getSource("tms-stations") && stationData) {
      map.current.addSource("tms-stations", {
        type: "geojson",
        data: stationData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
      map.current.addLayer(clusterLayer);
      map.current.addLayer(clusterCountLayer);
      map.current.addLayer(unclusteredPointLayer);
      map.current.on("mouseenter", "tms-point", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "tms-point", () => {
        map.current!.getCanvas().style.cursor = "";
      });
      map.current.on("click", "tms-point", (event) => {
        if (event.features && event.features.length > 0) {
          setSelected(event.features[0]);
        }
      });
    }
  }, [stationData]);

  return (
    <>
      <div ref={mapContainer} className={styles.map} />
      <MapModal closeModal={closeModal} station={selected} />
      <LoadingModal loading={loading} error={error} />
    </>
  );
};

export default Map;
