var React = require('react');

var Checkbox = require('./checkbox');
module.exports = React.createClass({
  render: function() {

    var items = this.props.data.map(function(item) {
      return (
        <Checkbox key={item.interesse_id} id={item.interesse_id} label={item.interesse_navn} data={item} toggle={this.props.toggle} />
      );
    }.bind(this));

    return (
      <div className="CheckboxList">
        {items}
      </div>
    );
  }
});
