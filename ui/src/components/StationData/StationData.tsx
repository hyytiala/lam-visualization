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
        <Table responsive={true} borderless={true}>
          <thead>
            <tr>
              <th></th>
              <th>
                <TrafficSign arrow={true}>
                  {stationProperties.direction1Municipality || "Way 1"}
                </TrafficSign>
              </th>
              <th>
                <TrafficSign arrow={true}>
                  {stationProperties.direction2Municipality || "Way 2"}
                </TrafficSign>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" style={{ textAlign: "right" }}>
                Vehicles
              </th>
              <td>{parsedData.passes_60.way1}</td>
              <td>{parsedData.passes_60.way2}</td>
            </tr>
            <tr>
              <th scope="row" style={{ textAlign: "right" }}>
                Average speed
              </th>
              <td>{parsedData.speed_60.way1} km/h</td>
              <td>{parsedData.speed_60.way2} km/h</td>
            </tr>
            <tr>
              <th scope="row" style={{ textAlign: "right" }}>
                Traffic flow
              </th>
              <td>
                <TrafficFlow
                  activeKey={getFlowStatus(parsedData.speed_flow.way1)}
                />
              </td>
              <td>
                <TrafficFlow
                  activeKey={getFlowStatus(parsedData.speed_flow.way2)}
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default StationData;
