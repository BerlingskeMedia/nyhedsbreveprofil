var $ = require('jquery');
var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      data_dirty: false,
      email_error: false,
      email_conflict: false,
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
  handleInputChange: function(stateData) {
    this.setState(stateData);
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
        url: '/backend/users/'.concat(this.props.data.ekstern_id),
        data: JSON.stringify(payload),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data) {
          console.log('user updated', data);
          this.props.stepForward(data.ekstern_id);
        }.bind(this),
        error: function(xhr, status, err) {
          if (xhr.status === 409) {
            this.setState({email_conflict: true});
          } else {
            console.error(xhr, status);
          }
        }.bind(this)
      });
    } else {
      this.props.stepForward();
    }
  },
  add300: function() {
    return $.ajax({
      type: 'POST',
      url: '/backend/users/'.concat(this.props.data.ekstern_id, '/nyhedsbreve/300?location_id=2059'),
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
      url: '/backend/users/'.concat(this.props.data.ekstern_id, '/nyhedsbreve/300?location_id=2059'),
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

    var userData = {};
    Object.keys(this.props.data)
    .filter(this.filterAllowesUserFields)
    .forEach(function(key) {
      userData[key] = this.props.data[key];
    }.bind(this));

    return (
      <div className="stepStamdata">
        <form onSubmit={this.handleSubmit}>
          <h2>Opdatér venligst dine stamoplysninger</h2>
          <TextInput id="email" label="Email" initialValue={userData.email} onChange={this.handleInputChange} hasError={this.state.email_error} />
          {this.state.email_conflict ? <div className="alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span> Email eksisterer</span>
          </div> : null}
          <TextInput id="fornavn" label="Fornavn" initialValue={userData.fornavn} onChange={this.handleInputChange} />
          <TextInput id="efternavn" label="Efternavn" initialValue={userData.efternavn} onChange={this.handleInputChange} />
          <TextInput id="vejnavn" label="Vejnavn" initialValue={userData.vejnavn} onChange={this.handleInputChange} />
          <TextInput id="husnummer" label="Husnummer" initialValue={userData.husnummer} onChange={this.handleInputChange} />
          <TextInput id="husbogstav" label="Husbogstav" initialValue={userData.husbogstav} onChange={this.handleInputChange} />
          <TextInput id="etage" label="Etage" initialValue={userData.etage} onChange={this.handleInputChange} />
          <TextInput id="sidedoer" label="Side/dør" initialValue={userData.sidedoer} onChange={this.handleInputChange} />
          <TextInput id="postnummer" label="Postnummer" initialValue={userData.postnummer} onChange={this.handleInputChange} />
          <TextInput id="bynavn" label="By" initialValue={userData.bynavn} onChange={this.handleInputChange} />
          <KoenSelect id="koen" label="Køn" initialValue={userData.koen} onChange={this.handleInputChange} />
          <TextInput id="foedselsaar" label="Fødselsår" initialValue={userData.foedselsaar} onChange={this.handleInputChange} />
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

var TextInput = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.initialValue
    };
  },
  onChange: function(e) {
    var temp = {};
    temp[e.target.id] = e.target.value;
    this.setState({value: e.target.value}, function() {
      this.props.onChange(temp);
    }.bind(this));
  },
  render: function() {

    var placeholder = this.props.placeholder !== undefined ? this.props.placeholder : this.props.label;

    var classes = "form-group".concat(this.props.hasError ? ' has-error' : '');

    return (
      <div key={this.props.id} className={classes}>
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        <input
          id={this.props.id}
          className="form-control"
          type="text"
          placeholder={placeholder}
          onChange={this.onChange}
          value={this.state.value}
        />
      </div>
    );
  }
});

var KoenSelect = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.initialValue
    };
  },
  onChange: function(e) {
    var temp = {};
    temp[e.target.id] = e.target.value;
    this.setState({value: e.target.value}, function() {
      this.props.onChange(temp);
    }.bind(this));
  },
  render: function() {
    return (
      <div key={this.props.id} className="form-group">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <select
          id={this.props.id}
          className="form-control"
          value={this.state.value}
          onChange={this.onChange}>
          <option key="-1" value="" disabled="disabled"></option>
          <option key="0" value="M">Mand</option>
          <option key="1" value="K">Kvinde</option>
        </select>
      </div>
    );
  }
});
