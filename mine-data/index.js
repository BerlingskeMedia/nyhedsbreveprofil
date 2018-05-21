import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './src/app';
import { scriptLoader } from './src/common/scriptLoader';
import { Api } from './src/common/api';

Api.get('/mine-data/config')
  .then(config => {
    return scriptLoader(`https://cdns.gigya.com/js/gigya.js?apikey=${config.gigyaApiKey}`, true)
      .then(() => {
        ReactDOM.render(<App config={config}/>, document.getElementById('content'));
      });
  })
  .catch(err => {
    console.error('Error loading Gigya script', err);
  });
