var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {user: {}, nyhedsbreve: []};
  },
  componentDidMount: function() {
    this.loadNewsletters().success(this.setNewsletterState);
    this.props.loadUserData().success(this.setUserState);
  },
  loadNewsletters: function() {
    return $.ajax({
      url: '/backend/nyhedsbreve',
      dataType: 'json',
      cache: true,
      success: this.setNewsletterState,
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  setNewsletterState: function(data) {
    this.setState({nyhedsbreve: data});
  },
  setUserState: function(data) {
    this.setState({user: data});
  },
  render: function() {
    return (
      <div className="stepNyhedsbreve">
        <NewsletterList user={this.state.user} nyhedsbreve={this.state.nyhedsbreve} />
        <input type="button" value="Tilbage" onClick={this.props.stepBackwards} />
        <input type="button" value="Videre" onClick={this.props.stepComplete} />
      </div>
    );
  }
});


var NewsletterList = React.createClass({
  changeNewsletterSubscription: function(nyhedsbrev_id) {
    var i = this.props.user.nyhedsbreve.indexOf(nyhedsbrev_id);
    if (i > -1) {
      this.props.user.nyhedsbreve.splice(i, 1);
      return this.deleteNewsletter(nyhedsbrev_id);
    } else {
      this.props.user.nyhedsbreve.push(nyhedsbrev_id);
      return this.addNewsletter(nyhedsbrev_id);
    }
  },
  addNewsletter: function(nyhedsbrev_id) {
    return $.ajax({
      type: 'POST',
      url: '/backend/users/'.concat(this.props.user.ekstern_id, '/nyhedsbreve/', nyhedsbrev_id, '?location_id=1'),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      success: function (data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  deleteNewsletter: function(nyhedsbrev_id) {
    return $.ajax({
      type: 'DELETE',
      url: '/backend/users/'.concat(this.props.user.ekstern_id, '/nyhedsbreve/', nyhedsbrev_id, '?location_id=1'),
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
    this.props.nyhedsbreve.sort(function(nyhedsbrev_a, nyhedsbrev_b) {
      if (this.props.user.nyhedsbreve.indexOf(nyhedsbrev_a.nyhedsbrev_id) > -1) {
        return 1;
      } else if (this.props.user.nyhedsbreve.indexOf(nyhedsbrev_b.nyhedsbrev_id) > -1) {
        return -1;
      } else {
        return 0;
      }
    }.bind(this));

    var newsletters = this.props.nyhedsbreve.map(function(nyhedsbrev) {
      var selected = false;
      if (this.props.user !== undefined) {
        selected = this.props.user.nyhedsbreve.indexOf(nyhedsbrev.nyhedsbrev_id) > -1;
      }
      return (
        <NewsletterCheckbox key={nyhedsbrev.nyhedsbrev_id} nyhedsbrev={nyhedsbrev} selected={selected} changeNewsletterSubscription={this.changeNewsletterSubscription} />
      );
    }.bind(this));

    return (
      <div className="NewsletterList">
        {newsletters}
      </div>
    )
  }
});


var NewsletterCheckbox = React.createClass({
  getInitialState: function() {
    return {selected: this.props.selected};
  },
  onChange: function() {
    this.props.changeNewsletterSubscription(this.props.nyhedsbrev.nyhedsbrev_id)
    .success(function (data) {
      this.setState({selected: !this.state.selected});
    });
  },
  render: function() {
    return (
      <div className="NewsletterCheckbox">
        <input type="checkbox" id={this.props.nyhedsbrev.nyhedsbrev_id} checked={this.state.selected} onChange={this.onChange} />
        {this.props.nyhedsbrev.nyhedsbrev_navn}
      </div>
    )
  }
});
