import React from 'react'
import styles from './mapmodal.module.scss'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const MapModal = ({ modal, toggle, station }) => {
  console.log(station)
  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>{modal && station.properties.names.en}</ModalHeader>
      <ModalBody>
        <h4>Station details</h4>
        <p>Municipality: {modal && station.properties.municipality}</p>
        <p>Province: {modal && station.properties.province}</p>
        <p>Road number: {modal && station.properties.roadAddress.roadNumber}</p>
        <h4>Station data for latest hour</h4>
        <p>Hourly passes: {modal && station.properties.passes} vehicles/h</p>
        <p>Hourly average speed: {modal && station.properties.speed} km/h</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  )
}

export default MapModal
