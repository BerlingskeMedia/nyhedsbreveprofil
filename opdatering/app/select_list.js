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
    return {defaultValue: this.props.data.initialValue ? this.props.data.initialValue : ''};
  },
  onChange: function(e) {
    this.props.toggle(e.target.value, this.props.data.id);
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
