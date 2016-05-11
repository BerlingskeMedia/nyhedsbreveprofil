var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var StepStamdata = require('./step_stamdata');
var StepInteresser = require('./step_interesser');
var StepNyhedsbreveRed = require('./step_nyhedsbreve_redaktionelle');
var StepNyhedsbreveKom = require('./step_nyhedsbreve_kommercielle');
var StepFinished = require('./step_finished');

var Opdateringskampagne = React.createClass({
  getInitialState: function() {

    var ekstern_id = this.getSearchParameter('ekstern_id');

    return {
      step: 5,
      ekstern_id: ekstern_id !== null ? ekstern_id : '0cbf425b93500407ccc4481ede7b87da', // TEST TODO REMOVE
      showCheckbox300Perm: false
    };
  },
  componentDidMount: function() {
    this.loadingUserData = this.loadUserData();
  },
  componentWillUnmount: function() {
    this.loadingUserData.abort();
  },
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
        // this.setState({user: data});

        // We should still show the 300-perm checkbox is the user didn't have the perm to begin with, accepted the perm and come back to step 1 later.
        if (this.state.showCheckbox300Perm === false) {
          this.setState({showCheckbox300Perm: data.nyhedsbreve.indexOf(300) === -1});
        }
        this.setState({showStepNyhKom: data.nyhedsbreve.indexOf(66) > -1 || data.nyhedsbreve.indexOf(108) > -1 || data.nyhedsbreve.indexOf(300) > -1});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  stepForward: function () {
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
        { this.state.step === 1 ?
          <StepStamdata stepForward={this.stepForward} showCheckbox300Perm={this.state.showCheckbox300Perm} loadUserData={this.loadUserData} /> : null }
        { this.state.step === 2 ?
          <StepInteresser stepForward={this.stepForward} stepBackwards={this.stepBackwards} loadUserData={this.loadUserData} /> : null }
        { this.state.step === 3 ?
          <StepNyhedsbreveRed stepForward={this.stepForward} stepBackwards={this.stepBackwards} loadUserData={this.loadUserData} /> : null }
        { this.state.step === 4 ?
          <StepNyhedsbreveKom stepForward={this.stepForward} stepBackwards={this.stepBackwards} loadUserData={this.loadUserData} /> : null }
        { this.state.step === 5 ?
          <StepFinished stepBackwards={this.stepBackwards} loadUserData={this.loadUserData} /> : null }
      </div>
    );
  }
});



ReactDOM.render(
  <Opdateringskampagne />,
  document.getElementById('content')
);
