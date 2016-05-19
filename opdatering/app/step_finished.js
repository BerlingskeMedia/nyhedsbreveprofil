var $ = require('jquery');
var React = require('react');

var InteresseList = require('./checkbox_list');

module.exports = React.createClass({
  getInitialState: function() {
    return {showOffers: false};
  },
  componentDidMount: function() {

    ga('set', 'page', 'opdateringskampagne/step_finished');
    ga('send', 'pageview');

    var temp = this.props.data.nyhedsbreve.some(function(nyhedsbrev_id) {
      return [66,108,283,300].indexOf(nyhedsbrev_id) > -1;
    });

    this.setState({showOffers: temp});
    this.sendCampaignSignup();
  },
  sendCampaignSignup: function() {

    var payload = {
      kampagne_id: 3703,
      ekstern_id: this.props.data.ekstern_id
    };

    return $.ajax({
      type: 'POST',
      url: '/backend/kampagner/kampagnelinie',
      data: JSON.stringify(payload),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return(
      <div>
        <p>Tak</p>
        {this.state.showOffers === true ? <NewspaperOffers /> : null}
        <input type="button" value="Tilbage" onClick={this.props.stepBackwards} />
      </div>
    );
  }
});

var NewspaperOffers = React.createClass({
  render: function() {
    return (
      <p>Dette er de fede avistilbud</p>
    );
  }
});
