import React, { useState, useEffect } from "react";
import { getStationData } from "../../services/lamService";
import styles from "./categorychart.module.scss";
import DatePicker, { registerLocale } from "react-datepicker";
import el from "date-fns/locale/en-GB";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { getYear, getDayOfYear, subDays } from "date-fns";
import { TmsData, DataState } from "../../types";
import { getHourString } from "../../utils";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type CategoryChartProps = {
  lam: number;
  station: GeoJSON.Feature;
};

const parseDate = (date: Date) => [
  String(getYear(date)),
  String(getDayOfYear(date)),
];

const apexOptions: ApexOptions = {
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "80%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: Array(24)
      .fill(0)
      .map((x, y) => getHourString(x + y)),
  },
  tooltip: {
    shared: true,
    intersect: false,
    x: {
      formatter: (val) => `${val} - ${getHourString(Number(val) + 1)}`,
    },
  },
  responsive: [
    {
      breakpoint: 576,
      options: {
        chart: {
          type: "bar",
          height: 600,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: "80%",
          },
        },
      },
    },
  ],
};

const pieOptions: ApexOptions = {
  chart: {
    width: 380,
    type: "donut",
    offsetY: 30,
  },
  labels: ["Cars", "Trucks", "Busses"],
  legend: {
    position: "bottom",
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
        labels: {
          show: true,
          name: {
            show: true,
          },
          value: {
            show: true,
          },
          total: {
            show: true,
            showAlways: false,
            label: "Total",
            color: "#373d3f",
            formatter: (w) =>
              w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0),
          },
        },
      },
    },
  },
};

const CategoryChart = ({ lam, station }: CategoryChartProps) => {
  const [startDate, setStartDate] = useState(subDays(new Date(), 1));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataState | null>(null);
  const fetchData = async (date: Date) => {
    const time = parseDate(date);
    try {
      const result: TmsData = await getStationData(
        time[0],
        String(lam),
        time[1]
      );
      const pieData = [
        result.total.cars,
        result.total.trucks,
        result.total.busses,
      ];
      const barData = [
        {
          name: `to ${station.properties?.direction1Municipality || "Way 1"}`,
          data: result.hourly.map(({ way1 }) => way1),
        },
        {
          name: `to ${station.properties?.direction2Municipality || "Way 2"}`,
          data: result.hourly.map(({ way2 }) => way2),
        },
      ];
      setData({ pie: pieData, bar: barData, speeds: result.speeds });
    } catch (error) {
      setData(null);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData(startDate);
  }, []);

  const handleDateChange = (date: Date) => {
    if (date) {
      setLoading(true);
      setStartDate(date);
      fetchData(date);
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
        maxDate={subDays(new Date(), 1)}
        minDate={new Date("2000-01-01")}
        disabled={loading}
        className="form-control"
      />
      {loading ? (
        <Spinner animation="border" className={styles.loader} />
      ) : (
        <div className={styles.dataContent}>
          {data ? (
            <>
              <div className={styles.pie}>
                <div>
                  <h4 className={styles.title}>Traffic by vehicle type</h4>
                  <ReactApexChart
                    options={pieOptions}
                    series={data.pie}
                    type="donut"
                    width={400}
                  />
                </div>
                <div className={styles.speeds}>
                  <Table>
                    <tbody>
                      <tr>
                        <th scope="row">Average speed</th>
                        <td>{`${data.speeds.average.toFixed()} km/h`}</td>
                      </tr>
                      <tr>
                        <th scope="row">Max speed</th>
                        <td>{`${data.speeds.max.toFixed()} km/h`}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className={styles.bar}>
                <h4 className={styles.title}>Traffic hourly by direction</h4>
                <ReactApexChart
                  options={apexOptions}
                  series={data.bar}
                  type="bar"
                />
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
