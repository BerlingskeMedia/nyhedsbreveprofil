import React, { Component } from 'react';
import { pageview } from 'react-ga';

export const withTracking = WrapperComponent => {
  if (window.location.host.includes('profil.berlingskemedia.dk')) {
    return class WithTracking extends Component {
      componentDidMount() {
        pageview(window.location.pathname + window.location.search);
      }

      render() {
        return <WrapperComponent {...this.props}/>;
      }
    }
  }

  return class WithNoTracking extends Component {
    componentDidMount() {
      console.log('[React GA] FAKE pageview (non-prod env):', window.location.pathname + window.location.search);
    }

    render() {
      return <WrapperComponent {...this.props}/>;
    }
  }
};