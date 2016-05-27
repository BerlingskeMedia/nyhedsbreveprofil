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
      <div className="CheckboxList form">
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
        <div className="checkbox">
          <label htmlFor={this.props.data.id}>
            <input type="checkbox" id={this.props.data.id} checked={this.state.checked} onChange={this.onChange} />
            {this.props.data.navn}
            {this.props.data.description ? <span style={{fontStyle: 'italic', marginLeft: '2px'}}>{this.props.data.description}</span> : null }
          </label>
        </div>
        {this.state.checked && this.props.data.permissiontext ? <div style={{marginTop: '5px', marginBottom: '5px'}}>{this.props.data.permissiontext}</div> : null }
        {this.state.checked && this.props.data.interestsSelection ? <div>{this.props.data.interestsSelection}</div> : null }
      </div>
    );
  }
});
