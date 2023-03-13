import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import { getRealTimeData } from "../../services/lamService";
import { TmsStationDetails } from "../../types";
import {
  getCollectionStatus,
  getFlowStatus,
  parseRealtimeData,
} from "../../utils";
import TrafficFlow from "../TrafficFlow/TrafficFlow";
import styles from "./stationdata.module.scss";
import TrafficSign from "../TrafficSign/TrafficSign";

type StationDataProps = {
  stationProperties: TmsStationDetails;
};

const StationData = ({ stationProperties }: StationDataProps) => {
  const { data, isError, isFetching } = useQuery({
    queryKey: ["realTimeData", stationProperties.id],
    queryFn: () => getRealTimeData(stationProperties.id),
  });

  if (isError) return <></>;

  if (!data || isFetching) return <Spinner animation="border" />;

  if (stationProperties.collectionStatus !== "GATHERING")
    return (
      <Alert variant="danger">
        {getCollectionStatus(stationProperties.collectionStatus)}
      </Alert>
    );

  const parsedData = parseRealtimeData(data);

  return (
    <>
      <div>
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
                <TrafficSign arrow={true}>
                  {stationProperties.direction1Municipality || "Way 1"}
                </TrafficSign>
              </th>
              <td>{parsedData.passes_60.way1}</td>
              <td>{parsedData.speed_60.way1} km/h</td>
            </tr>
            <tr>
              <th scope="row">
                <TrafficSign arrow={true}>
                  {stationProperties.direction2Municipality || "Way 2"}
                </TrafficSign>
              </th>
              <td>{parsedData.passes_60.way2}</td>
              <td>{parsedData.speed_60.way2} km/h</td>
            </tr>
            <tr>
              <th scope="row">
                <TrafficSign>Total</TrafficSign>
              </th>
              <td>{parsedData.passes_60.way1 + parsedData.passes_60.way2}</td>
              <td>
                {(
                  (parsedData.speed_60.way1 + parsedData.speed_60.way2) /
                  2
                ).toFixed(1)}{" "}
                km/h
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div>
        <h4>Current traffic flow</h4>
        <div className={styles.trafficFlow}>
          <TrafficFlow
            activeKey={getFlowStatus(parsedData.speed_flow.way1)}
            title={stationProperties.direction1Municipality || "Way 1"}
          />
          <TrafficFlow
            activeKey={getFlowStatus(parsedData.speed_flow.way2)}
            title={stationProperties.direction2Municipality || "Way 2"}
          />
        </div>
      </div>
    </>
  );
};

export default StationData;
