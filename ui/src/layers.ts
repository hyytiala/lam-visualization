export const clusterLayer: mapboxgl.AnyLayer = {
  id: "tms-clusters",
  type: "circle",
  source: "tms-stations",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#51D5A0",
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayer: mapboxgl.AnyLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "tms-stations",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
  paint: {},
};

export const unclusteredPointLayer: mapboxgl.AnyLayer = {
  id: "tms-point",
  type: "circle",
  source: "tms-stations",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#E0E0E0",
    "circle-radius": 15,
    "circle-stroke-width": 2,
    "circle-stroke-color": "#000000",
  },
};
