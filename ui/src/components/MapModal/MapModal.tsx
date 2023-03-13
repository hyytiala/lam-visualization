import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CategoryChart from "../CategoryChart/CategoryChart";
import DataTable from "../StationData/StationData";
import { getRoadSignColor } from "../../utils";
import styles from "./mapmodal.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchStationData } from "../../services/lamService";
import { TmsStationDetails } from "../../types";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import TrafficSign from "../TrafficSign/TrafficSign";

type MapModalProps = {
  closeModal: () => void;
  stationId: number;
};

const MapModal = ({ closeModal, stationId }: MapModalProps) => {
  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab: string | null) => {
    if (tab && activeTab !== tab) setActiveTab(tab);
  };

  const { data, isError, isFetching } = useQuery({
    queryKey: ["stationDetails", stationId],
    queryFn: () => fetchStationData(stationId),
  });

  if (isError) return <></>;
  if (!data && isFetching) return <Spinner animation="border" />;

  const stationDetails = data?.properties as TmsStationDetails;

  return (
    <Modal
      show={true}
      onHide={closeModal}
      centered
      size="xl"
      contentClassName={styles.body}
      fullscreen="xl-down"
    >
      <ModalHeader closeButton>{stationDetails.names.en}</ModalHeader>
      <div className={styles.modalBody}>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => toggleTab(k)}
          unmountOnExit={true}
          justify={true}
        >
          <Tab eventKey="1" title="Info" className={styles.tabContent}>
            <Row>
              <Col sm="12">
                <div className={styles.stack}>
                  <TrafficSign color="blue">
                    <div className={styles.infoBox}>
                      <div className={styles.roadRow}>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="road-number">Road number</Tooltip>
                          }
                          defaultShow={true}
                        >
                          <div>
                            <TrafficSign
                              color={getRoadSignColor(
                                stationDetails.roadAddress.roadNumber
                              )}
                              noEdges={true}
                            >
                              {stationDetails.roadAddress.roadNumber}
                            </TrafficSign>
                          </div>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="municipality-name">
                              Municipality name
                            </Tooltip>
                          }
                          defaultShow={true}
                        >
                          <span>{stationDetails.municipality}</span>
                        </OverlayTrigger>
                      </div>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="province-name">Province name</Tooltip>
                        }
                        defaultShow={true}
                      >
                        <span>{stationDetails.province}</span>
                      </OverlayTrigger>
                    </div>
                  </TrafficSign>
                  {data && stationDetails && (
                    <DataTable stationProperties={stationDetails} />
                  )}
                </div>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="2" title="Charts" className={styles.tabContent}>
            <Row>
              <Col sm="12">
                <CategoryChart stationProperties={stationDetails} />
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
