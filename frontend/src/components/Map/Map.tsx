import React, { useRef, useEffect, useState } from "react";
import styles from "./map.module.scss";
import MapGL, { Source, Layer, LayerProps, MapEvent } from "react-map-gl";
import { getStations, getVolume } from "../../services/lamService";
import mapboxgl from "mapbox-gl";
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from "../../layers";
import MapModal from "../MapModal/MapModal";
import { MAPBOX_TOKEN, MAPBOX_STYLE } from "../../config";
import LoadingModal from "../LoadingModal/LoadingModal";

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 65.4536,
    longitude: 26.444,
    zoom: 8,
    bearing: 0,
    pitch: 0,
  });

  const [stationData, setStationData] =
    useState<GeoJSON.FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<GeoJSON.Feature | null>(null);

  const closeModal = () => setSelected(null);

  useEffect(() => {
    setLoading(true);
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
    fetchStations();
  }, []);

  const onClick = (event: MapEvent) => {
    if (event.features && event.features.length > 0) {
      setSelected(event.features[0]);
    }
  };

  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={MAPBOX_STYLE}
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={stationData ? ["unclustered-point"] : []}
        onClick={onClick}
      >
        {stationData && (
          <Source
            type="geojson"
            data={stationData}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
        )}
      </MapGL>
      <MapModal closeModal={closeModal} station={selected} />
      <LoadingModal loading={loading} error={error} />
    </>
  );
};

export default Map;
