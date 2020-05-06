import axios from 'axios'

const URL = process.env.PROD === 'true' ? 'https://spotishare.live/lam' : 'http://localhost:3001'
console.log(URL)

const getStations = async () => {
  const response = await axios.get('https://tie.digitraffic.fi/api/v3/metadata/tms-stations')
  return response.data
}

const getVolume = async () => {
  const response = await axios.get('https://tie.digitraffic.fi/api/v1/data/tms-data')
  return response.data
}

const getStationData = async (year, ely, lam, day) => {
  const response = await axios.get(`${URL}/api?year=${year}&ely=${ely}&lam=${lam}&day=${day}`)
  return response.data
}

export default {
  getStations,
  getVolume,
  getStationData
}