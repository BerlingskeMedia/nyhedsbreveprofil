var $ = require('jquery');
var React = require('react');
var NewsletterList = require('./nyhedsbreve');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      user: {},
      nyhedsbreve: [],
      aok_nyhedsbreve: [17, 282],
      berlingske_nyhedsbreve: [1, 2, 6, 248, 3],
      bt_nyhedsbreve: [24, 25, 26, 27],
      business_nyhedsbreve: [9, 10, 13]};
  },
  componentDidMount: function() {
    this.props.loadUserData().success(function (data) {
      this.setState({user: data});
      this.loadNewsletters().success(function(data) {
        var nyhedsbreve_id_to_be_shown = [].concat(this.state.berlingske_nyhedsbreve, this.state.bt_nyhedsbreve, this.state.business_nyhedsbreve);

        var postnummer_dk = this.state.user.postnummer_dk;
        if ((postnummer_dk >= 900 && postnummer_dk <= 3699) || (postnummer_dk >= 4000 && postnummer_dk <= 4999)) {
          nyhedsbreve_id_to_be_shown = nyhedsbreve_id_to_be_shown.concat(this.state.aok_nyhedsbreve);
        }

        var nyhedsbreve = data.filter(function(nyhedsbrev) {
          return nyhedsbreve_id_to_be_shown.indexOf(nyhedsbrev.nyhedsbrev_id) > -1;
        });

        this.setState({nyhedsbreve: nyhedsbreve});
      }.bind(this));
    }.bind(this));
  },
  loadNewsletters: function() {
    return $.ajax({
      url: '/backend/nyhedsbreve?permission=0',
      dataType: 'json',
      cache: true,
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="stepNyhedsbreve">
        <NewsletterList user={this.state.user} nyhedsbreve={this.state.nyhedsbreve} />
        <input type="button" value="Tilbage" onClick={this.props.stepBackwards} />
        <input type="button" value="Videre" onClick={this.props.stepComplete} />
      </div>
    );
  }
});
