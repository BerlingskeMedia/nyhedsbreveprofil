var $ = require('jquery');
var React = require('react');
var Checkbox = require('./checkbox__controlled');
var CountrySelector = require('./country_selector');
var KidsSelector = require('./kids_selector');

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
      'foedselsdato',
      'kids'
    ].indexOf(key) > -1;
  },
  componentDidMount: function() {

    if (window.location.host.indexOf('profil.berlingskemedia.dk') > -1) {
      ga('set', 'page', 'opdateringskampagne/step-stamdata');
      ga('send', 'pageview');
    }

    var userDataState = {};
    Object.keys(this.props.data)
    .filter(this.filterAllowesUserFields)
    .forEach(function(key) {
      userDataState[key] = this.props.data[key];
    }.bind(this));
    this.setState(userDataState);
    this.setState({has300: this.props.data.nyhedsbreve.indexOf(300) > -1});
  },
  handleInputChange: function(e) {
    var temp = {data_dirty: true};
    temp[e.target.id] = e.target.value;
    this.setState(temp);
  },
  handleDateChange: function(e) {
    var eventdata = e;
    if (validateDate(e.target.value)) {
      this.setState({birthdate_error: false});
      this.handleInputChange(eventdata);
    } else {
      var tmp = {};
      tmp[e.target.id.concat('_error')] = true;
      this.setState(tmp);
    }

    function validateDate(dateString) {
      if (dateString.length < 10 || dateString.split('-').length !== 3) {
        return false;
      }

      var date = new Date(dateString);
      if (date == 'Invalid Date') {
        return false;
      } else if (date.getTime() > Date.now()) {
        return false;
      } else if (date.getFullYear() < 1900) {
        return false;
      } else {
        return true;
      }
    }
  },
  handleEmailChange: function (e) {
    var eventdata = e;
    if (validateEmail(e.target.value)) {
      this.setState({email_error: false});
      this.handleInputChange(eventdata);
    } else {
      this.setState({email_error: true});
    }

    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  },
  handle300PermChange: function (e) {
    this.setState({has300: !this.state.has300}, function() {
      this.props.setHideStepNyhKom(!this.state.has300);
    });
    this.setState({has300_dirty: true});
  },
  completeStepFunc: function(callback) {
    if (this.state.email_error) {
      return callback('Email error.');
    }

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

      if (payload.foedselsdato === '') {
        payload.foedselsdato = null;
      }

      return $.ajax({
        type: 'POST',
        url: '/backend/users/'.concat(this.props.data.ekstern_id),
        data: JSON.stringify(payload),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data) {
          console.log('user updated', data);
          this.setState({email_conflict: false});
          callback(null, data.ekstern_id);
        }.bind(this),
        error: function(xhr, status, err) {
          if (xhr.status === 409) {
            this.setState({email_conflict: true});
            callback('Email conflict');
          } else {
            console.error(xhr, status, payload);
            callback(err);
          }
        }.bind(this),
      });
    } else {
      callback();
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
    } else if (kids === undefined) {
      kids = [{birthyear: birthyear}];
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

    var p300data = {
      id: '300',
      checked: this.state.has300,
      navn: 'Tilbud fra Berlingske Media og vores partnere (E-post)',
      permissiontext: <T300PermText />
    };

    return (
      <div className="stepStamdata">
        <form onSubmit={this.handleSubmit}>
          <div className="stamdataStepheaderPadding">
            <h3 className="stepheader">Opdater venligst dine kontaktoplysninger</h3>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <TextInput id="email" label="Email" type="email" initialValue={this.props.data.email} onChange={this.handleEmailChange} hasError={this.state.email_error} />
              {this.state.email_conflict ? <div className="alert alert-danger" role="alert">
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span> E-mailadressen findes allerede i vores nyhedsbrevssystem. Skriv venligst til <a href='mailto:nyhedsbreve@berlingske.dk'>nyhedsbreve@berlingske.dk</a>, hvis du vil flytte alle tilmeldinger til nyhedsbreve fra en e-mailadresse til en anden - så hjælper vi dig så hurtigt som muligt.</span>
              </div> : null}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <TextInput id="fornavn" label="Fornavn" initialValue={this.props.data.fornavn} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-12">
              <TextInput id="efternavn" label="Efternavn" initialValue={this.props.data.efternavn} onChange={this.handleInputChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
              <TextInput id="vejnavn" label="Vejnavn" initialValue={this.props.data.vejnavn} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6  col-sm-4 col-md-4 col-lg-4">
              <TextInput id="husnummer" label="Husnummer" type="number" placeholder="" initialValue={this.props.data.husnummer} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6 col-sm-4 col-md-4 col-lg-4">
              <TextInput id="husbogstav" label="Husbogstav" placeholder="" initialValue={this.props.data.husbogstav} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6 col-sm-4 col-md-4 col-lg-4">
              <TextInput id="etage" label="Etage" placeholder="" initialValue={this.props.data.etage} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6 col-sm-4 col-md-4 col-lg-4">
              <TextInput id="sidedoer" label="Side/dør" placeholder="" initialValue={this.props.data.sidedoer} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
              <TextInput id="postnummer" label="Postnr" type="number" initialValue={this.props.data.postnummer} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
              <TextInput id="bynavn" label="By" initialValue={this.props.data.bynavn} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <CountrySelector id="lande_kode" label="Land" initialValue={this.props.data.lande_kode} onChange={this.handleInputChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <TextInput id="telefon" label="Telefon" type="number" initialValue={this.props.data.telefon} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6">
              <TextInput id="mobil" label="Mobil" type="number" initialValue={this.props.data.mobil} onChange={this.handleInputChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <KoenSelect id="koen" label="Køn" initialValue={this.props.data.koen} onChange={this.handleInputChange} />
            </div>
            <div className="col-xs-6">
              <TextInput id="foedselsdato" label="Fødselsdato" type="date" initialValue={this.props.data.foedselsdato} onChange={this.handleDateChange} hasError={this.state.foedselsdato_error} />
            </div>
          </div>
          <KidsSelector kids={this.props.data.kids} addKid={this.addKid} removeKid={this.removeKid} />
          <div className="row">
            <div className="col-xs-12">
              {this.props.showCheckbox300Perm ?
                <Checkbox data={p300data} toggle={this.handle300PermChange} />
              : null }
            </div>
          </div>
        </form>
      </div>
    );
  }
});


var TextInput = React.createClass({
  getDateFormat: function(value) {
    var temp = new Date(value),
        month = this.numberToTwoString(temp.getMonth()),
        date = this.numberToTwoString(temp.getDate());
    return temp.getFullYear().toString().concat('-', month, '-', date);
  },
  numberToTwoString: function(number) {
    var temp = number.toString();
    return  temp.length === 1 ? '0'.concat(number) :
            temp.length === 2 ? temp :
            '';
  },
  render: function() {

    var placeholder = this.props.placeholder !== undefined ? this.props.placeholder : this.props.label;
    var classes = "form-group".concat(this.props.hasError ? ' has-error' : '');
    var type = this.props.type !== undefined ? this.props.type : 'text';
    var defaultValue = type === 'date' ? this.getDateFormat(this.props.initialValue) : this.props.initialValue;

    return (
      <div key={this.props.id} className={classes}>
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        <input
          id={this.props.id}
          className="form-control"
          required="required"
          type={type}
          placeholder={placeholder}
          onChange={this.props.onChange}
          defaultValue={defaultValue}
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
  render: function() {
    return (
      <div key={this.props.id} className="form-group">
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        <select
          id={this.props.id}
          className="form-control"
          defaultValue={this.props.initialValue}
          onChange={this.props.onChange}>
          <option key="-1" value="" disabled="disabled"></option>
          <option key="0" value="M">Mand</option>
          <option key="1" value="K">Kvinde</option>
        </select>
      </div>
    );
  }
});


var BirthyearSelector = React.createClass({
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
          defaultValue={this.props.initialValue}
          onChange={this.props.onChange}>
          {options}
        </select>
      </div>
    );
  }
});

var BirthdateSelector = React.createClass({
  getInitialState: function() {
    if (this.props.initialValue) {
      var date = new Date(this.props.initialValue);
      return {
        year: this.numberToTwoString(date.getFullYear()),
        month: this.numberToTwoString(date.getMonth() + 1),
        date: this.numberToTwoString(date.getDate()),
        lastDateOfMonth: this.getLastDateOfMonth(date.getYear(), date.getMonth())
      };
    } else {
      return {
        year: '',
        month: '',
        date: '',
        lastDateOfMonth: 0
      };
    }
  },
  getLastDateOfMonth: function(year, month) {
    var lastDate = new Date();
    lastDate.setFullYear(year, month + 1, 0);
    return lastDate.getDate();
  },
  numberToTwoString: function(number) {
    var temp = number.toString();
    return  temp.length === 1 ? '0'.concat(number) :
            temp.length === 2 ? temp :
            temp.length === 4 ? temp :
            '';
  },
  onYearChange: function(e) {
    console.log('onYearChange', e.target.value);
    this.setState({year: e.target.value}, this.promoteChange);
  },
  onMonthChange: function(e) {
    console.log('onMonthChange', e.target.value);
    this.setState({month: e.target.value}, this.promoteChange);
    this.setState({lastDateOfMonth: 31});
  },
  onDateChange: function(e) {
    console.log('onDateChange', e.target.value);
    this.setState({date: e.target.value}, this.promoteChange);
  },
  promoteChange: function() {
    var value = this.state.year.concat('-', this.state.month, '-', this.state.date);
    console.log('promoteChange', value);
    this.props.onChange({target: {id: this.props.id, value: value}});
  },
  render: function () {
    var classes = this.props.className !== undefined ? this.props.className : 'col-xs-4';
    // var date = new Date(this.props.initialValue),
    //     initialYear = this.state.date ? this.numberToTwoString(this.state.date.getFullYear()) : null,
    //     initialMonth = this.state.date ? this.numberToTwoString(this.state.date.getMonth() + 1) : null,
    //     initialDate = this.state.date ? this.numberToTwoString(this.state.date.getDate()) : null;

    // console.log('date', date, initialYear, initialMonth,  initialDate);
    //
    // console.log('a', this.getLastDateOfMonth(2011, 1));
    // console.log('s', this.getLastDateOfMonth(2011, 2));
    // console.log('d', this.getLastDateOfMonth(1954, 10));
    // console.log('f', this.getLastDateOfMonth(2014, 1));
    // console.log('g', this.getLastDateOfMonth(1981, 7));
    // console.log('h', this.getLastDateOfMonth(1977, 5));
    // console.log('j', this.getLastDateOfMonth(2014, 11));

    var years = [],
        months = [],
        dates = [];

    for (var i = 0; i < 99; i++) {
      var temp = new Date();
      var value = (1900 + temp.getYear() - i);
      years.push(<option key={i} value={value}>{value}</option>);
    }

    for (var j = 1; j <= 12; j++) {
      var value = this.numberToTwoString(j);
      months.push(<option key={j} value={value}>{value}</option>);
    }

    for (var l = 1; l <= this.state.lastDateOfMonth; l++) {
      var value = this.numberToTwoString(l);
      dates.push(<option key={l} value={value}>{value}</option>);
    }

    return (
      <div className={classes}>
        <div key={this.props.id} className="birthdateSelector form-group">
          <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
          <select
            className="form-control"
            value={this.state.year}
            onChange={this.onYearChange}>
            {years}
          </select>
          <select
            className="form-control"
            value={this.state.month}
            onChange={this.onMonthChange}>
            {months}
          </select>
          <select
            className="form-control"
            value={this.state.date}
            onChange={this.onDateChange}>
            {dates}
          </select>
        </div>
      </div>
    );
  }
});
