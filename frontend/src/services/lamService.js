import axios from 'axios'

const getStations = async () => {
  const response = await axios.get('https://tie.digitraffic.fi/api/v3/metadata/tms-stations')
  return response.data
}

const getVolume = async () => {
  const response = await axios.get('https://tie.digitraffic.fi/api/v1/data/tms-data')
  return response.data
}

export default {
  getStations,
  getVolume
}