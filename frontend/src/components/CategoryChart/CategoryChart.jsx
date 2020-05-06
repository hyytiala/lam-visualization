import React, { useState, useEffect } from 'react'
import lamService from '../../services/lamService'
import styles from './categorychart.module.scss'
import DatePicker from 'react-datepicker'
import { Spinner } from 'reactstrap'
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts'

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

const CategoryChart = ({ lam, ely }) => {

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
        setData(parseData(result))
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
    const result = await lamService.getStationData(time[0], ely, String(lam), time[1])
    setData(parseData(result))
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Show vehicle data for a day</h4>
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
            <PieChart width={430} height={400}>
              <Pie dataKey="value" isAnimationActive={false} data={data} cx={200} cy={200} outerRadius={120} fill="#8884d8" label>
                {
                  data.map((entry, index) => <Cell key={index} fill={COLORS[entry.name]} />)
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            :
            <p>No data for selected date</p>
          }
        </div>
      }
    </div>
  )
}

export default CategoryChart
