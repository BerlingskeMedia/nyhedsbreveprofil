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
        {interesse_id: 2, interesse_navn: 'Rejser'},
        {interesse_id: 25, interesse_navn: 'Bil & Motor'},
        {interesse_id: 28, interesse_navn: 'Shopping'},
        {interesse_id: 37, interesse_navn: 'Teknik & Gadgets'},
        {interesse_id: 20, interesse_navn: 'Sport & Fritid'},
        {interesse_id: 24, interesse_navn: 'Mad & Drikke'},
        {interesse_id: 309, interesse_navn: 'Politik'},
        {interesse_id: 22, interesse_navn: 'Business'},
        {interesse_id: 21, interesse_navn: 'Penge & Karriere'},
        {interesse_id: 14, interesse_navn: 'Kultur & Underholdning'},
        {interesse_id: 26, interesse_navn: 'Selvudvikling og Uddannelse'},
        {interesse_id: 23, interesse_navn: 'Bolig & Design'},
        {interesse_id: 19, interesse_navn: 'Viden & Samfund'},
        {interesse_id: 27, interesse_navn: 'Sundhed & Familieliv'},
        {interesse_id: 39, interesse_navn: 'Børn'}
      ]
    };
  },
  componentDidMount: function() {
    this.loadingUserData = this.props.loadUserData()
    .success(function (data) {
      this.setState({ekstern_id: data.ekstern_id});
      var user_interesser = data.interesser;

      var interesser_not_yet = this.state.interesser.filter(function(interesse) {
        return user_interesser.indexOf(interesse.interesse_id) === -1;
      }.bind(this));

      interesser_not_yet.sort(this.sort_interesser);
      this.setState({interesser_not_yet: interesser_not_yet});

      var interesser_already = this.state.interesser.filter(function(interesse) {
        return user_interesser.indexOf(interesse.interesse_id) > -1;
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
      var i = new_signouts.indexOf(interesse.interesse_id);
      if (i > -1) {
        new_signouts.splice(i, 1);
      } else {
        new_signups.push(interesse.interesse_id);
      }
    } else {
      var i = new_signups.indexOf(interesse.interesse_id);
      if (i > -1) {
        new_signups.splice(i, 1);
      } else {
        new_signouts.push(interesse.interesse_id);
      }
    }

    this.setState({new_signups: new_signups});
    this.setState({new_signouts: new_signouts});
  },
  sort_interesser: function(interesse_a, interesse_b) {
    var navnA = interesse_a.interesse_navn.toUpperCase();
    var navnB = interesse_b.interesse_navn.toUpperCase();
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
