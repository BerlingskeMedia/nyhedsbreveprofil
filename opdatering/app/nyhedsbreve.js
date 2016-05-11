var $ = require('jquery');
var React = require('react');

var NewsletterList = require('./checkbox_list');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      ekstern_id: '',
      new_signups: [],
      new_signouts: [],
      nyhedsbreve_already: [],
      nyhedsbreve_not_yet: [],
      nyhedsbreve: this.props.nyhedsbreve
    };
  },
  componentDidMount: function() {
    this.loadingUserData = this.props.loadUserData()
    .success(this.props.loadUserDataSuccess)
    .success(function (data) {

      this.setState({ekstern_id: data.ekstern_id});
      var user_nyhedsbreve = data.nyhedsbreve;

      var nyhedsbreve_not_yet = this.props.nyhedsbreve.filter(function(nyhedsbrev) {
        return user_nyhedsbreve.indexOf(nyhedsbrev.id) === -1;
      }.bind(this));

      nyhedsbreve_not_yet.sort(this.sort_nyhedsbreve);
      this.setState({nyhedsbreve_not_yet: nyhedsbreve_not_yet});

      var nyhedsbreve_already = this.props.nyhedsbreve.filter(function(nyhedsbrev) {
        return user_nyhedsbreve.indexOf(nyhedsbrev.id) > -1;
      }.bind(this));

      nyhedsbreve_already.forEach(function (n) {
        n.preselect = true;
      });

      nyhedsbreve_already.sort(this.sort_nyhedsbreve);
      this.setState({nyhedsbreve_already: nyhedsbreve_already});

    }.bind(this));
  },
  componentWillUnmount: function() {
    this.loadingUserData.abort();
  },
  toggleNyhedsbrev: function (subscribe, nyhedsbrev) {
    var new_signups = this.state.new_signups;
    var new_signouts = this.state.new_signouts;

    if (subscribe) {
      var i = new_signouts.indexOf(nyhedsbrev.id);
      if (i > -1) {
        new_signouts.splice(i, 1);
      } else {
        new_signups.push(nyhedsbrev.id);
      }
    } else {
      var i = new_signups.indexOf(nyhedsbrev.id);
      if (i > -1) {
        new_signups.splice(i, 1);
      } else {
        new_signouts.push(nyhedsbrev.id);
      }
    }
    this.setState({new_signups: new_signups});
    this.setState({new_signouts: new_signouts});
  },
  sort_nyhedsbreve: function(nyhedsbrev_a, nyhedsbrev_b) {
    var navnA = nyhedsbrev_a.navn.toUpperCase();
    var navnB = nyhedsbrev_b.navn.toUpperCase();
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

      this.state.new_signups.forEach(add_nyhedsbrev);
      this.state.new_signouts.forEach(delete_nyhedsbrev);

      function add_nyhedsbrev (nyhedsbrev_id) {
        call_backend('POST', nyhedsbrev_id);
      }

      function delete_nyhedsbrev (nyhedsbrev_id) {
        call_backend('DELETE', nyhedsbrev_id);
      }

      function call_backend (type, nyhedsbrev_id) {
        $.ajax({
          type: type,
          url: '/backend/users/'.concat(ekstern_id, '/nyhedsbreve/', nyhedsbrev_id, '?location_id=2059'),
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
      <div className="Newsletters">
        <div>Tilmeld dig</div>
        <NewsletterList data={this.state.nyhedsbreve_not_yet} toggle={this.toggleNyhedsbrev} />
        <div>Dine tilmeldinger</div>
        <NewsletterList data={this.state.nyhedsbreve_already} toggle={this.toggleNyhedsbrev} />
        <input type="button" value="Tilbage" onClick={this.complete(this.props.stepBackwards)} />
        <input type="button" value="Videre" onClick={this.complete(this.props.stepForward)} />
      </div>
    );
  }
});
