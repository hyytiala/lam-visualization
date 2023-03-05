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
import { useQuery } from "@tanstack/react-query";
import { fetchStationData } from "../../services/lamService";
import { TmsStationDetails } from "../../types";
import { Spinner } from "react-bootstrap";

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
                <p>
                  <b>Road number:</b>{" "}
                  <Badge
                    {...getBadgeProps(stationDetails.roadAddress.roadNumber)}
                  >
                    {stationDetails.roadAddress.roadNumber}
                  </Badge>
                </p>
                <p>
                  <b>Municipality:</b> {stationDetails.municipality}
                </p>
                <p>
                  <b>Province:</b> {stationDetails.province}
                </p>
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
