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
import DataTable from "../StationData/StationData";
import { getBadgeProps } from "../../utils";
import styles from "./mapmodal.module.scss";

type MapModalProps = {
  closeModal: () => void;
  station: null | GeoJSON.Feature;
};

const MapModal = ({ closeModal, station }: MapModalProps) => {
  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab: string | null) => {
    if (tab && activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Modal
      show={Boolean(station)}
      onHide={closeModal}
      centered
      size="xl"
      contentClassName={styles.body}
      fullscreen="xl-down"
    >
      <ModalHeader closeButton>
        {station &&
          station?.properties &&
          JSON.parse(station.properties.names).en}
      </ModalHeader>
      <div className={styles.modalBody}>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => toggleTab(k)}
          unmountOnExit={true}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          justify={true}
        >
          <Tab eventKey="1" title="Info" className={styles.tabContent}>
            <Row>
              <Col sm="12">
                <p>
                  <b>Road number:</b>{" "}
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
                <p>
                  <b>Municipality:</b>{" "}
                  {station &&
                    station?.properties &&
                    station.properties.municipality}
                </p>
                <p>
                  <b>Province:</b>{" "}
                  {station &&
                    station?.properties &&
                    station.properties.province}
                </p>
                {station && station?.properties && station.id && (
                  <DataTable
                    stationProperties={station.properties}
                    stationId={station.id as number}
                  />
                )}
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="2" title="Charts" className={styles.tabContent}>
            <Row>
              <Col sm="12">
                {station && station?.properties && (
                  <CategoryChart
                    lam={station.properties.tmsNumber}
                    station={station}
                  />
                )}
              </Col>
            </Row>
          </Tab>
        </Tabs>
        <ModalFooter>
          <p>
            Source: Fintraffic /{" "}
            <a href="https://www.digitraffic.fi/en/road-traffic/">
              digitraffic.fi
            </a>
          </p>
          <p>
            (<a href="http://creativecommons.org/licenses/by/4.0/">CC 4.0 BY</a>
            )
          </p>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default MapModal;