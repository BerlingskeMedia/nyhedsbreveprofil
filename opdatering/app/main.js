var React = require('react');
var ReactDOM = require('react-dom');

var Opdateringskampagne = React.createClass({
  getSearchParameter: function(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  },
  getUserUrl: function() {
    var ekstern_id = this.getSearchParameter('ekstern_id');
    // return '/backend/users/'.concat(ekstern_id);
    return '/backend/users/e99e523d80016cc2b5444a9c5915ac07';
  },
  userData: function() {
    return this.state.data;
  },
  loadUserData: function() {
    return $.ajax({
      url: this.getUserUrl(),
      dataType: 'json',
      cache: true,
      success: function (data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  saveUserData: function(userData) {
    userData.location_id = 1;
    return $.ajax({
      type: 'POST',
      url: this.getUserUrl(),
      data: JSON.stringify(userData),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      success: function (data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
  },
  getInitialState: function() {
    return {data: {}, step: 2, showStep1: true};
  },
  stepComplete: function (stepNo) {
    var self = this;
    return function () {
      self.setState({step: ++stepNo});
    };
  },
  render: function() {
    return (
      <div className="opdateringskampagne">
        { this.state.step === 1 ? <Step1 stepComplete={this.stepComplete(1)} loadUserData={this.loadUserData} saveUserData={this.saveUserData} /> : null }
        { this.state.step === 2 ? <Step2 stepComplete={this.stepComplete(2)} loadUserData={this.loadUserData} saveUserData={this.saveUserData} /> : null }
      </div>
    );
  }
});


var Step1 = React.createClass({
  getInitialState: function() {
    return {user: {fornavn: '', efternavn: ''}};
  },
  componentDidMount: function() {
    this.props.loadUserData().success(this.setUserState);
  },
  setUserState: function(data) {
    this.setState({user: data});
  },
  handleFornavnChange: function (e, a) {
    this.state.user.fornavn = e.target.value;
    this.setUserState(this.state.user);
  },
  handleEfternavnChange: function (e, a) {
    this.state.user.efternavn = e.target.value;
    this.setUserState(this.state.user);
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
      <form className="step1Form" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Fornavn"
          onChange={this.handleFornavnChange}
          value={this.state.user.fornavn}
        />
        <input
          type="text"
          placeholder="Efternavn"
          onChange={this.handleEfternavnChange}
          value={this.state.user.efternavn}
        />
        <input type="submit" value="Videre" />
      </form>
    );
  }
});



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

ReactDOM.render(
  <Opdateringskampagne />,
  document.getElementById('content')
);
