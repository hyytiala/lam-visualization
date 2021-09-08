import React from "react";
import Table from "react-bootstrap/Table";

type DataTableProps = {
  data: { [name: string]: any };
};

const DataTable = ({ data }: DataTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Direction:</th>
          <th>vehicles</th>
          <th>average speed</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">to {data.direction1Municipality || "Way 1"}</th>
          <td>{JSON.parse(data.passes).way1}</td>
          <td>{JSON.parse(data.speed).way1} km/h</td>
        </tr>
        <tr>
          <th scope="row">to {data.direction2Municipality || "Way 2"}</th>
          <td>{JSON.parse(data.passes).way2}</td>
          <td>{JSON.parse(data.speed).way2} km/h</td>
        </tr>
        <tr>
          <th scope="row">total</th>
          <td>{JSON.parse(data.passes).total}</td>
          <td>{JSON.parse(data.speed).total} km/h</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default DataTable;
