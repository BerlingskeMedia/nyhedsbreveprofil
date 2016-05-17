var React = require('react');
// var Checkbox = require('./checkbox');

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

var Checkbox = React.createClass({
  getInitialState: function() {
    return {checked: this.props.data.preselect ? true : false};
  },
  onChange: function() {
    this.setState({checked: !this.state.checked}, function (previousState, currentProps) {
      // Sending info to parent that the user has toggled the subscription
      this.props.toggle(this.state.checked, this.props.data);
    }.bind(this));
  },
  render: function() {
    return (
      <div className="MdbCheckbox">
        <input type="checkbox" id={this.props.data.id} checked={this.state.checked} onChange={this.onChange} />
        <label htmlFor={this.props.data.id}>{this.props.data.navn}</label>
        {this.props.data.description ? <span style={{fontStyle: 'italic', marginLeft: '2px'}}>{this.props.data.description}</span> : null }
        {this.state.checked && this.props.data.permissiontext ? <div>{this.props.data.permissiontext}</div> : null }
        {this.state.checked && this.props.data.interestsSelection ? <div>{this.props.data.interestsSelection}</div> : null }
      </div>
    );
  }
});
