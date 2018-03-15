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

    var kidsCount = kids.length,
        buttonStyle = {width: '100%'};

    if (kidsCount % 2 !== 0 ) {
      buttonStyle.marginTop = '30px';
    }

    buttonStyle.width = '100%';

    return (
      <div className="row KidsController">
        <div className="kidsSelectors">
          {kids}
        </div>
        <div className="col-xs-12 col-md-6">
          <button type="button" className="btn btn-default" onClick={this.addNew} style={buttonStyle}>
            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
            Tilføj hjemmeboende barn
          </button>
        </div>
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
      <div className="col-xs-12 col-md-6">
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
      </div>
    );
  }
});
