var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var StepStamdata = require('./step_stamdata');
var StepInteresser = require('./step_interesser');
var StepNyhedsbreveRed = require('./step_nyhedsbreve_redaktionelle');
var StepNyhedsbreveKom = require('./step_nyhedsbreve_kommercielle');

var Opdateringskampagne = React.createClass({
  getInitialState: function() {
    var ekstern_id = this.getSearchParameter('ekstern_id');

    if (ekstern_id === null) {
      ekstern_id = '0cbf425b93500407ccc4481ede7b87da'; // TEST TODO REMOVE
    }

    // return {user: {}, step: 1, ekstern_id: ekstern_id, showCheckbox300Perm: false};
    return {step: 2, ekstern_id: ekstern_id, showCheckbox300Perm: false};
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

        // We should still show the 300-perm checkbox is the user didn't have the perm to begin with
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
  // setUserData: function (input) {
  //   console.log('setUserData', input);
  //   Object.keys(input).forEach(function(key) {
  //     var user = this.state.user;
  //     user[key] = input[key];
  //     this.setState({user: user});
  //   }.bind(this));
  // },
  // changeInteresser: function (input) {
  //   this.setState({changed_interesser: input});
  // },
  // addNyhedsbrev: function(nyhedsbrev_id) {
  //   var user = this.state.user;
  //   var i = user.nyhedsbreve.indexOf(nyhedsbrev_id);
  //   if (i === -1) {
  //     user.nyhedsbreve.push(nyhedsbrev_id);
  //     this.setState({user: user});
  //   }
  //
  //   if (nyhedsbrev_id === 300) {
  //     this.setState({showStepNyhKom: true});
  //   }
  // },
  // removeNyhedsbrev: function(nyhedsbrev_id) {
  //   var user = this.state.user;
  //   var i = user.nyhedsbreve.indexOf(nyhedsbrev_id);
  //   if (i > -1) {
  //     user.nyhedsbreve.splice(i, 1);
  //     this.setState({user: user});
  //   }
  //
  //   if (nyhedsbrev_id === 300) {
  //     this.setState({showStepNyhKom: false});
  //   }
  // },
  // toggleNyhedsbrev: function(nyhedsbrev_id) {
  //   var user = this.state.user;
  //   var i = user.nyhedsbreve.indexOf(nyhedsbrev_id);
  //   if (i === -1) {
  //     user.nyhedsbreve.push(nyhedsbrev_id);
  //   } else {
  //     user.nyhedsbreve.splice(i, 1);
  //   }
  //   this.setState({user: user});
  // },
  // addInteresse: function (interesse_id) {
  //   var user = this.state.user;
  //   user.interesser.push(interesse_id);
  //   this.setState({user: user});
  // },
  // removeInteresse: function(interesse_id) {
  //   var user = this.state.user;
  //   var i = user.interesser.indexOf(interesse_id);
  //   if (i > -1) {
  //     user.interesser.splice(i, 1);
  //     this.setState({user: user});
  //   }
  // },
  // toggleInteresse: function(interesse_id) {
  //   var user = this.state.user;
  //   var i = user.interesser.indexOf(interesse_id);
  //   if (i === -1) {
  //     user.interesser.push(interesse_id);
  //   } else {
  //     user.interesser.splice(i, 1);
  //   }
  //   this.setState({user: user});
  // },
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
        { this.state.step === 1 ?
          <StepStamdata stepComplete={this.stepComplete} showCheckbox300Perm={this.state.showCheckbox300Perm} loadUserData={this.loadUserData} /> : null }
        { this.state.step === 2 ?
          <StepInteresser stepComplete={this.stepComplete} stepBackwards={this.stepBackwards} loadUserData={this.loadUserData} /> : null }
        { this.state.step === 3 ?
          <StepNyhedsbreveRed stepComplete={this.stepComplete} stepBackwards={this.stepBackwards} loadUserData={this.loadUserData} /> : null }
        { this.state.step === 4 ?
          <StepNyhedsbreveKom stepComplete={this.stepComplete} stepBackwards={this.stepBackwards} loadUserData={this.loadUserData} /> : null }
      </div>
    );
  }
});



ReactDOM.render(
  <Opdateringskampagne />,
  document.getElementById('content')
);
