import React, { useEffect, useState, useRef } from "react";
import { fetchStations } from "../../services/lamService";
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
import { useQuery } from "@tanstack/react-query";

mapboxgl.accessToken = MAPBOX_TOKEN;

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<null | mapboxgl.Map>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  const closeModal = () => setSelectedStation(null);

  const { data, isError, isFetching } = useQuery({
    queryKey: ["stationsList"],
    queryFn: fetchStations,
  });

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current as HTMLElement,
        style: MAPBOX_STYLE,
        center: [26.444, 65.4536],
        zoom: 5,
      });
      map.current.on("load", () => {
        setMapLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (
      map.current &&
      mapLoaded &&
      !map.current.getSource("tms-stations") &&
      data
    ) {
      map.current.addSource("tms-stations", {
        type: "geojson",
        data: data,
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
          setSelectedStation(event.features[0].id as number);
        }
      });
    }
  }, [data, mapLoaded]);

  const isMapLoading = isFetching || !mapLoaded;

  return (
    <>
      <div ref={mapContainer} className={styles.map} />
      {selectedStation && (
        <MapModal closeModal={closeModal} stationId={selectedStation} />
      )}
      <LoadingModal loading={isMapLoading} error={isError} />
    </>
  );
};

export default Map;
