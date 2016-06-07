var React = require('react');

module.exports = React.createClass({
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
      <div className="mdbCheckbox">
        <div className="checkbox">
          <input type="checkbox" id={this.props.data.id} checked={this.state.checked} onChange={this.onChange} />
          <label className="control-label" htmlFor={this.props.data.id}>
            {this.props.data.navn}
            {this.props.data.description ? <div className="description">{this.props.data.description}</div> : null }
          </label>
        </div>
        {this.state.checked && this.props.data.permissiontext ? <div className="permissiontext">{this.props.data.permissiontext}</div> : null }
        {this.state.checked && this.props.data.interestsSelection ? <div className="interestsSelection">{this.props.data.interestsSelection}</div> : null }
      </div>
    );
  }
});
