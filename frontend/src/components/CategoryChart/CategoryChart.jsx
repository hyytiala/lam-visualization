import React, { useState, useEffect } from 'react'
import lamService from '../../services/lamService'
import styles from './categorychart.module.scss'
import DatePicker from 'react-datepicker'
import { Spinner } from 'reactstrap'
import { PieChart, Pie, Legend, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const getYestarday = (date) => date.setDate(date.getDate() - 1)

const parseDate = (date) => {
  const parsed = new Date(date)
  const year = parsed.getFullYear()
  const start = new Date(year, 0, 0)
  const diff = parsed - start
  const oneDay = 1000 * 60 * 60 * 24
  const day = Math.floor(diff / oneDay)
  return [String(year), String(day)]
}

const parseData = (data) => {
  return [{ name: 'Cars', value: data.cars }, { name: 'Trucks', value: data.trucks },
  { name: 'Busses', value: data.busses }]
}

const parseHourData = (data) => {
  return data.map((e, i) => ({ name: i + 1, way1: e.way1, way2: e.way2 }))
}

const CategoryChart = ({ lam, ely, station }) => {

  const COLORS = {
    Cars: '#0088FE',
    Trucks: '#FFBB28',
    Busses: '#00C49F'
  }

  const [startDate, setStartDate] = useState(getYestarday(new Date()))
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const date = getYestarday(new Date())
      const time = parseDate(date)
      try {
        const result = await lamService.getStationData(time[0], ely, String(lam), time[1])
        const pieData = parseData(result.total)
        const barData = parseHourData(result.hourly)
        setData({ pie: pieData, bar: barData })
      } catch (error) {
        setData(null)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleDateChange = async (date) => {
    setStartDate(date)
    setLoading(true)
    const time = parseDate(date)
    try {
      const result = await lamService.getStationData(time[0], ely, String(lam), time[1])
      const pieData = parseData(result.total)
      const barData = parseHourData(result.hourly)
      setData({ pie: pieData, bar: barData })
    } catch (error) {
      setData(null)
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Select date</h4>
      <DatePicker
        selected={startDate}
        onChange={date => handleDateChange(date)}
        maxDate={getYestarday(new Date())}
        minDate={new Date('2000-01-01')}
        disabled={loading}
        className={styles.picker}
      />
      {loading ? <Spinner color="warning" />
        :
        <div className={styles.dataContent}>
          {data ?
            <>
              <h4 className={styles.title}>Trafic by vehicle type</h4>
              <PieChart width={650} height={320}>
                <Pie dataKey="value" isAnimationActive={false} data={data.pie} cx={325} cy={120}
                  outerRadius={120} fill="#8884d8" label>
                  {
                    data.pie.map((entry, index) => <Cell key={index} fill={COLORS[entry.name]} />)
                  }
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
              <h4 className={styles.title}>Trafic hourly by direction</h4>
              <BarChart width={650} height={300} data={data.bar} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="way1" fill="#8884d8" name={`to ${station.properties.direction1Municipality}`} />
                <Bar dataKey="way2" fill="#82ca9d" name={`to ${station.properties.direction2Municipality}`} />
              </BarChart>
            </>
            :
            <p>No data for selected date</p>
          }
        </div>
      }
    </div>
  )
}

export default CategoryChart
