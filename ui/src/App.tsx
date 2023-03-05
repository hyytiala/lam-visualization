import React from "react";
import styles from "./app.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "./components/Map/Map";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.root}>
        <Map />
      </div>
    </QueryClientProvider>
  );
};

export default App;
