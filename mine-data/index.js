import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './src/app';
import { scriptLoader } from './src/common/scriptLoader';

scriptLoader(`https://cdns.gigya.com/js/gigya.js?apikey=${process.env.GIGYA_API_KEY}`, true)
  .then(() => {
    ReactDOM.render(<App />, document.getElementById('content'));
  })
  .catch(() => {
    console.error('Error loading Gigya script');
  });
