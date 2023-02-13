import React, { useEffect, useState, useRef } from "react";
import { getStations } from "../../services/lamService";
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
        setStationData(stations);
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
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "tms-point", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
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
