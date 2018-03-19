const React = require('react');
const Checkbox = require('./checkbox');

module.exports = class extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var items = this.props.data.map(function(item) {
      return (
        <Checkbox key={item.id} data={item} toggle={this.props.toggle} />
      );
    }.bind(this));

    return (
      <div className="CheckboxList">
        {items}
      </div>
    );
  }
}
