var React = require('react');

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

module.exports = Step1;
