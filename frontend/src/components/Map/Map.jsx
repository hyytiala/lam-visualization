import React, { useEffect, useRef, useState } from 'react'
import L, { latLng } from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.heat'
import styles from './map.module.scss'
import lamService from '../../services/lamService'
import iconImage from '../../images/marker-icon.png'
import MapModal from '../MapModal/MapModal'
import LoadingModal from '../LoadingModal/LoadingModal'

//const MAP_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const MAP_URL = 'https://api.mapbox.com/styles/v1/ohyytiala/ck9v3i89k0p431iqlmf9ui05o/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib2h5eXRpYWxhIiwiYSI6ImNqdGg4aGdlbzBheWw0M282NDV0azJ5cmwifQ.PF1W8LWaCPGjz79qxbv-4Q'
const ATTRIBUTION = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'


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
    startTime: "2017-09-18T00:00:00Z",
    state: "OK",
    stationSensors: [5054, 5055, 5056, 5057, 5058, 5061, 5064, 5067, 5068, 5071, 5116, 5119, 5122, 5125, 5158, 5161, 5164, 5168],
    tmsNumber: 8,
    tmsStationType: "DSL_4",
    speed: {
      way1: 10,
      way2: 20,
      total: 30
    },
    passes: {
      way1: 10,
      way2: 20,
      total: 30
    }
  }
}

const Map = () => {

  const mapRef = useRef(null)
  const stations = useRef(null)
  const cluster = useRef(null)
  const heatmap = useRef(null)

  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState(false)

  const toggle = () => setModal(!modal)

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    })
    stations.current = new L.LayerGroup()
    heatmap.current = new L.LayerGroup()
    cluster.current = L.markerClusterGroup()
    const layer = L.tileLayer(MAP_URL, {
      zIndex: 50,
      attribution: ATTRIBUTION
    })
    const overlayMaps = {
      "Heatmap": heatmap.current
    }
    mapRef.current = L.map('map', {
      center: [65.4536, 26.4440],
      zoom: 6,
      maxBounds: [
        [71.84, 53.15],
        [54.77, 1.80]
      ],
      maxZoom: 18,
      minZoom: 6,
      preferCanvas: true,
      fadeAnimation: false,
      zoomControl: true,
      maxBoundsViscosity: 1.0,
      layers: layer
    })

    L.control.layers(null, overlayMaps, { collapsed: false }).addTo(mapRef.current)

    window.map = mapRef.current
    const fetchData = async () => {
      const heatLayer = []
      try {
        const result = await lamService.getStations()
        const data = await lamService.getVolume()
        cluster.current.addLayer(L.geoJSON(result, {
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
            const OldRange = 6000 - 1
            const NewRange = 2000 - 1
            const NewValue = ((((value - 1) * NewRange) / OldRange) + 1).toFixed(4)
            heatLayer.push([latlng.lat, latlng.lng, NewValue])
            /* return L.circleMarker(latlng, {
              // Stroke properties
              color: '#5EA4D4',
              opacity: 0.75,
              weight: 2,
  
              // Fill properties
              fillColor: '#5EA4D4',
              fillOpacity: 0.25,
  
              radius: NewValue
            }); */
            return L.marker(latlng)
          }
        })).addTo(mapRef.current)
        heatmap.current.addLayer(L.heatLayer(heatLayer, { radius: 20, blur: 30, max: 1 }))
        setLoading(false)
      } catch (error) {
        setError(true)
      }
    }
    fetchData()
  }, [mapRef])

  return (
    <div id='map' className={styles.map}>
      <LoadingModal loading={loading} error={error} />
      <MapModal
        modal={modal}
        toggle={toggle}
        station={selected}
      />
    </div>
  )

  /* return (
    <div id='map' className={styles.map}>
      <LoadingModal loading={false} />
      <MapModal
        modal={true}
        toggle={toggle}
        station={mock}
      />
    </div>
  ) */
}

export default Map
