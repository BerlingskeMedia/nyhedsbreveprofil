const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

var CheckboxList = require('./checkbox_list');

module.exports = class extends React.Component {

  constructor(props) {
    super(props);
    this.toggleInteresse = this.toggleInteresse.bind(this);
    this.completeStepFunc = this.completeStepFunc.bind(this);
    this.state = {
      new_signups: [],
      new_signouts: [],
      interesser_already: [],
      interesser_not_yet: []
    };
  }

  componentDidMount() {
    if (window.location.host.indexOf('profil.berlingskemedia.dk') > -1) {
      ga('set', 'page', 'opdateringskampagne/step_interesser');
      ga('send', 'pageview');
    }
  }

  toggleInteresse (subscribe, interesse) {
    var new_signups = this.state.new_signups;
    var new_signouts = this.state.new_signouts;

    if (subscribe) {
      var i = new_signouts.indexOf(interesse.id);
      if (i > -1) {
        new_signouts.splice(i, 1);
      } else {
        new_signups.push(interesse.id);
      }
    } else {
      var i = new_signups.indexOf(interesse.id);
      if (i > -1) {
        new_signups.splice(i, 1);
      } else {
        new_signouts.push(interesse.id);
      }
    }

    this.setState({new_signups: new_signups});
    this.setState({new_signouts: new_signouts});
  }

  completeStepFunc() {

    var dfd = $.Deferred();

    var count = this.state.new_signups.length + this.state.new_signouts.length,
        done = 0;

    if (count === 0) {

      dfd.resolve();

    } else {

      var successCallback = (function(done, count) {
        return function() {
          if (++done === count) {
            dfd.resolve();
          }
        };
      }(done, count));

      this.state.new_signups.forEach(function(id) {
        this.call_backend('POST', id)
        .done(successCallback);
      }.bind(this));

      this.state.new_signouts.forEach(function(id) {
        this.call_backend('DELETE', id)
        .done(successCallback);
      }.bind(this));
    }

    return dfd.promise();
  }

  call_backend(type, id) {
    return $.ajax({
      type: type,
      url: '/backend/users/'.concat(this.props.data.ekstern_id, '/interesser/', id, '?location_id=2635'),
      dataType: 'json'
    })
    .fail((xhr, status, err) => {
      console.error(status, err.toString());
    });
  }

  render() {
    var interesser = [
      {id: 25, navn: 'Bil & Motor'},
      {id: 23, navn: 'Bolig & Design'},
      {id: 22, navn: 'Business'},
      {id: 39, navn: 'Børn'},
      {id: 14, navn: 'Kultur & Underholdning'},
      {id: 24, navn: 'Mad & Drikke'},
      {id: 21, navn: 'Penge & Karriere'},
      {id: 309, navn: 'Politik'},
      {id: 2, navn: 'Rejser'},
      {id: 26, navn: 'Selvudvikling og Uddannelse'},
      {id: 28, navn: 'Shopping'},
      {id: 20, navn: 'Sport & Fritid'},
      {id: 27, navn: 'Sundhed & Familieliv'},
      {id: 37, navn: 'Teknik & Gadgets'},
      {id: 19, navn: 'Viden & Samfund'}
    ];


    var interesser_not_yet = interesser.filter(function(interesse) {
      return this.props.data.interesser.indexOf(interesse.id) === -1;
    }.bind(this));


    var interesser_already = interesser.filter(function(interesse) {
      return this.props.data.interesser.indexOf(interesse.id) > -1;
    }.bind(this));

    interesser_already.forEach(function (i) {
      i.preselect = true;
    });

    return (
      <div className="stepInteresser">
        <h3 className="stepheader">Opdater venligst dine interesser</h3>
        <h4 className="selectionheader">Valgte</h4>
        {interesser_already.length > 0
          ? <CheckboxList data={interesser_already} toggle={this.toggleInteresse} />
          : <p>(Ingen)</p>
        }
        <h4 className="selectionheader">Tilføj</h4>
        {interesser_not_yet.length > 0
          ? <CheckboxList data={interesser_not_yet} toggle={this.toggleInteresse} />
          : <p>(Alt tilmeldt)</p>
        }
      </div>
    );
  }
}
