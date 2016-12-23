import React, { Component } from 'react';
import Setup from './Setup';
import Dashboard from './Dashboard';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {logs: [], eventType: `all`};
  }

  componentDidMount(){
    fetch('api/logs',{}).then(response=>{
      if (response.status===200){
        response.json().then(logs=> {
          this.setState({
            logs: logs
          })
        });
      }
    });
  }

  selectionChanged(event){
    let filtered = event.target.value;
    fetch('api/logs',{}).then(response=>{
      if (response.status===200){
        response.json().then(logs=> {
          if (filtered!==`all`){
            logs = logs.filter(l=>l.eventType===filtered);
          }
          this.setState({
            logs: logs
          })
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div className="content">
            {this.props.setup.completed ? <Dashboard events={this.state.logs} selectionChange={this.selectionChanged.bind(this)}/> : <Setup/>}
        </div>
      </div>
    );
  }
}

export default App;
