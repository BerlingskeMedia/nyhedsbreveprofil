const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const StepStamdata = require('./step_stamdata');
const StepInteresser = require('./step_interesser');
const StepNyhedsbreveRed = require('./step_nyhedsbreve_redaktionelle');
const StepNyhedsbreveKom = require('./step_nyhedsbreve_kommercielle');
const StepFinished = require('./step_finished');
const Sidebar = require('./sidebar');
const TopNavbar = require('./topnavbar');
const BottomNavbarDesktop = require('./bottomnavbar_desktop');
const BottomNavbar = require('./bottomnavbar_mobile');

class Opdateringskampagne extends React.Component {

  constructor(props) {

    const runningInProduction = window.location.host.indexOf('profil.berlingskemedia.dk') > -1;

    super(props);
    this.loadUserData = this.loadUserData.bind(this);
    this.determinShowCheckbox300Perm = this.determinShowCheckbox300Perm.bind(this);
    this.determinShowStepNyhedsbreveKommmercial = this.determinShowStepNyhedsbreveKommmercial.bind(this);
    this.setHideStepNyhKom = this.setHideStepNyhKom.bind(this);
    this.setStepsState = this.setStepsState.bind(this);
    this.getCompleteStepFunc = this.getCompleteStepFunc.bind(this);
    this.stepForward = this.stepForward.bind(this);
    this.stepBackward = this.stepBackward.bind(this);
    this.state = {
      userData: {
        nyhedsbreve: [],
        interesser: []
      },
      user_error: false,
      // ekstern_id: '0cbf425b93500407ccc4481ede7b87da', // TEST TODO REMOVE
      ekstern_id: null,
      abo: null,
      steps: [],
      step: runningInProduction ? 0 : 0, // You can override the starting step. But we  make sure the flow starts at first step in procution
      stepping: false,
      showCheckbox300Perm: false,
      hideStepNyhKom: false,
      hideStepNyhKom_dirty: false
    };
  }

  componentDidMount() {

    if (window.location.host.indexOf('profil.berlingskemedia.dk') > -1) {
      ga('set', 'page', 'opdateringskampagne/start');
      ga('send', 'pageview');
    }

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
      this.setState({user_error: true});
    }

  }

  componentWillUnmount() {
    this.loadingUserData.abort();
  }

  getSearchParameter(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  setSearchParameter(key, value) {
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
    if (window.history.pushState) {
      window.history.pushState({path:href},'',href)
    }
  }

  loadUserData() {
    this.loadingUserData = $.ajax({
      url: '/backend/users/'.concat(this.state.ekstern_id),
      dataType: 'json',
      cache: true
    })
    .done(data => {
      this.setState({userData: data});
      this.determinShowCheckbox300Perm(data);
      this.determinShowStepNyhedsbreveKommmercial(data);
      this.setStepsState();
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      this.setState({user_error: true});
      console.error(jqXHR.responseText);
    });

    return this.loadingUserData;
  }

  determinShowCheckbox300Perm(data) {
    // We should still show the 300-perm checkbox is the user didn't have the perm to begin with, accepted the perm and comes back to step 1 later.
    if (this.state.showCheckbox300Perm === false) {
      this.setState({showCheckbox300Perm: data.permissions.indexOf(300) === -1});
    }
  }

  determinShowStepNyhedsbreveKommmercial(data) {
    if (!this.state.hideStepNyhKom_dirty) {
      var hideStepNyhKom = !data.permissions.some(function(permission_id) {
        return [66,108,300].indexOf(permission_id) > -1;
      });

      this.setState({hideStepNyhKom: hideStepNyhKom});
    }
  }

  setHideStepNyhKom(hide) {
    this.setState({hideStepNyhKom: hide, hideStepNyhKom_dirty: true});
  }

  setStepsState() {
    // The reason why steps are in the state in not just in render(), is because of data={this.state.userData}
    // Since userData is fetched aync, during the first render userData will be an empty object.
    // And after receiving userData and setting the state, the data={this.state.userData} won't get triggered.
    // So this workaround puts the steps in the state after the userData is received.

    var steps = [

      <StepStamdata
        sidebar_label="Dine kontaktoplysninger"
        ref={this.getCompleteStepFunc}
        stepForward={this.stepForward}
        showCheckbox300Perm={this.state.showCheckbox300Perm}
        data={this.state.userData}
        setHideStepNyhKom={this.setHideStepNyhKom} />,

      <StepInteresser
        sidebar_label="Dine interesser"
        ref={this.getCompleteStepFunc}
        stepForward={this.stepForward}
        stepBackward={this.stepBackward}
        data={this.state.userData} />,

      <StepNyhedsbreveRed
        sidebar_label="Dine nyhedsbreve"
        ref={this.getCompleteStepFunc}
        stepForward={this.stepForward}
        stepBackward={this.stepBackward}
        data={this.state.userData}
        abo={this.state.abo} />,

      <StepNyhedsbreveKom
        sidebar_label="Dine øvrige nyhedsbreve"
        ref={this.getCompleteStepFunc}
        stepForward={this.stepForward}
        stepBackward={this.stepBackward}
        data={this.state.userData}
        abo={this.state.abo} />,

      <StepFinished
        sidebar_label="Tak for din hjælp"
        stepBackward={this.stepBackward}
        data={this.state.userData}
        abo={this.state.abo} />
    ];

    this.setState({steps: steps});

    function hoc(WrappedComponent) {

    }
  }

  getCompleteStepFunc(step) {
    if (step && step.completeStepFunc) {
      var stepForwardFunc = this.stepForward.bind(this, step.completeStepFunc);
      var stepBackwardFunc = this.stepBackward.bind(this, step.completeStepFunc);
      this.setState({stepForwardFunc: stepForwardFunc, stepBackwardFunc: stepBackwardFunc})
    } else {
      // Just to be safe.
      this.setState({stepForwardFunc: null, stepBackwardFunc: null})
    }
  }

  stepForward(completeStepFunc) {
    if (this.state.stepping === true) {
      return;
    }

    this.setState({stepping: true});

    completeStepFunc()
    .done((new_ekstern_id) => {

      if (new_ekstern_id !== undefined) {
        this.setState({ekstern_id: new_ekstern_id}, function() {
          this.setSearchParameter('ekstern_id', new_ekstern_id);
        });
      }

      this.loadUserData()
      .done(() => {
        const step = this.state.step;
        if (step < this.state.steps.length) {
          this.setState({step: step + 1});
        }

        ReactDOM.findDOMNode(this).scrollIntoView();
        this.setState({stepping: false});
      });
    })
    .fail(err => {
      console.error(err);
      this.setState({stepping: false});
    });
  }

  stepBackward(completeStepFunc) {
    if (this.state.stepping === true) {
      return;
    }

    this.setState({stepping: true});

    completeStepFunc()
    .done(()=> {

      this.loadUserData()
      .done(function() {
        const step = this.state.step;
        if (step > 0) {
          this.setState({step: step - 1});
        }

        ReactDOM.findDOMNode(this).scrollIntoView();
        this.setState({stepping: false});
      });
    })
    .fail(err => {
      console.error(err);
      this.setState({stepping: false});
    });
  }

  render() {

    // var steps = [];
    // Object.assign(steps, this.state.steps);
    var steps = [].concat(this.state.steps);

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
            <div className="hidden-xs col-sm-3 col-md-2 col-lg-2 sidebar">
              <Sidebar step={this.state.step} steps={steps} />
            </div>
            <div className="col-sm-7 col-sm-offset-4 col-md-6 col-md-offset-4 col-lg-5 col-lg-offset-4 main">
              {this.state.user_error === false ?
                <div>
                  {steps[this.state.step]}
                  <div className="hidden-xs">
                    <BottomNavbarDesktop
                      steps={steps}
                      step={this.state.step}
                      stepping={this.state.stepping}
                      nextFunc={this.state.stepForwardFunc}
                      prevFunc={this.state.stepBackwardFunc} />
                  </div>
                </div>
                : <UserMissing />
              }
            </div>
          </div>
        </div>
        <div className="hidden-sm hidden-md hidden-lg bottomnav">
          <BottomNavbar
            steps={steps}
            step={this.state.step}
            stepping={this.state.stepping}
            nextFunc={this.state.stepForwardFunc}
            prevFunc={this.state.stepBackwardFunc} />
        </div>
      </div>
    );
  }
}

class UserMissing extends React.Component {

  componentDidMount() {
    if (window.location.host.indexOf('profil.berlingskemedia.dk') > -1) {
      ga('set', 'page', 'opdateringskampagne/user-missing');
      ga('send', 'pageview');
    }
  }

  render() {
    return(
      <div className="userMissing">
        <div className="text-center" style={{marginTop: '50px', fontSize: '20px'}}>
          <p>Vi kunne desværre ikke finde din profil.</p>
          <p>Videresend den mail, som du har modtaget til <a href="mailto:nyhedsbreve@berlingske.dk">nyhedsbreve@berlingske.dk</a>, så svarer vi dig hurtigst muligt.</p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Opdateringskampagne />,
  document.getElementById('content')
);
