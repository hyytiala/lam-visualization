import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalBody from "react-bootstrap/ModalBody";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CategoryChart from "../CategoryChart/CategoryChart";
import DataTable from "../DataTable/DataTable";
import { getElyNumber } from "../../utils";

type MapModalProps = {
  closeModal: any;
  station: null | GeoJSON.Feature;
};

const MapModal = ({ closeModal, station }: MapModalProps) => {
  const [activeTab, setActiveTab] = useState("2");

  const toggleTab = (tab: string | null) => {
    if (tab && activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Modal show={station} onHide={closeModal} centered size="xl">
      <ModalHeader closeButton>
        {station &&
          station?.properties &&
          JSON.parse(station.properties.names).en}
      </ModalHeader>
      <ModalBody style={{ minHeight: "720px" }}>
        <Tabs
          id="controlled-tab-example"
          activeKey={activeTab}
          onSelect={(k) => toggleTab(k)}
          className="mb-3"
        >
          <Tab eventKey="1" title="Info">
            <Row>
              <Col sm="12">
                <h4>Station details</h4>
                <p>
                  Municipality:{" "}
                  {station &&
                    station?.properties &&
                    station.properties.municipality}
                </p>
                <p>
                  Province:{" "}
                  {station &&
                    station?.properties &&
                    station.properties.province}
                </p>
                <p>
                  Road number:{" "}
                  {station &&
                    station?.properties &&
                    JSON.parse(station.properties.roadAddress).roadNumber}
                </p>
                <h4>Station data for latest hour</h4>
                {station && station?.properties && (
                  <DataTable data={station.properties} />
                )}
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="2" title="Charts">
            <Row>
              <Col sm="12">
                {station && station?.properties && (
                  <CategoryChart
                    lam={station.properties.tmsNumber}
                    ely={getElyNumber(station.properties.provinceCode)}
                    station={station}
                  />
                )}
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </ModalBody>
    </Modal>
  );
};

export default MapModal;
