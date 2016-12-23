import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const viewModel = {
  setup: {
    completed: false
  }
}

fetch('api/agent/status').then(response=>
response.json().then(r=>{
  viewModel.setup.completed = r.configured
  ReactDOM.render(
    <App setup={viewModel.setup} />,
    document.getElementById('root')
  );
  }
));
