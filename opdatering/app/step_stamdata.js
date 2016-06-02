var $ = require('jquery');
var React = require('react');
var Checkbox = require('./checkbox__controlled');
var CountrySelector = require('./country_selector');

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
      'lande_kode',
      'koen',
      'foedselsaar',
      'kids'
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
    stateData.data_dirty = true;
    this.setState(stateData);
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

      this.setState({stepping: true});

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
        }.bind(this),
        complete: function() {
          this.setState({stepping: false});
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
  addKid: function(birthyear, index) {
    var kids = this.state.kids;
    birthyear = birthyear !== undefined ? birthyear : '';
    if (index !== undefined) {
      kids[index].birthyear = parseInt(birthyear);
    } else {
      kids.push({birthyear: birthyear});
    }
    this.setState({kids: kids, data_dirty: true});
  },
  removeKid: function(index) {
    var kids = this.state.kids;
    kids.splice(index, 1);
    this.setState({kids: kids, data_dirty: true});
  },
  render: function() {

    var userData = {};
    Object.keys(this.props.data)
    .filter(this.filterAllowesUserFields)
    .forEach(function(key) {
      userData[key] = this.props.data[key];
    }.bind(this));

    var p300data = {
      id: '300',
      checked: this.state.has300,
      navn: 'Tilbud fra Berlingske Media og vores partnere (E-post)',
      permissiontext: <T300PermText />
    };

    return (
      <div className="stepStamdata">
        <form onSubmit={this.handleSubmit}>
          <h2>Opdater venligst dine kontaktoplysninger</h2>
          <TextInput id="email" label="Email" type="email" initialValue={userData.email} onChange={this.handleInputChange} hasError={this.state.email_error} />
          {this.state.email_conflict ? <div className="alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span> E-mailadressen findes allerede i vores nyhedsbrevssystem. Skriv venligst til <a href='mailto:nyhedsbreve@berlingske.dk'>nyhedsbreve@berlingske.dk</a>, hvis du vil flytte alle tilmeldinger til nyhedsbreve fra en e-mailadresse til en anden - så hjælper vi dig så hurtigt som muligt.</span>
          </div> : null}
          <div className="row">
            <div className="col-xs-6">
              <TextInput id="fornavn" label="Fornavn" initialValue={userData.fornavn} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6">
              <TextInput id="efternavn" label="Efternavn" initialValue={userData.efternavn} onChange={this.handleInputChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-4">
              <TextInput id="vejnavn" label="Vejnavn" initialValue={userData.vejnavn} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6 col-md-2">
              <TextInput id="husnummer" label="Husnummer" placeholder="" initialValue={userData.husnummer} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-4 col-md-2">
              <TextInput id="husbogstav" label="Husbogstav" placeholder="" initialValue={userData.husbogstav} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-4 col-md-2">
              <TextInput id="etage" label="Etage" placeholder="" initialValue={userData.etage} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-4 col-md-2">
              <TextInput id="sidedoer" label="Side/dør" placeholder="" initialValue={userData.sidedoer} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6 col-md-2">
              <TextInput id="postnummer" label="Postnummer" initialValue={userData.postnummer} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6 col-md-5">
              <TextInput id="bynavn" label="By" initialValue={userData.bynavn} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-12 col-md-5">
              <CountrySelector id="lande_kode" label="Land" initialValue={userData.lande_kode} onChange={this.handleInputChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <TextInput id="telefon" label="Telefon" initialValue={userData.telefon} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6">
              <TextInput id="mobil" label="Mobil" initialValue={userData.mobil} onChange={this.handleInputChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <KoenSelect id="koen" label="Køn" initialValue={userData.koen} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6">
              <BirthyearSelector id="foedselsaar" label="Fødselsår" initialValue={userData.foedselsaar} onChange={this.handleInputChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <KidsController kids={userData.kids} addKid={this.addKid} removeKid={this.removeKid} />
            </div>
          </div>
          {this.props.showCheckbox300Perm ?
            <Checkbox data={p300data} toggle={this.handle300PermChange} />
          : null }
          <input className="btn btn-default nextButton pull-right" type="submit" value="Næste" disabled={this.state.stepping} />
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

    var type = this.props.type !== undefined ? this.props.type : 'text';

    return (
      <div key={this.props.id} className={classes}>
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        <input
          id={this.props.id}
          className="form-control"
          type={type}
          placeholder={placeholder}
          onChange={this.onChange}
          value={this.state.value}
        />
      </div>
    );
  }
});


var T300PermText = React.createClass({
  render: function() {
    return(
      <div>Berlingske Media-koncernen (<a href="http://www.berlingskemedia.dk/?p=8231" target="_blank">se udgivelser og forretningsenheder her</a>) må gerne gøre mig opmærksom på nyheder, tilbud og konkurrencer via brev og elektroniske medier (herunder e-mail, sms, mms, videobeskeder og pop-ups), når Berlingske Media-koncernen og vores samarbejdspartnere (<a href="http://www.berlingskemedia.dk/?p=8233" target="_blank">se samarbejdspartnere her</a>) har nyheder, tilbud og konkurrencer inden for forskellige interesseområder (<a href="http://www.berlingskemedia.dk/?p=8235" target="_blank">se hvilke her</a>).</div>
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


var BirthyearSelector = React.createClass({
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
  render: function () {
    var options = [];
    for (var i = 0; i < 99; i++) {
      var temp = new Date();
      var value = (1900 + temp.getYear() - i);
      options.push(<option key={i} value={value}>{value}</option>);
    }

    return (
      <div key={this.props.id} className="birthyearSelector form-group">
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        <select
          id={this.props.id}
          className="form-control"
          value={this.state.value}
          onChange={this.onChange}>
          {options}
        </select>
      </div>
    );
  }
});


var KidsController = React.createClass({
  removeKid: function(i) {
    this.props.removeKid(i);
  },
  addNew: function() {
    var temp = new Date();
    this.props.addKid(1900 + temp.getYear());
  },
  render: function () {
    var kids = this.props.kids.map(function(kid, index) {
      return <KidSelector id={index} key={index} birthyear={kid.birthyear} addKid={this.props.addKid} removeKid={this.removeKid.bind(this, index)} />
    }.bind(this));

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


var KidSelector = React.createClass({
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
