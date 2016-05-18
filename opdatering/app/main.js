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
    var abo = this.getSearchParameter('a');

    return {
      userData: {},
      steps: [],
      step: 0,
      ekstern_id: ekstern_id !== null ? ekstern_id : '0cbf425b93500407ccc4481ede7b87da', // TEST TODO REMOVE
      showCheckbox300Perm: false,
      showStepNyhKom: true,
      abo: abo !== null ? abo.toUpperCase() : null
    };
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
  componentDidMount: function () {
    this.loadUserData();
  },
  componentWillUnmount: function() {
    this.loadingUserData.abort();
  },
  loadUserData: function() {
    this.loadingUserData = $.ajax({
      url: '/backend/users/'.concat(this.state.ekstern_id),
      dataType: 'json',
      cache: true,
      success: [
        this.setUserState,
        this.determinShowCheckbox300Perm,
        this.determinSteps],
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

    return this.loadingUserData;
  },
  setUserState: function (data) {
    this.setState({userData: data});
  },
  determinShowCheckbox300Perm: function (data) {
    // We should still show the 300-perm checkbox is the user didn't have the perm to begin with, accepted the perm and comes back to step 1 later.
    if (this.state.showCheckbox300Perm === false) {
      this.setState({showCheckbox300Perm: data.nyhedsbreve.indexOf(300) === -1});
    }
  },
  determinSteps: function (data) {

    var steps = [
      <StepStamdata stepForward={this.stepForward} showCheckbox300Perm={this.state.showCheckbox300Perm} data={this.state.userData} />,
      <StepInteresser stepForward={this.stepForward} stepBackwards={this.stepBackwards} data={this.state.userData} />,
      <StepNyhedsbreveRed stepForward={this.stepForward} stepBackwards={this.stepBackwards} data={this.state.userData} abo={this.state.abo} />,
      <StepNyhedsbreveKom stepForward={this.stepForward} stepBackwards={this.stepBackwards} data={this.state.userData} abo={this.state.abo} />,
      <StepFinished stepBackwards={this.stepBackwards} data={this.state.userData} />
    ];

    var showStepNyhKom = data.nyhedsbreve.some(function(nyhedsbrev_id) {
      return [66,108,300].indexOf(nyhedsbrev_id) > -1;
    });

    if (!showStepNyhKom) {
      steps.splice(3,1);
    }

    this.setState({steps: steps});
  },
  stepForward: function () {
    this.loadUserData();
    var step = this.state.step;
    this.setState({step: ++step});
  },
  stepBackwards: function () {
    this.loadUserData();
    var step = this.state.step;
    this.setState({step: --step});
  },
  render: function() {

    return (
      <div className="opdateringskampagne">
        {this.state.steps[this.state.step]}
      </div>
    );
  }
});


ReactDOM.render(
  <Opdateringskampagne />,
  document.getElementById('content')
);
