var $ = require('jquery');
var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {user: {}, interesser: []};
  },
  componentDidMount: function() {
    this.props.loadUserData().success(function (data) {
      this.setState({user: data});
      this.loadInteresser().success(function (data) {
        this.setState({interesser: data});
      }.bind(this));
    }.bind(this));
  },
  loadInteresser: function() {
    return $.ajax({
      url: '/backend/interesser/full?displayTypeId=3',
      dataType: 'json',
      cache: true,
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="stepInteresser">
        <InteresseList user={this.state.user} interesser={this.state.interesser} />
        <input type="button" value="Tilbage" onClick={this.props.stepBackwards} />
        <input type="button" value="Videre" onClick={this.props.stepComplete} />
      </div>
    );
  }
});


var InteresseList = React.createClass({
  changeInterestSubscription: function(interesse_id) {
    var i = this.props.user.interesser.indexOf(interesse_id);
    if (i > -1) {
      this.props.user.interesser.splice(i, 1);
      return this.deleteInteresse(interesse_id);
    } else {
      this.props.user.interesser.push(interesse_id);
      return this.addInteresse(interesse_id);
    }
  },
  addInteresse: function(interesse_id) {
    return $.ajax({
      type: 'POST',
      url: '/backend/users/'.concat(this.props.user.ekstern_id, '/interesser/', interesse_id, '?location_id=1'),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      success: function (data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  deleteInteresse: function(interesse_id) {
    return $.ajax({
      type: 'DELETE',
      url: '/backend/users/'.concat(this.props.user.ekstern_id, '/interesser/', interesse_id, '?location_id=1'),
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
    // Sorting the subscribed newsletters at the buttom
    this.props.interesser.sort(function(interesse_a, interesse_b) {
      if (this.props.user.interesser.indexOf(interesse_a.interesse_id) > -1) {
        return 1;
      } else if (this.props.user.interesser.indexOf(interesse_b.interesse_id) > -1) {
        return -1;
      } else {
        return 0;
      }
    }.bind(this));

    var interests = this.props.interesser.map(function(interesse) {
      var selected = false;
      if (this.props.user !== undefined) {
        selected = this.props.user.interesser.indexOf(interesse.interesse_id) > -1;
      }
      return (
        <InterestCheckbox key={interesse.interesse_id} interesse={interesse} selected={selected} changeInterestSubscription={this.changeInterestSubscription} />
      );
    }.bind(this));

    return (
      <div className="InteresseList">
        {interests}
      </div>
    );
  }
});

var InterestCheckbox = React.createClass({
  getInitialState: function() {
    return {selected: this.props.selected};
  },
  onChange: function() {
    this.setState({selected: !this.state.selected});
    this.props.changeInterestSubscription(this.props.interesse.interesse_id)
    .success(function (data) {
      // Do nothing at the moment
    }.bind(this))
    .error(function (data) {
      console.error('changeInterestSubscription', data);
      this.setState({selected: !this.state.selected});
    });
  },
  render: function() {
    return (
      <div className="InterestCheckbox">
        <input type="checkbox" id={this.props.interesse.interesse_id} checked={this.state.selected} onChange={this.onChange} />
        {this.props.interesse.interesse_navn}
      </div>
    );
  }
});
