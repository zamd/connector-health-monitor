
import React from 'react';


const Message = (props)=> (
  <tr>
      <td className="truncate" title={props.eventType}>
            <span title={props.eventType}>{props.eventType}</span>
      </td>
      <td className="truncate">
          <span title={props.description}>{props.description}</span>
      </td>
      <td className="truncate">
          <span title={props.date}>{props.date}</span>
      </td>
  </tr>
)


export default Message;
