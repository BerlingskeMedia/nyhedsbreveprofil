import React  from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { MyDataPage } from './MyDataPage/MyDataPage';

import '../assets/styles.scss';

class HomePage extends React.Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push('/mine-data');
    }
  }

  render() {
    return (
      <Route path="/mine-data" render={MyDataPage}/>
    );
  }
}

export const App = () => (
  <BrowserRouter>
    <Route path="/" component={HomePage}/>
  </BrowserRouter>
);
