import React from 'react'
import { Table } from 'reactstrap'

const DataTable = ({ data }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Direction:</th>
          <th>to {data.direction1Municipality}</th>
          <th>to {data.direction2Municipality}</th>
          <th>total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">amount</th>
          <td>{data.passes.way1}</td>
          <td>{data.passes.way2}</td>
          <td>{data.passes.total}</td>
        </tr>
        <tr>
          <th scope="row">avg. speed</th>
          <td>{data.speed.way1} km/h</td>
          <td>{data.speed.way2} km/h</td>
          <td>{data.speed.total} km/h</td>
        </tr>
      </tbody>
    </Table>
  )
}

export default DataTable