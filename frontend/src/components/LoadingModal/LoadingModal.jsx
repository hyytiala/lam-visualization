import React from 'react'
import { Modal, Spinner } from 'reactstrap'
import styles from './loadingmodal.module.scss'

const LoadingModal = ({ loading, error }) => {
  return (
    <Modal isOpen={loading} centered contentClassName={styles.content} className={styles.modal}>
      <Spinner color={error ? "danger" : "warning"} />
      <h4>{error ? 'Error, please reload' : 'Loading...'}</h4>
    </Modal>
  )
}

export default LoadingModal
