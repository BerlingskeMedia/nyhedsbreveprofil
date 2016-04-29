var React = require('react');

var Step2 = React.createClass({
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
    console.log('this.state.user', this.state.user.nyhedsbreve);
    // this.props.saveUserData(this.state.user).success(function (data) {
    //   self.props.stepComplete();
    // });
  },
  render: function() {
    return (
      <form className="step2Form" onSubmit={this.handleSubmit}>
        <NewsletterList user={this.state.user} nyhedsbreve={this.state.nyhedsbreve} />
        <input type="submit" value="Videre" />
      </form>
    );
  }
});


var NewsletterList = React.createClass({
  render: function() {
    var newsletters = this.props.nyhedsbreve.map(function(nyhedsbrev) {
      var selected = false;
      if (this.props.user !== undefined) {
        selected = this.props.user.nyhedsbreve.indexOf(nyhedsbrev.nyhedsbrev_id) > -1;
      }
      return (
        <NewsletterCheckbox key={nyhedsbrev.nyhedsbrev_id} nyhedsbrev={nyhedsbrev} nyhedsbreve={this.props.user.nyhedsbreve} selected={selected} />
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
  changeNewsletterSubscription: function(nyhedsbrev_id) {
    this.setState({selected: !this.state.selected});
    if (this.state.selected) {
      this.props.nyhedsbreve.splice(this.props.nyhedsbreve.indexOf(nyhedsbrev_id), 1);
    } else {
      this.props.nyhedsbreve.push(nyhedsbrev_id);
    }
  },
  render: function() {
    var selected = false;
    return (
      <div className="NewsletterCheckbox">
        <input type="checkbox" id={this.props.nyhedsbrev.nyhedsbrev_id} checked={this.state.selected} onChange={this.changeNewsletterSubscription.bind(this,this.props.nyhedsbrev.nyhedsbrev_id)} />
        {this.props.nyhedsbrev.nyhedsbrev_navn}
      </div>
    )
  }
});

module.exports = Step2;
