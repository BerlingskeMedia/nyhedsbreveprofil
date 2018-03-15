var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

class MineData extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <h1>Mine data</h1>
    );
  }
}

ReactDOM.render(
  <MineData />,
  document.getElementById('content')
);
