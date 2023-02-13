import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import { getRealTimeData } from "../../services/lamService";
import { RealTimeDataState } from "../../types";
import {
  getCollectionStatus,
  getFlowStatus,
  parseRealtimeData,
} from "../../utils";
import TrafficFlow from "../TrafficFlow/TrafficFlow";
import styles from "./stationdata.module.scss";

type StationDataProps = {
  stationProperties: GeoJSON.GeoJsonProperties;
  stationId: number;
};

const StationData = ({ stationProperties, stationId }: StationDataProps) => {
  const [stationData, setStationData] = useState<RealTimeDataState | null>(
    null
  );

  const fetchData = async (id: number) => {
    try {
      const result = await getRealTimeData(id);
      setStationData(parseRealtimeData(result.tmsStations[0]));
    } catch (error) {
      setStationData(null);
    }
  };
  useEffect(() => {
    fetchData(stationId);
  }, []);

  if (!stationProperties) return <></>;

  if (!stationData) return <Spinner animation="border" />;

  if (stationProperties.collectionStatus !== "GATHERING")
    return (
      <Alert variant="danger">
        {getCollectionStatus(stationProperties.collectionStatus)}
      </Alert>
    );

  return (
    <>
      <h4>Station data for latest hour</h4>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>vehicles</th>
            <th>average speed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              to {stationProperties.direction1Municipality || "Way 1"}
            </th>
            <td>{stationData.passes_60.way1}</td>
            <td>{stationData.speed_60.way1} km/h</td>
          </tr>
          <tr>
            <th scope="row">
              to {stationProperties.direction2Municipality || "Way 2"}
            </th>
            <td>{stationData.passes_60.way2}</td>
            <td>{stationData.speed_60.way2} km/h</td>
          </tr>
          <tr>
            <th scope="row">total</th>
            <td>{stationData.passes_60.way1 + stationData.passes_60.way2}</td>
            <td>
              {(
                (stationData.speed_60.way1 + stationData.speed_60.way2) /
                2
              ).toFixed(1)}{" "}
              km/h
            </td>
          </tr>
        </tbody>
      </Table>
      <h4>Current traffic flow</h4>
      <div className={styles.trafficFlow}>
        <TrafficFlow
          activeKey={getFlowStatus(stationData.speed_flow.way1)}
          title={stationProperties.direction1Municipality || "Way 1"}
        />
        <TrafficFlow
          activeKey={getFlowStatus(stationData.speed_flow.way2)}
          title={stationProperties.direction2Municipality || "Way 2"}
        />
      </div>
    </>
  );
};

export default StationData;
