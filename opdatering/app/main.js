var React = require('react');
var ReactDOM = require('react-dom');
var StepStamdata = require('./step_stamdata');
var StepInteresser = require('./step_interesser');
var StepNyhedsbreveKom = require('./step_nyhedsbreve_redaktionelle');
var StepNyhedsbreve = require('./step_nyhedsbreve_kommercielle');

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
  loadUserData: function() {
    return $.ajax({
      url: '/backend/users/'.concat(this.state.ekstern_id),
      dataType: 'json',
      cache: true,
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
    var ekstern_id = this.getSearchParameter('ekstern_id');
    ekstern_id = '0cbf425b93500407ccc4481ede7b87da'; // TEST TODO REMOVE
    return {data: {}, step: 1, showStep1: true, ekstern_id: ekstern_id};
  },
  stepComplete: function () {
    var step = this.state.step;
    this.setState({step: ++step});
  },
  stepBackwards: function () {
    var step = this.state.step;
    this.setState({step: --step});
  },
  render: function() {
    return (
      <div className="opdateringskampagne">
        { this.state.step === 1 ? <StepStamdata stepComplete={this.stepComplete} loadUserData={this.loadUserData} /> : null }
        { this.state.step === 2 ? <StepInteresser stepComplete={this.stepComplete} stepBackwards={this.stepBackwards} loadUserData={this.loadUserData} /> : null }
        { this.state.step === 3 ? <StepNyhedsbreve stepComplete={this.stepComplete} stepBackwards={this.stepBackwards} loadUserData={this.loadUserData} /> : null }
      </div>
    );
  }
});



ReactDOM.render(
  <Opdateringskampagne />,
  document.getElementById('content')
);
