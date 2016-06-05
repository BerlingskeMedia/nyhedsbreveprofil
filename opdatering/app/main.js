var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var StepStamdata = require('./step_stamdata');
var StepInteresser = require('./step_interesser');
var StepNyhedsbreveRed = require('./step_nyhedsbreve_redaktionelle');
var StepNyhedsbreveKom = require('./step_nyhedsbreve_kommercielle');
var StepFinished = require('./step_finished');
var Sidebar = require('./sidebar');
var TopNavbar = require('./topnavbar');
var ButtomNavbar = require('./buttomnav');

var Opdateringskampagne = React.createClass({
  getInitialState: function() {
    return {
      userData: {
        nyhedsbreve: [],
        interesser: []
      },
      user_error: false,
      // ekstern_id: '0cbf425b93500407ccc4481ede7b87da', // TEST TODO REMOVE
      ekstern_id: null,
      abo: null,
      steps: [],
      step: 0,
      showCheckbox300Perm: false,
      hideStepNyhKom: false,
      hideStepNyhKom_dirty: false
    };
  },
  componentDidMount: function() {
    var ekstern_id = this.getSearchParameter('ekstern_id'),
        id = this.getSearchParameter('id');
    var abo = this.getSearchParameter('a');

    if (ekstern_id === null && id !== null) {
      ekstern_id = id;
      this.setSearchParameter('id', null);
      this.setSearchParameter('ekstern_id', ekstern_id);
    }

    if (ekstern_id !== null) {
      this.setState({ekstern_id: ekstern_id, abo: abo !== null ? abo.toUpperCase() : null }, this.loadUserData);
    } else {
      // TODO: ERROR ???
      this.setState({user_error: true});
    }

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
  setSearchParameter: function (key, value) {
    // remove the hash part before operating on the uri
    var uri = window.location.href;
    var i = uri.indexOf('#');
    var hash = i === -1 ? ''  : uri.substr(i);
         uri = i === -1 ? uri : uri.substr(0, i);

    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (value === undefined || value === null) {
      uri = uri.replace(re, '$1' + '$2').replace('?&', '?');
      if (uri.endsWith('&')) {
        uri = uri.slice(0, -1);
      }
    } else if (uri.match(re)) {
      uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
      uri = uri + separator + key + "=" + value;
    }
    var href = uri + hash;
    window.history.pushState({path:href},'',href)
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
    // The reason why steps are in the state in not just in render(), is because of data={this.state.userData}
    // Since userData is fetched aync, during the first render userData will be an empty object.
    // And after receiving userData and setting the state, the data={this.state.userData} won't get triggered.
    // So this workaround puts the steps in the state after the userData is received.

    var steps = [
      <StepStamdata sidebar_label="Dine kontaktoplysninger" stepForward={this.stepForward} showCheckbox300Perm={this.state.showCheckbox300Perm} data={this.state.userData} setHideStepNyhKom={this.setHideStepNyhKom} />,
      <StepInteresser sidebar_label="Dine interesser" stepForward={this.stepForward} stepBackwards={this.stepBackwards} data={this.state.userData} />,
      <StepNyhedsbreveRed sidebar_label="Dine nyhedsbreve" stepForward={this.stepForward} stepBackwards={this.stepBackwards} data={this.state.userData} abo={this.state.abo} />,
      <StepNyhedsbreveKom sidebar_label="Dine øvrige nyhedsbreve" stepForward={this.stepForward} stepBackwards={this.stepBackwards} data={this.state.userData} abo={this.state.abo} />,
      <StepFinished sidebar_label="Tak for din hjælp" stepBackwards={this.stepBackwards} data={this.state.userData} abo={this.state.abo} />
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
      if (step < this.state.steps.length) {
        this.setState({step: ++step});
      }

      ReactDOM.findDOMNode(this).scrollIntoView();
    }.bind(this));

  },
  stepBackwards: function () {
    this.loadUserData().success(function() {
      var step = this.state.step;
      if (step > 0) {
        this.setState({step: --step});
      }

      ReactDOM.findDOMNode(this).scrollIntoView();
    }.bind(this));

  },
  render: function() {
    var steps = [];
    Object.assign(steps, this.state.steps);

    if (this.state.hideStepNyhKom) {
      steps.splice(3,1);
    }

    return (
      <div id="opdateringskampagne" className="opdateringskampagne">
        <div className="hidden-sm hidden-md hidden-lg topnav">
          <TopNavbar steps={this.state.steps} step={this.state.step} />
        </div>
        <div className="steppage container-fluid">
          <div className="row">
            <div className="hidden-xs col-sm-4 col-md-2 col-lg-2 sidebar">
              <Sidebar step={this.state.step} steps={steps} />
            </div>
            <div className="col-sm-8 col-sm-offset-4 col-md-7 col-md-offset-4 col-lg-6 col-lg-offset-4 main">
              {steps[this.state.step]}
            </div>
          </div>
        </div>
        <div className="hidden-sm hidden-md hidden-lg buttomnav">
          <ButtomNavbar steps={this.state.steps} step={this.state.step} />
        </div>
      </div>
    );
  }
});

var UserMissing = React.createClass({
  render: function() {
    return(
      <div class="row">
        <div className="col-xs-4 col-xs-offset-4">
          <p className="text-center" style={{marginTop: '50px'}}>Bruger kunne ikke findes</p>
        </div>
      </div>
    );
  }
})

ReactDOM.render(
  <Opdateringskampagne />,
  document.getElementById('content')
);
