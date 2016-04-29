var React = require('react');

module.exports = React.createClass({
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
  getInitialState: function() {
    return {user: {}, nyhedsbreve: []};
  },
  componentDidMount: function() {
    this.loadNewsletters().success(this.setNewsletterState);
    this.props.loadUserData().success(this.setUserState);
  },
  setUserState: function(data) {
    this.setState({user: data});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var self = this;
    this.props.saveUserData(this.state.user).success(function (data) {
      self.props.stepComplete();
    });
  },
  render: function() {
    return (
      <form className="stepNyhedsbreve" onSubmit={this.handleSubmit}>
        <NewsletterList user={this.state.user} nyhedsbreve={this.state.nyhedsbreve} />
        <input type="submit" value="Videre" />
      </form>
    );
  }
});


var NewsletterList = React.createClass({
  changeNewsletterSubscription: function(nyhedsbrev_id) {
    var i = this.props.user.nyhedsbreve.indexOf(nyhedsbrev_id);
    if (i > -1) {
      this.props.user.nyhedsbreve.splice(i, 1);
    } else {
      this.props.user.nyhedsbreve.push(nyhedsbrev_id);
    }
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
  onChange: function(nyhedsbrev_id) {
    this.setState({selected: !this.state.selected});
    if (this.state.selected) {
      this.props.changeNewsletterSubscription(nyhedsbrev_id);
    } else {
      this.props.changeNewsletterSubscription(nyhedsbrev_id);
    }
  },
  render: function() {
    return (
      <div className="NewsletterCheckbox">
        <input type="checkbox" id={this.props.nyhedsbrev.nyhedsbrev_id} checked={this.state.selected} onChange={this.onChange.bind(this,this.props.nyhedsbrev.nyhedsbrev_id)} />
        {this.props.nyhedsbrev.nyhedsbrev_navn}
      </div>
    )
  }
});
