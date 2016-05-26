var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var StepStamdata = require('./step_stamdata');
var StepInteresser = require('./step_interesser');
var StepNyhedsbreveRed = require('./step_nyhedsbreve_redaktionelle');
var StepNyhedsbreveKom = require('./step_nyhedsbreve_kommercielle');
var StepFinished = require('./step_finished');
var Sidebar = require('./sidebar');

var Opdateringskampagne = React.createClass({
  getInitialState: function() {

    var ekstern_id = this.getSearchParameter('ekstern_id');
    var abo = this.getSearchParameter('a');

    return {
      userData: {
        nyhedsbreve: [],
        interesser: []
      },
      ekstern_id: ekstern_id !== null ? ekstern_id : '0cbf425b93500407ccc4481ede7b87da', // TEST TODO REMOVE
      abo: abo !== null ? abo.toUpperCase() : null,
      steps: [],
      step: 0,
      showCheckbox300Perm: false,
      hideStepNyhKom: false,
      hideStepNyhKom_dirty: false
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
  setSearchParameter: function (key, value) {
    // remove the hash part before operating on the uri
    var uri = window.location.href;
    var i = uri.indexOf('#');
    var hash = i === -1 ? ''  : uri.substr(i);
         uri = i === -1 ? uri : uri.substr(0, i);

    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
      uri = uri + separator + key + "=" + value;
    }
    var href = uri + hash;
    window.history.pushState({path:href},'',href)
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
        this.determinShowStepNyhedsbreveKommmercial,
        this.setStepsState
      ],
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
  determinShowStepNyhedsbreveKommmercial: function(data) {
    if (!this.state.hideStepNyhKom_dirty) {
      var hideStepNyhKom = !data.nyhedsbreve.some(function(nyhedsbrev_id) {
        return [66,108,300].indexOf(nyhedsbrev_id) > -1;
      });

      this.setState({hideStepNyhKom: hideStepNyhKom});
    }
  },
  setHideStepNyhKom(hide) {
    this.setState({hideStepNyhKom: hide, hideStepNyhKom_dirty: true});
  },
  setStepsState: function () {
    var steps = [
      <StepStamdata sidebar_label="Stamoplysninger" stepForward={this.stepForward} showCheckbox300Perm={this.state.showCheckbox300Perm} data={this.state.userData} setHideStepNyhKom={this.setHideStepNyhKom} />,
      <StepInteresser sidebar_label="Interesser" stepForward={this.stepForward} stepBackwards={this.stepBackwards} data={this.state.userData} />,
      <StepNyhedsbreveRed sidebar_label="Redaktionelle nyhedsbreve" stepForward={this.stepForward} stepBackwards={this.stepBackwards} data={this.state.userData} abo={this.state.abo} />,
      <StepNyhedsbreveKom sidebar_label="Kommercielle nyhedsbreve" stepForward={this.stepForward} stepBackwards={this.stepBackwards} data={this.state.userData} abo={this.state.abo} />,
      <StepFinished sidebar_label="Tak for hjælpen" stepBackwards={this.stepBackwards} data={this.state.userData} />
    ];

    this.setState({steps: steps});
  },
  stepForward: function (ekstern_id) {
    if (ekstern_id !== undefined) {
      this.setState({ekstern_id:ekstern_id}, function() {
        this.setSearchParameter('ekstern_id', ekstern_id);
      });
    }
    this.loadUserData().success(function() {
      var step = this.state.step;
      this.setState({step: ++step});
    }.bind(this));
  },
  stepBackwards: function () {
    this.loadUserData().success(function() {
      var step = this.state.step;
      this.setState({step: --step});
    }.bind(this));
  },
  render: function() {
    var steps = [];
    Object.assign(steps, this.state.steps);

    if (this.state.hideStepNyhKom) {
      steps.splice(3,1);
    }

    return (
      <div className="opdateringskampagne row" style={{paddingTop: '20px', marginBottom: '50px'}}>
        <div className="col-sm-2 col-lg-2 sidebar">
          <Sidebar step={this.state.step} steps={steps} />
        </div>
        <div className="col-sm-6 col-sm-offset-2 col-lg-5 col-lg-offset-2 main">
          {steps[this.state.step]}
        </div>
      </div>
    );
  }
});


ReactDOM.render(
  <Opdateringskampagne />,
  document.getElementById('content')
);
