var $ = require('jquery');
var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      ekstern_id: '',
      email: '',
      fornavn: '',
      efternavn: '',
      mobil: '',
      telefon: '',
      vejnavn: '',
      husnummer: '',
      husbogstav: '',
      etage: '',
      sidedoer: '',
      bynavn: '',
      postnummer: '',
      koen: '',
      foedselsaar: '',
      data_dirty: false,
      has300: false,
      has300_dirty: false
    };
  },
  filterAllowesUserFields: function(key) {
    return [
      'ekstern_id',
      'email',
      'fornavn',
      'efternavn',
      'mobil',
      'telefon',
      'vejnavn',
      'husnummer',
      'husbogstav',
      'etage',
      'sidedoer',
      'postnummer',
      'bynavn',
      'koen',
      'foedselsaar'
    ].indexOf(key) > -1;
  },
  componentDidMount: function() {

    ga('set', 'page', 'opdateringskampagne/step-stamdata');
    ga('send', 'pageview');

    var userDataState = {};
    Object.keys(this.props.data)
    .filter(this.filterAllowesUserFields)
    .forEach(function(key) {
      userDataState[key] = this.props.data[key];
    }.bind(this));
    this.setState(userDataState);

    this.setState({has300: this.props.data.nyhedsbreve.indexOf(300) > -1});
  },
  handleInputChange: function (e, a) {
    var temp = {};
    temp[e.target.id] = e.target.value;
    this.setState(temp);
    this.setState({data_dirty: true});
  },
  handle300PermChange: function (e) {
    this.setState({has300: !this.state.has300}, function() {
      this.props.setHideStepNyhKom(!this.state.has300);
    });
    this.setState({has300_dirty: true});
  },
  handleSubmit: function(e) {
    e.preventDefault();

    // Tilmeld og afmeld perm 300
    if (this.state.has300_dirty) {
      if (this.state.has300) {
        this.add300();
      } else {
        this.delete300();
      }
    }

    if (this.state.data_dirty) {

      var payload = {
        location_id: 2059
      };

      Object.keys(this.state)
      .filter(this.filterAllowesUserFields)
      .forEach(function(key) {
        payload[key] = this.state[key];
      }.bind(this));

      return $.ajax({
        type: 'POST',
        url: '/backend/users/'.concat(this.state.ekstern_id),
        data: JSON.stringify(payload),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data) {
          console.log('data', data);
          this.props.stepForward(data.ekstern_id);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    } else {
      this.props.stepForward();
    }
  },
  add300: function() {
    return $.ajax({
      type: 'POST',
      url: '/backend/users/'.concat(this.state.ekstern_id, '/nyhedsbreve/300?location_id=2059'),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      success: function (data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  delete300: function() {
    return $.ajax({
      type: 'DELETE',
      url: '/backend/users/'.concat(this.state.ekstern_id, '/nyhedsbreve/300?location_id=2059'),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      success: function (data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="stepStamdata">
        <form onSubmit={this.handleSubmit}>
          <h2>Opdatér venligst dine stamoplysninger</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-control"
              type="text"
              placeholder="Email"
              onChange={this.handleInputChange}
              value={this.state.email}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fornavn">Fornavn</label>
            <input
              id="fornavn"
              className="form-control"
              type="text"
              placeholder="Fornavn"
              onChange={this.handleInputChange}
              value={this.state.fornavn}
            />
          </div>
          <div className="form-group">
            <label htmlFor="efternavn">Efternavn</label>
            <input
              id="efternavn"
              className="form-control"
              type="text"
              placeholder="Efternavn"
              onChange={this.handleInputChange}
              value={this.state.efternavn}
            />
          </div>
          <div className="form-group">
            <label htmlFor="vejnavn">Vejnavn</label>
            <input
              id="vejnavn"
              className="form-control"
              type="text"
              placeholder="Vejnavn"
              onChange={this.handleInputChange}
              value={this.state.vejnavn}
            />
          </div>
          <div className="form-group">
            <label htmlFor="husnummer">Husnummer</label>
            <input
              id="husnummer"
              className="form-control"
              type="text"
              placeholder="Husnummer"
              onChange={this.handleInputChange}
              value={this.state.husnummer}
            />
          </div>
          <div className="form-group">
            <label htmlFor="husbogstav">Husbogstav</label>
            <input
              id="husbogstav"
              className="form-control"
              type="text"
              placeholder="Husbogstav"
              onChange={this.handleInputChange}
              value={this.state.husbogstav}
            />
          </div>
          <div className="form-group">
            <label htmlFor="etage">Etage</label>
            <input
              id="etage"
              className="form-control"
              type="text"
              placeholder="Etage"
              onChange={this.handleInputChange}
              value={this.state.etage}
            />
          </div>
          <div className="form-group">
            <label htmlFor="sidedoer">Side/dør</label>
            <input
              id="sidedoer"
              className="form-control"
              type="text"
              placeholder="Side/dør"
              onChange={this.handleInputChange}
              value={this.state.sidedoer}
            />
          </div>
          <div className="form-group">
            <label htmlFor="postnummer">Postnummer</label>
            <input
              id="postnummer"
              className="form-control"
              type="text"
              placeholder="Postnummer"
              onChange={this.handleInputChange}
              value={this.state.postnummer}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bynavn">By</label>
            <input
              id="bynavn"
              className="form-control"
              type="text"
              placeholder="By"
              onChange={this.handleInputChange}
              value={this.state.bynavn}
            />
          </div>
          <div className="form-group">
            <label htmlFor="koen">Køn</label>
            <input
              id="koen"
              className="form-control"
              type="text"
              placeholder="Køn"
              onChange={this.handleInputChange}
              value={this.state.koen}
            />
          </div>
          <div className="form-group">
            <label htmlFor="foedselsaar">Fødselsår</label>
            <input
              id="foedselsaar"
              className="form-control"
              type="text"
              placeholder="Fødselsår"
              onChange={this.handleInputChange}
              value={this.state.foedselsaar}
            />
          </div>
          {this.props.showCheckbox300Perm ?
            <div className="checkbox">
              <label>
                <input
                id="300"
                type="checkbox"
                placeholder="300"
                onChange={this.handle300PermChange}
                checked={this.state.has300}
                />
                Tilbud fra Berlingske Media og vores partnere (E-post)
              </label>
            </div>
          : null }
          <input className="nextButton" type="submit" value="Næste" />
        </form>
      </div>
    );
  }
});
