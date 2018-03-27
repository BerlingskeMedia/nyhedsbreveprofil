const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

class MineData extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <div>
        <h1>Mine data</h1>
        <h2>Abonnementsregister</h2>
        <h2>BT-Shop/Berlingske Shop</h2>
        <h2>Internt produktionsregister til rapportering mv.</h2>
        <h2>Kundeunivers.dk</h2>
        <h2>Mail system</h2>
        <h2>Marketingsregister til markedsundersøgelser</h2>
        <h2>Marketingsregister til salg og marketing</h2>
        <h2>Marketingsregister til telemarketing</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <MineData />,
  document.getElementById('content')
);
