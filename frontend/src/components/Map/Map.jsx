import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import styles from './map.module.scss'
import lamService from '../../services/lamService'
import iconImage from '../../images/marker-icon.png'
import MapModal from '../MapModal/MapModal'
import LoadingModal from '../LoadingModal/LoadingModal'

//const MAP_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const MAP_URL = 'https://api.mapbox.com/styles/v1/ohyytiala/ck9v3i89k0p431iqlmf9ui05o/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib2h5eXRpYWxhIiwiYSI6ImNqdGg4aGdlbzBheWw0M282NDV0azJ5cmwifQ.PF1W8LWaCPGjz79qxbv-4Q'
const ATTRIBUTION = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

const marker = L.Icon.extend({
  options: {
    iconUrl: iconImage,
    iconRetinaUrl: null,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'leaflet-div-icon'
  }
})

const mock = {
  id: 23008,
  properties: {
    annualMaintenanceTime: null,
    calculatorDeviceType: null,
    collectionInterval: 300,
    collectionStatus: "GATHERING",
    coordinatesETRS89: (3)[396062, 6693224, 0],
    country: null,
    direction1Municipality: "Lahti",
    direction1MunicipalityCode: 398,
    direction2Municipality: "Helsinki",
    direction2MunicipalityCode: 91,
    liviId: "LAMM1062",
    municipality: "Vantaa",
    municipalityCode: "92",
    name: "vt4_Kerava_Jokivarsi",
    names: { fi: "Tie 4 Kerava, Jokivarsi", sv: "Väg 4 Kervo, Jokivarsi", en: "Road 4 Kerava, Jokivarsi" },
    province: "Uusimaa",
    provinceCode: "1",
    purpose: "ajantasa",
    repairMaintenanceTime: null,
    roadAddress: { roadNumber: 4, roadSection: 106, distanceFromRoadSectionStart: 2059, carriagewayCode: 2, roadMaintenanceClass: "1" },
    roadStationId: 23008,
    sensorData: 1934,
    startTime: "2017-09-18T00:00:00Z",
    state: "OK",
    stationSensors: [5054, 5055, 5056, 5057, 5058, 5061, 5064, 5067, 5068, 5071, 5116, 5119, 5122, 5125, 5158, 5161, 5164, 5168],
    tmsNumber: 8,
    tmsStationType: "DSL_4",
  }
}

const Map = () => {

  const mapRef = useRef(null)
  const stations = useRef(null)

  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(false)

  const toggle = () => setModal(!modal)

  useEffect(() => {
    stations.current = new L.FeatureGroup()
    L.Icon.Default = marker
    mapRef.current = L.map('map', {
      center: [60.2908, 24.5324],
      zoom: 9,
      maxBounds: [
        [82.80, -1000],
        [-82.86, 1000]
      ],
      maxZoom: 18,
      minZoom: 3,
      preferCanvas: true,
      worldCopyJump: true,
      fadeAnimation: false,
      zoomControl: true,
      maxBoundsViscosity: 1.0,
      layers: [
        L.tileLayer(MAP_URL, {
          zIndex: 50,
          attribution: ATTRIBUTION
        })
      ]
    })
    const fetchData = async () => {
      const result = await lamService.getStations()
      const data = await lamService.getVolume()
      L.geoJSON(result, {
        style: {
          color: '#333'
        },
        onEachFeature: function (feature, layer) {
          const sensor = data.tmsStations.filter(s => s.id === feature.id)[0]
          const way1 = sensor.sensorValues.filter(v => v.name === 'OHITUKSET_60MIN_KIINTEA_SUUNTA1')[0]
          const way2 = sensor.sensorValues.filter(v => v.name === 'OHITUKSET_60MIN_KIINTEA_SUUNTA2')[0]
          const avg1 = sensor.sensorValues.filter(v => v.name === 'KESKINOPEUS_60MIN_KIINTEA_SUUNTA1')[0]
          const avg2 = sensor.sensorValues.filter(v => v.name === 'KESKINOPEUS_60MIN_KIINTEA_SUUNTA2')[0]
          feature.properties.passes = {
            way1: way1 ? way1.sensorValue : -1,
            way2: way2 ? way2.sensorValue : -1,
            total: (way1 && way2) ? way1.sensorValue + way1.sensorValue : -1
          }
          feature.properties.speed = {
            way1: avg1 ? avg1.sensorValue : -1,
            way2: avg2 ? avg2.sensorValue : -1,
            total: (avg1 && avg2) ? (avg1.sensorValue + avg2.sensorValue) / 2 : -1
          }
          layer.on('click', (e) => {
            setSelected(feature)
            setModal(true)
          })
        },
        pointToLayer: function (feature, latlng) {
          const sensor = data.tmsStations.filter(s => s.id === feature.id)[0]
          const way1 = sensor.sensorValues.filter(v => v.name === 'OHITUKSET_60MIN_KIINTEA_SUUNTA1')[0]
          const way2 = sensor.sensorValues.filter(v => v.name === 'OHITUKSET_60MIN_KIINTEA_SUUNTA2')[0]
          const value = (way1 && way2) ? way1.sensorValue + way1.sensorValue : 0
          const OldRange = 5000 - 1
          const NewRange = 20 - 5
          const NewValue = Math.round((((value - 1) * NewRange) / OldRange) + 5)
          return L.circleMarker(latlng, {
            // Stroke properties
            color: '#5EA4D4',
            opacity: 0.75,
            weight: 2,

            // Fill properties
            fillColor: '#5EA4D4',
            fillOpacity: 0.25,

            radius: NewValue
          });
        }
      }).addTo(mapRef.current)
      setLoading(false)
    }

    fetchData()
  }, [mapRef])

  return (
    <div id='map' className={styles.map}>
      <LoadingModal loading={loading} />
      <MapModal
        modal={modal}
        toggle={toggle}
        station={selected}
      />
    </div>
  )
}

export default Map
