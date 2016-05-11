var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {checked: this.props.data.preselect ? true : false};
  },
  onChange: function() {
    this.setState({checked: !this.state.checked}, function (previousState, currentProps) {
      this.props.toggle(this.state.checked, this.props.data);
    }.bind(this));
  },
  render: function() {
    return (
      <div className="MdbCheckbox">
        <input type="checkbox" id={this.props.id} checked={this.state.checked} onChange={this.onChange} />
        {this.props.label}
      </div>
    );
  }
});
