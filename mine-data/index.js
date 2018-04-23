import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './src/app';
import { scriptLoader } from './src/common/scriptLoader';

scriptLoader(`https://cdns.gigya.com/js/gigya.js?apikey=3__cAWpT5nWqkxSuly0T2OJd2svumYf1rvKWweeUeUdqlIrbgnoZLFxtky7eQZjbZJ`, true)
  .then(() => {
    ReactDOM.render(<App />, document.getElementById('content'));
  })
  .catch(() => {
    console.error('Error loading Gigya script');
  });
