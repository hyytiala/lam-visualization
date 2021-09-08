import React from "react";
import styles from "./app.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "./components/Map/Map";

const App = () => {
  return (
    <div className={styles.root}>
      <Map />
    </div>
  );
};

export default App;
