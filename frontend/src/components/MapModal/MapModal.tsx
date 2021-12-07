import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Badge from "react-bootstrap/Badge";
import CategoryChart from "../CategoryChart/CategoryChart";
import DataTable from "../DataTable/DataTable";
import { getBadgeProps, getElyNumber } from "../../utils";
import styles from "./mapmodal.module.scss";

type MapModalProps = {
  closeModal: () => void;
  station: null | GeoJSON.Feature;
};

const MapModal = ({ closeModal, station }: MapModalProps) => {
  const [activeTab, setActiveTab] = useState("2");

  const toggleTab = (tab: string | null) => {
    if (tab && activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Modal
      show={station}
      onHide={closeModal}
      centered
      size="xl"
      contentClassName={styles.body}
      fullscreen="sm-down"
    >
      <ModalHeader closeButton>
        {station &&
          station?.properties &&
          JSON.parse(station.properties.names).en}
      </ModalHeader>
      <div className={styles.modalBody}>
        <Tabs activeKey={activeTab} onSelect={(k) => toggleTab(k)}>
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
                  {station && station?.properties && (
                    <Badge
                      {...getBadgeProps(
                        JSON.parse(station.properties.roadAddress).roadNumber
                      )}
                    >
                      {JSON.parse(station.properties.roadAddress).roadNumber}
                    </Badge>
                  )}
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
        <ModalFooter>
          <p>Data provided by The Finnish Transport Agency</p>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default MapModal;
