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
import { Spinner } from "react-bootstrap";
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

  const coatOfArmsBaseUrl = "https://dd3lu7m75l6x2.cloudfront.net/images";

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
          <Tab eventKey="1" title="Info">
            <Row className={styles.tabContent}>
              <Col>
                <h4>Station details</h4>
                <div className={styles.detailsStack}>
                  <span>Road</span>
                  <TrafficSign
                    color={getRoadSignColor(
                      stationDetails.roadAddress.roadNumber
                    )}
                  >
                    <span>{stationDetails.roadAddress.roadNumber}</span>
                  </TrafficSign>
                  <span>Municipality</span>
                  <TrafficSign color="blue">
                    <div className={styles.signContent}>
                      <div className={styles.signBg}>
                        <img
                          src={`${coatOfArmsBaseUrl}/municipalities/${stationDetails.municipalityCode}.svg`}
                          alt="municipality coat of arms"
                        />
                      </div>
                      <span>{stationDetails.municipality}</span>
                    </div>
                  </TrafficSign>
                  <span>Province</span>
                  <TrafficSign color="blue">
                    <div className={styles.signContent}>
                      <div className={styles.signBg}>
                        <img
                          src={`${coatOfArmsBaseUrl}/regions/${stationDetails.provinceCode}.svg`}
                          alt="Province coat of arms"
                        />
                      </div>
                      <span>{stationDetails.province}</span>
                    </div>
                  </TrafficSign>
                </div>
              </Col>
              <Col md={8}>
                {data && stationDetails && (
                  <DataTable stationProperties={stationDetails} />
                )}
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
