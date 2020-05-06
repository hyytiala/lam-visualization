import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import styles from './map.module.scss'
import lamService from '../../services/lamService'
import iconImage from '../../images/marker-icon.png'
import MapModal from '../MapModal/MapModal'

//const MAP_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const MAP_URL = 'https://api.mapbox.com/styles/v1/ohyytiala/ck9v3i89k0p431iqlmf9ui05o/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib2h5eXRpYWxhIiwiYSI6ImNqdGg4aGdlbzBheWw0M282NDV0azJ5cmwifQ.PF1W8LWaCPGjz79qxbv-4Q'

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

const Map = () => {

  const mapRef = useRef(null)
  const stations = useRef(null)

  const [modal, setModal] = useState(false)
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
          attribution: 'OpenStreet map'
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
          const passValue = (way1 && way2) ? way1.sensorValue + way1.sensorValue : 0
          const speedValue = (avg1 && avg2) ? (avg1.sensorValue + avg2.sensorValue) / 2 : 0
          feature.properties.passes = passValue
          feature.properties.speed = speedValue
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
          console.log(NewValue)
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
    }

    fetchData()
  }, [mapRef])

  return (
    <div id='map' className={styles.map}>
      <MapModal
        modal={modal}
        toggle={toggle}
        station={selected}
      />
    </div>
  )
}

export default Map
