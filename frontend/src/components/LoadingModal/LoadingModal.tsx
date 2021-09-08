import React from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import styles from "./loadingmodal.module.scss";

type LoadingModalProps = {
  loading: boolean;
  error: boolean;
};

const LoadingModal = ({ loading, error }: LoadingModalProps) => {
  return (
    <Modal
      show={loading}
      centered
      contentClassName={styles.content}
      dialogClassName={styles.modal}
    >
      <Spinner animation="border" variant={error ? "danger" : "dark"} />
      <h4>{error ? "Error, please reload" : "Loading..."}</h4>
    </Modal>
  );
};

export default LoadingModal;
