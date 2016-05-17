var React = require('react');

module.exports = React.createClass({
  render: function() {

    var items = this.props.data.map(function(item) {
      return (
        <Select key={item.id} data={item} toggle={this.props.toggle} />
      );
    }.bind(this));

    return (
      <div className="CheckboxList">
        {items}
      </div>
    );
  }
});

var Select = React.createClass({
  getInitialState: function() {
    return {defaultValue: this.props.initialValue ? this.props.initialValue : ''};
  },
  onChange: function(e) {
    console.log('onChange', e.target, e.target.value, this.props.data.id);
    this.props.toggle(true, e.target.value, this.props.data.id);
    // this.setState({checked: !this.state.checked}, function (previousState, currentProps) {
    //   // Sending info to parent that the user has toggled the subscription
    // }.bind(this));
  },
  render: function() {

    var options = this.props.data.options.map(function (option, index) {
      return <option key={index} value={option.value}>{option.label}</option>
    });

    return (
      <div key={this.props.data.id}>
        <label htmlFor={this.props.data.id}>{this.props.data.navn}</label>
        <select
          id={this.props.data.id}
          defaultValue={this.state.defaultValue}
          onChange={this.onChange}>
          <option key="-1" value="" disabled="disabled"></option>
          {options}
        </select>
      </div>
    );
  }
});
