import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const viewModel = {
  setup: {
    completed: false
  }
}

fetch('/api/dbsize').then(response=>
response.json().then(db=>{
  viewModel.setup.completed = db.sizeInBytes>20
  ReactDOM.render(
    <App setup={viewModel.setup} />,
    document.getElementById('root')
  );
  }
));
