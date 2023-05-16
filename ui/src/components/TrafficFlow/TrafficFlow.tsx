import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

type TrafficFlowProps = {
  activeKey: number;
};

const TrafficFlow = ({ activeKey }: TrafficFlowProps) => {
  return (
    <div>
      <ListGroup>
        <ListGroup.Item variant="success" disabled={activeKey !== 0}>
          Fluent
        </ListGroup.Item>
        <ListGroup.Item variant="info" disabled={activeKey !== 1}>
          Platooning
        </ListGroup.Item>
        <ListGroup.Item variant="warning" disabled={activeKey !== 2}>
          Slow
        </ListGroup.Item>
        <ListGroup.Item variant="danger" disabled={activeKey !== 3}>
          Queuing
        </ListGroup.Item>
        <ListGroup.Item variant="dark" disabled={activeKey !== 4}>
          Stationary
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default TrafficFlow;
