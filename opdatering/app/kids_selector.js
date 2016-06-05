var React = require('react');

module.exports = React.createClass({
  removeKid: function(i) {
    this.props.removeKid(i);
  },
  addNew: function() {
    var temp = new Date();
    this.props.addKid(1900 + temp.getYear());
  },
  render: function () {
    var kids = [];

    if (this.props.kids) {
      kids = this.props.kids.map(function(kid, index) {
        return <KidBirthyearSelector id={index} key={index} birthyear={kid.birthyear} addKid={this.props.addKid} removeKid={this.removeKid.bind(this, index)} />
      }.bind(this));
    }

    return (
      <div className="KidsController">
        <div className="kidsSelectors form">
          {kids}
        </div>
        <button type="button" className="btn btn-default" onClick={this.addNew}>
          <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
          Tilføj hjemmeboende barn
        </button>
      </div>
    );
  }
});


var KidBirthyearSelector = React.createClass({
  onChange: function(e) {
    this.props.addKid(e.target.value, this.props.id);
  },
  render: function () {
    var label =
      this.props.id === 0  ? 'Første' :
      this.props.id === 1  ? 'Andet' :
      this.props.id === 2  ? 'Tredje' :
      this.props.id === 3  ? 'Fjerde' :
      this.props.id === 4  ? 'Femte' :
      this.props.id === 5  ? 'Sjette' :
      this.props.id === 6  ? 'Syvende' :
      this.props.id === 7  ? 'Ottende' :
      (this.props.id + 1).toString().concat('.');

    label = label.concat(' barns fødselsår')

    var options = [];
    for (var i = 0; i < 99; i++) {
      var temp = new Date();
      var value = (1900 + temp.getYear() - i);
      options.push(<option key={i} value={value}>{value}</option>);
    }

    return (
      <div key={this.props.id} className="kidSelector form-group">
      <label className="control-label" htmlFor={this.props.id}>{label}</label>
      <div className="input-group">
        <select
          id={this.props.id}
          className="form-control"
          value={this.props.birthyear}
          onChange={this.onChange}>
          {options}
        </select>
        <span className="input-group-btn">
          <button type="button" className="btn btn-default" onClick={this.props.removeKid}>
            <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
          </button>
        </span>
      </div>
      </div>
    );
  }
});
