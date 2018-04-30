import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './src/app';
import { scriptLoader } from './src/common/scriptLoader';
import { Api } from './src/common/api';

Api.get('/mine-data/config')
  .then(response => response.json())
  .then(config => scriptLoader(`https://cdns.gigya.com/js/gigya.js?apikey=${config.gigyaApiKey}`, true))
  .then(() => {
    ReactDOM.render(<App/>, document.getElementById('content'));
  })
  .catch(() => {
    console.error('Error loading Gigya script');
  });
