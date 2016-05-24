var $ = require('jquery');
var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      ekstern_id: '',
      email: '',
      fornavn: '',
      efternavn: '',
      vejnavn: '',
      postnummer: '',
      bynavn: '',
      data_dirty: false,
      has300: false,
      has300_dirty: false
    };
  },
  componentDidMount: function() {

    ga('set', 'page', 'opdateringskampagne/step-stamdata');
    ga('send', 'pageview');

    this.setState({ekstern_id: this.props.data.ekstern_id});
    this.setState({email: this.props.data.email});
    this.setState({fornavn: this.props.data.fornavn});
    this.setState({efternavn: this.props.data.efternavn});
    this.setState({vejnavn: this.props.data.vejnavn});
    this.setState({postnummer: this.props.data.postnummer});
    this.setState({bynavn: this.props.data.bynavn});
    this.setState({has300: this.props.data.nyhedsbreve.indexOf(300) > -1});
  },
  handleFornavnChange: function (e, a) {
    this.setState({fornavn: e.target.value})
    this.setState({data_dirty: true});
  },
  handleEfternavnChange: function (e, a) {
    this.setState({efternavn: e.target.value});
    this.setState({data_dirty: true});
  },
  handleEmailChange: function (e, a) {
    this.setState({email: e.target.value});
    this.setState({data_dirty: true});
  },
  handleVejnavnChange: function (e, a) {
    this.setState({vejnavn: e.target.value});
    this.setState({data_dirty: true});
  },
  handlePostnummerChange: function (e, a) {
    this.setState({postnummer: e.target.value});
    this.setState({data_dirty: true});
  },
  handleBynavnChange: function (e, a) {
    this.setState({bynavn: e.target.value});
    this.setState({data_dirty: true});
  },
  handle300PermChange: function (e) {
    this.setState({has300: !this.state.has300});
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
        email: this.state.email,
        fornavn: this.state.fornavn,
        efternavn: this.state.efternavn,
        vejnavn: this.state.vejnavn,
        postnummer: this.state.postnummer,
        bynavn: this.state.bynavn,
        location_id: 2059
      };
      
      return $.ajax({
        type: 'POST',
        url: '/backend/users/'.concat(this.state.ekstern_id),
        data: JSON.stringify(payload),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data) {
          this.props.stepForward();
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    } else {
      this.props.stepForward();
    }
  },
  add300: function() {
    return $.ajax({
      type: 'POST',
      url: '/backend/users/'.concat(this.state.ekstern_id, '/nyhedsbreve/300?location_id=2059'),
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
      url: '/backend/users/'.concat(this.state.ekstern_id, '/nyhedsbreve/300?location_id=2059'),
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
      <div className="stepStamdata">
        <form onSubmit={this.handleSubmit}>
          <h1>Opdatér venligst dine stamoplysninger</h1>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-control"
              type="text"
              placeholder="Email"
              onChange={this.handleEmailChange}
              value={this.state.email}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fornavn">Fornavn</label>
            <input
              id="fornavn"
              className="form-control"
              type="text"
              placeholder="Fornavn"
              onChange={this.handleFornavnChange}
              value={this.state.fornavn}
            />
          </div>
          <div className="form-group">
            <label htmlFor="efternavn">Efternavn</label>
            <input
              id="efternavn"
              className="form-control"
              type="text"
              placeholder="Efternavn"
              onChange={this.handleEfternavnChange}
              value={this.state.efternavn}
            />
          </div>
          <div className="form-group">
            <label htmlFor="vejnavn">Vejnavn</label>
            <input
              id="vejnavn"
              className="form-control"
              type="text"
              placeholder="Vejnavn"
              onChange={this.handleVejnavnChange}
              value={this.state.vejnavn}
            />
          </div>
          <div className="form-group">
            <label htmlFor="postnummer">Postnummer</label>
            <input
              id="postnummer"
              className="form-control"
              type="text"
              placeholder="Postnummer"
              onChange={this.handlePostnummerChange}
              value={this.state.postnummer}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bynavn">By</label>
            <input
              id="bynavn"
              className="form-control"
              type="text"
              placeholder="By"
              onChange={this.handleBynavnChange}
              value={this.state.bynavn}
            />
          </div>
          {this.props.showCheckbox300Perm ?
            <div className="checkbox">
              <label>
                <input
                id="300"
                type="checkbox"
                placeholder="300"
                onChange={this.handle300PermChange}
                checked={this.state.has300}
                />
                Tilbud fra Berlingske Media og vores partnere (E-post)
              </label>
            </div>
          : null }
          <input className="nextButton" type="submit" value="Næste" />
        </form>
      </div>
    );
  }
});
