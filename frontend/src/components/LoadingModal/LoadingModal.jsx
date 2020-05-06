import React from 'react'
import { Modal, Spinner } from 'reactstrap'
import styles from './loadingmodal.module.scss'

const LoadingModal = ({ loading }) => {
  return (
    <Modal isOpen={loading} centered contentClassName={styles.content} className={styles.modal}>
      <Spinner color="warning" />
        <h4>Loading...</h4>
    </Modal>
  )
}

export default LoadingModal
