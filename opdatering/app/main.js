var React = require('react');
var ReactDOM = require('react-dom');
var Step1 = require('./step1');
var Step2 = require('./step2');

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



ReactDOM.render(
  <Opdateringskampagne />,
  document.getElementById('content')
);
