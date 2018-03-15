var React = require('react');

module.exports = React.createClass({
  render: function() {

    var items = this.props.data.map(function(item) {
      return (
        <Select key={item.id} data={item} toggle={this.props.toggle} />
      );
    }.bind(this));

    return (
      <div className="CheckboxList form">
        {items}
      </div>
    );
  }
});

var Select = React.createClass({
  getInitialState: function() {
    return {
      value: ''
    };
  },
  componentWillReceiveProps: function() {
    if (this.props.data.initialValue && this.state.value === '') {
      this.setState({value: this.props.data.initialValue});
    }
  },
  onChange: function(e) {
    var v = e.target.value;
    this.setState({value: v}, function() {
      this.props.toggle(v, this.props.data.id);
    }.bind(this));
  },
  render: function() {
    var classes = "form-group".concat(this.props.data.hasError ? ' has-error' : '');

    var options = this.props.data.options.map(function (option, index) {
      return <option key={index} value={option.value}>{option.label}</option>
    });


    if (window.location.host.indexOf('profil.berlingskemedia.dk') === -1 && options.length === 0) {
      options.push(<option key="999" value="999">TEST</option>);
    }

    return (
      <div key={this.props.data.id} className={classes}>
        <label className="control-label" htmlFor={this.props.data.id}>{this.props.data.navn}</label>
        <select
          id={this.props.data.id}
          className="form-control"
          value={this.state.value}
          onChange={this.onChange}>
          <option key="-1" value="" disabled="disabled">(Skal udfyldes)</option>
          {options}
        </select>
      </div>
    );
  }
});
