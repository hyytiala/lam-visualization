import React, { useState, useEffect } from "react";
import { getStationData } from "../../services/lamService";
import styles from "./categorychart.module.scss";
import DatePicker, { registerLocale } from "react-datepicker";
import el from "date-fns/locale/en-GB";
import Spinner from "react-bootstrap/Spinner";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import moment from "moment";
import { TmsData, DataState, Total, Hourly } from "../../types";
import { COLORS } from "../../utils";

type CategoryChartProps = {
  lam: number;
  ely: string;
  station: any;
};

const getYesterday = () => {
  const date = new Date();
  date.setHours(date.getHours() - 3);
  date.setDate(date.getDate() - 1);
  return date;
};

const parseDate = (date: Date) => {
  const year = date.getFullYear();
  const day = moment(date).dayOfYear();
  return [String(year), String(day)];
};

const getBarWidth = () =>
  window.innerWidth > 700 ? 700 : window.innerWidth - 50;
const getPieWidth = () =>
  window.innerWidth > 500 ? 400 : window.innerWidth - 50;
const getPieRadius = () => (window.innerWidth > 500 ? 120 : 90);

const parseData = (data: Total) => {
  return [
    { name: "Cars", value: data.cars, total: data.total },
    { name: "Trucks", value: data.trucks },
    { name: "Busses", value: data.busses },
  ];
};

const parseHourData = (data: Hourly[]) => {
  return data.map((e, i) => ({ name: i, way1: e.way1, way2: e.way2 }));
};

const CategoryChart = ({ lam, ely, station }: CategoryChartProps) => {
  const [startDate, setStartDate] = useState(getYesterday());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataState>(null);

  useEffect(() => {
    const fetchData = async () => {
      const date = getYesterday();
      const time = parseDate(date);
      try {
        const result = await getStationData(time[0], ely, String(lam), time[1]);
        const pieData = parseData(result.total);
        const barData = parseHourData(result.hourly);
        setData({ pie: pieData, bar: barData });
      } catch (error) {
        setData(null);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDateChange = async (date: Date) => {
    if (date) {
      setStartDate(date);
      setLoading(true);
      const time = parseDate(date);
      try {
        const result: TmsData = await getStationData(
          time[0],
          ely,
          String(lam),
          time[1]
        );
        const pieData = parseData(result.total);
        const barData = parseHourData(result.hourly);
        setData({ pie: pieData, bar: barData });
      } catch (error) {
        setData(null);
      }
      setLoading(false);
    }
  };
  registerLocale("en-GB", el);
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Select date</h4>
      <DatePicker
        selected={startDate}
        dateFormat="dd.MM.yyyy"
        locale="en-GB"
        onChange={(date: Date) => handleDateChange(date)}
        maxDate={getYesterday()}
        minDate={new Date("2000-01-01")}
        disabled={loading}
        className={styles.picker}
      />
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div className={styles.dataContent}>
          {data ? (
            <>
              <div>
                <h4 className={styles.title}>Traffic by vehicle type</h4>
                <p>Total: {data.pie[0].total} vehicles</p>
                <PieChart
                  width={getPieWidth()}
                  height={400}
                  style={{ margin: "auto" }}
                >
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={data.pie}
                    outerRadius={getPieRadius()}
                    label
                  >
                    {data.pie.map((entry, index) => (
                      <Cell key={index} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
              <div>
                <h4 className={styles.title}>Traffic hourly by direction</h4>
                <BarChart
                  width={getBarWidth()}
                  height={400}
                  data={data.bar}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="way1"
                    fill="#1b263b"
                    name={`to ${
                      station.properties.direction1Municipality || "Way 1"
                    }`}
                  />
                  <Bar
                    dataKey="way2"
                    fill="#d66853"
                    name={`to ${
                      station.properties.direction2Municipality || "Way 2"
                    }`}
                  />
                </BarChart>
              </div>
            </>
          ) : (
            <p>No data for selected date</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryChart;
