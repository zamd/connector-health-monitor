import React from 'react'
import Logs from './Logs';

const Dashboard = (props) => (
  <div className="container root-container">
    <h2>Health Monitor Dashboard</h2>

      <select
        className="form-control"
        onChange={props.selectionChange}
        name="event_type"
        id="event-type-select">
                <option value="all">All</option>
                <option value="error">Errors</option>
                <option value="warning">Warning</option>
                <option value="debug">Debug</option>
      </select>

    <Logs events={props.events}/>
  </div>
)

export default Dashboard;
