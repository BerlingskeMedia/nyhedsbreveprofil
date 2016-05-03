var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {user: {fornavn: '', efternavn: '', data_dirty: false}, show300Perm: true};
  },
  componentDidMount: function() {
    this.props.loadUserData().success(this.setUserState);
  },
  setUserState: function(data) {
    this.setState({user: data});
    this.setState({show300Perm: data.nyhedsbreve.indexOf(43) > -1});
  },
  handleFornavnChange: function (e, a) {
    this.state.user.fornavn = e.target.value;
    this.setUserState(this.state.user);
    this.setState({data_dirty: true});
  },
  handleEfternavnChange: function (e, a) {
    this.state.user.efternavn = e.target.value;
    this.setUserState(this.state.user);
    this.setState({data_dirty: true});
  },
  handle300PermChange: function (e) {
    var user = this.state.user;
    user.nyhedsbreve.push(300);
    this.setState({user: user});
    this.setState({data_dirty: true});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.data_dirty) {
      this.saveUserData(this.state.user).success(function (data) {
        this.props.stepComplete();
      }.bind(this));
    } else {
      this.props.stepComplete();
    }
  },
  saveUserData: function(userData) {
    userData.location_id = 1;
    return $.ajax({
      type: 'POST',
      url: '/backend/users/'.concat(this.state.user.ekstern_id),
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
  render: function() {
    return (
      <form className="stepStamdata" onSubmit={this.handleSubmit}>
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
        {!this.state.show300Perm ?
          <div>
            <input
              type="checkbox"
              placeholder="300"
              onChange={this.handle300PermChange}
            />
            <label>Tilbud fra Berlingske Media og vores partnere (E-post)</label>
          </div>
        : ''}
        <input type="submit" value="Videre" />
      </form>
    );
  }
});
