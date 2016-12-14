import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const viewModel = {
  setup: {
    completed: true
  }
}

ReactDOM.render(
  <App setup={viewModel.setup} />,
  document.getElementById('root')
);
