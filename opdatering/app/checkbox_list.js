var React = require('react');

var Checkbox = require('./checkbox');
module.exports = React.createClass({
  render: function() {

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
});
