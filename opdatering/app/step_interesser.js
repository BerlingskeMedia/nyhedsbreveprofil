var $ = require('jquery');
var React = require('react');

var InteresseList = require('./checkbox_list');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      ekstern_id: '',
      new_signups: [],
      new_signouts: [],
      interesser_already: [],
      interesser_not_yet: [],
      interesser: [
        {id: 2, navn: 'Rejser'},
        {id: 25, navn: 'Bil & Motor'},
        {id: 28, navn: 'Shopping'},
        {id: 37, navn: 'Teknik & Gadgets'},
        {id: 20, navn: 'Sport & Fritid'},
        {id: 24, navn: 'Mad & Drikke'},
        {id: 309, navn: 'Politik'},
        {id: 22, navn: 'Business'},
        {id: 21, navn: 'Penge & Karriere'},
        {id: 14, navn: 'Kultur & Underholdning'},
        {id: 26, navn: 'Selvudvikling og Uddannelse'},
        {id: 23, navn: 'Bolig & Design'},
        {id: 19, navn: 'Viden & Samfund'},
        {id: 27, navn: 'Sundhed & Familieliv'},
        {id: 39, navn: 'Børn'}
      ]
    };
  },
  componentDidMount: function() {
    this.loadingUserData = this.props.loadUserData()
    .success(function (data) {
      this.setState({ekstern_id: data.ekstern_id});
      var user_interesser = data.interesser;

      var interesser_not_yet = this.state.interesser.filter(function(interesse) {
        return user_interesser.indexOf(interesse.id) === -1;
      }.bind(this));

      interesser_not_yet.sort(this.sort_interesser);
      this.setState({interesser_not_yet: interesser_not_yet});

      var interesser_already = this.state.interesser.filter(function(interesse) {
        return user_interesser.indexOf(interesse.id) > -1;
      }.bind(this));

      interesser_already.forEach(function (i) {
        i.preselect = true;
      });

      interesser_already.sort(this.sort_interesser);
      this.setState({interesser_already: interesser_already});

    }.bind(this));
  },
  componentWillUnmount: function() {
    this.loadingUserData.abort();
  },
  toggleInteresse: function (subscribe, interesse) {
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
  },
  sort_interesser: function(interesse_a, interesse_b) {
    var navnA = interesse_a.navn.toUpperCase();
    var navnB = interesse_b.navn.toUpperCase();
    if (navnA < navnB) {
      return -1;
    }
    if (navnA > navnB) {
      return 1;
    }
    // names must be equal
    return 0;
  },
  complete: function(callback) {
    return function() {
      var ekstern_id = this.state.ekstern_id;

      var count = this.state.new_signups.length + this.state.new_signouts.length,
          done = 0;

      if (count === 0) {
        return callback();
      }

      this.state.new_signups.forEach(add_interest);
      this.state.new_signouts.forEach(delete_interest);

      function add_interest (interesse_id) {
        call_backend('POST', interesse_id);
      }

      function delete_interest (interesse_id) {
        call_backend('DELETE', interesse_id);
      }

      function call_backend (type, interesse_id) {
        $.ajax({
          type: type,
          url: '/backend/users/'.concat(ekstern_id, '/interesser/', interesse_id, '?location_id=1'),
          dataType: 'json',
          success: function (data) {
            if (++done === count) {
              callback();
            }
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(status, err.toString());
          }.bind(this)
        });
      }
    }.bind(this);
  },
  render: function() {
    return (
      <div className="stepInteresser">
        <div>Vælg</div>
        <InteresseList data={this.state.interesser_not_yet} toggle={this.toggleInteresse} />
        <div>Allerede tilmeldte</div>
        <InteresseList data={this.state.interesser_already} toggle={this.toggleInteresse} />
        <input type="button" value="Tilbage" onClick={this.complete(this.props.stepBackwards)} />
        <input type="button" value="Videre" onClick={this.complete(this.props.stepComplete)} />
      </div>
    );
  }
});
