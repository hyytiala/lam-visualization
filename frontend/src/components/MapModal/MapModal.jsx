import React, { useState } from 'react'
import styles from './mapmodal.module.scss'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap'
import classnames from 'classnames'

import CategoryChart from '../CategoryChart/CategoryChart'
import DataTable from '../DataTable/DataTable'

const MapModal = ({ modal, toggle, station }) => {

  const [activeTab, setActiveTab] = useState('1')

  const toggleTab = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const getElyNumber = (ely) => {
    switch (ely) {
      case "1":
      case "5":
      case "7":
        return '01'
      case "2":
      case "4":
        return '02'
      case "6":
        return '04'
      case "8":
      case "9":
        return '03'
      case "10":
      case "11":
      case "12":
        return '08'
      case "13":
        return '09'
      case "14":
      case "15":
      case "16":
        return '10'
      case "17":
      case "18":
        return '12'
      case "19":
        return '14'
      default:
        return '01'
    }
  }

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>{modal && station.properties.names.en}</ModalHeader>
      <ModalBody>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' }, styles.tabBtn)}
              onClick={() => { toggleTab('1') }}
            >
              Info
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' }, styles.tabBtn)}
              onClick={() => { toggleTab('2') }}
            >
              Charts
          </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className={styles.tabContent}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <h4>Station details</h4>
                <p>Municipality: {modal && station.properties.municipality}</p>
                <p>Province: {modal && station.properties.province}</p>
                <p>Road number: {modal && station.properties.roadAddress.roadNumber}</p>
                <h4>Station data for latest hour</h4>
                <DataTable data={station.properties}/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                {modal && 
                <CategoryChart 
                lam={station.properties.tmsNumber} 
                ely={getElyNumber(station.properties.provinceCode)} 
                station={station}
                />
                }
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </ModalBody>
    </Modal>
  )
}

export default MapModal
