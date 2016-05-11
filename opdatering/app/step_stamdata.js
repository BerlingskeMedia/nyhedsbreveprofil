var $ = require('jquery');
var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {ekstern_id: '', email: '', fornavn: '', efternavn: '', data_dirty: false, has300: false, has300_dirty: false};
    // return {fornavn: '', efternavn: '', has300: false};
    // return {has300: false, show300Perm: false};
    // return {has300: false};
  },
  componentDidMount: function() {
    this.loadingUserData = this.props.loadUserData().success(function (data) {
      this.setState({ekstern_id: data.ekstern_id});
      this.setState({email: data.email});
      this.setState({fornavn: data.fornavn});
      this.setState({efternavn: data.efternavn});
      this.setState({has300: data.nyhedsbreve.indexOf(300) > -1});
    }.bind(this));
    // this.props.loadUserData().success(this.setUserState);
    // this.setState({fornavn: this.props.user.fornavn});
    // this.setState({efternavn: this.props.user.efternavn});
  },
  componentWillUnmount: function() {
    this.loadingUserData.abort();
  },
  // setUserState: function(data) {
  //   this.setState({user: data});
  //   this.setState({show300Perm: data.nyhedsbreve.indexOf(300) > -1});
  // },
  componentWillReceiveProps: function() {
    // console.log('componentWillReceiveProps');
    // if (this.props.user.fornavn) {
    //   this.setState({fornavn: this.props.user.fornavn});
    // }
    // if (this.props.user.efternavn) {
    //   this.setState({efternavn: this.props.user.efternavn});
    // }
  },
  handleFornavnChange: function (e, a) {
    // var user = this.state.user;
    // this.props.user.fornavn = e.target.value;
    // this.setState({user: user});
    // this.props.setUserData({fornavn: e.target.value});
    this.setState({fornavn: e.target.value})
    this.setState({data_dirty: true});
  },
  handleEfternavnChange: function (e, a) {
    // var user = this.state.user;
    // user.efternavn = e.target.value;
    // this.setState({user: user});
    // this.props.setUserData({efternavn: e.target.value});
    this.setState({efternavn: e.target.value});
    this.setState({data_dirty: true});
  },
  handleEmailChange: function (e, a) {
    this.setState({email: e.target.value});
    this.setState({data_dirty: true});
  },
  handle300PermChange: function (e) {
    // var user = this.state.user;
    // this.props.user.nyhedsbreve.push(300);
    // this.props.toggleNyhedsbrev(300);
    this.setState({has300: !this.state.has300});
    // this.setState({user: user});
    this.setState({has300_dirty: true});
  },
  handleSubmit: function(e) {
    e.preventDefault();

    // Tilmeld og afmeld perm 300
    if (this.state.has300_dirty) {
      if (this.state.has300) {
        this.add300();
      } else {
        this.delete300();
      }
    }

    if (this.state.data_dirty) {


      var payload = {
        // email: this.state.email,
        // xxx: this.state.xxx,
        // xxx: this.state.xxx,
        // xxx: this.state.xxx,
        email: this.state.email,
        fornavn: this.state.fornavn,
        efternavn: this.state.efternavn,
        location_id: 1
      };
      return $.ajax({
        type: 'POST',
        url: '/backend/users/'.concat(this.state.ekstern_id),
        data: JSON.stringify(payload),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data) {
          this.props.stepComplete();
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    } else {
      this.props.stepComplete();
    }
  },
  add300: function() {
    return $.ajax({
      type: 'POST',
      url: '/backend/users/'.concat(this.state.ekstern_id, '/nyhedsbreve/300?location_id=1'),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      success: function (data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  delete300: function() {
    return $.ajax({
      type: 'DELETE',
      url: '/backend/users/'.concat(this.state.ekstern_id, '/nyhedsbreve/300?location_id=1'),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      success: function (data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <form className="stepStamdata" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Fornavn"
          onChange={this.handleFornavnChange}
          value={this.state.fornavn}
        />
        <input
          type="text"
          placeholder="Efternavn"
          onChange={this.handleEfternavnChange}
          value={this.state.efternavn}
        />
        <input
          type="text"
          placeholder="Email"
          onChange={this.handleEmailChange}
          value={this.state.email}
        />
        {this.props.showCheckbox300Perm ?
          <div>
            <input
              type="checkbox"
              placeholder="300"
              onChange={this.handle300PermChange}
              checked={this.state.has300}
            />
            <label>Tilbud fra Berlingske Media og vores partnere (E-post)</label>
          </div>
        : null }
        <input type="submit" value="Videre" />
      </form>
    );
  }
});
