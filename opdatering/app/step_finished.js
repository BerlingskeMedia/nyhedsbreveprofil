var $ = require('jquery');
var React = require('react');

var InteresseList = require('./checkbox_list');

module.exports = React.createClass({
  getInitialState: function() {
    return {showOffers: false};
  },
  componentDidMount: function() {
    this.loadingUserData = this.props.loadUserData().success(function (data) {

      var temp = data.nyhedsbreve.some(function(nyhedsbrev_id) {
        return [66,108,283,300].indexOf(nyhedsbrev_id) > -1;
      });

      this.setState({showOffers: temp});
    }.bind(this));
  },
  componentWillUnmount: function() {
    this.loadingUserData.abort();
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
