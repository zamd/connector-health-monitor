import React from 'react';
import Message from './Message';

const Logs = (props) => (
  <div id="logs-list" className="" role="grid">
      <table className="table data-table" style={{textTransform: "table-layout:fixed"}}>
          <thead>
              <tr>
                  <th width="10%">Event</th>
                  <th width="70%">Description</th>
                  <th width="20%" data-column="date">Date</th>
              </tr>
          </thead>
          <tbody>
            {props.events.map((e,i)=>
              <Message key={i} eventType={e.eventType} description={e.message} date={e.date}/>
            )}
          </tbody>
      </table>
    </div>
)

export default Logs;
