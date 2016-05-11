var $ = require('jquery');
var React = require('react');
var Newsletters = require('./nyhedsbreve');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      nyhedsbreve: [],
      aok_nyhedsbreve: [
        { nyhedsbrev_id: 17, nyhedsbrev_navn: 'AOK Ugen og AOK Weekend' }],
      berlingske_nyhedsbreve: [
        { nyhedsbrev_id: 1, nyhedsbrev_navn: 'Berlingske Morgen' },
        { nyhedsbrev_id: 2, nyhedsbrev_navn: 'Berlingske Middag' },
        { nyhedsbrev_id: 6, nyhedsbrev_navn: 'Berlingske Breaking News' },
        { nyhedsbrev_id: 248, nyhedsbrev_navn: 'Berlingske Aften' },
        { nyhedsbrev_id: 3, nyhedsbrev_navn: 'Berlingske Weekend' }],
      bt_nyhedsbreve: [
        { nyhedsbrev_id: 24, nyhedsbrev_navn: 'BT Morgen' },
        { nyhedsbrev_id: 25, nyhedsbrev_navn: 'BT Eftermiddag' },
        { nyhedsbrev_id: 26, nyhedsbrev_navn: 'BT Breaking News' },
        { nyhedsbrev_id: 27, nyhedsbrev_navn: 'BT Sporten' }],
      business_nyhedsbreve: [
        { nyhedsbrev_id: 9, nyhedsbrev_navn: 'Berlingske Business Morgen' },
        { nyhedsbrev_id: 10, nyhedsbrev_navn: 'Berlingske Business Eftermiddag' },
        { nyhedsbrev_id: 13, nyhedsbrev_navn: 'Berlingske Business Breaking News' }]
      };
  },
  componentDidMount: function() {
    var nyhedsbreve_to_be_shown = [].concat(this.state.berlingske_nyhedsbreve, this.state.bt_nyhedsbreve, this.state.business_nyhedsbreve);
    this.setState({nyhedsbreve: nyhedsbreve_to_be_shown});
  },
  addAdditionalNewsletters: function (user) {
    var postnummer_dk = user.postnummer_dk;
    if ((postnummer_dk >= 900 && postnummer_dk <= 3699) || (postnummer_dk >= 4000 && postnummer_dk <= 4999)) {
      var nyhedsbreve_to_be_shown = this.state.nyhedsbreve.concat(this.state.aok_nyhedsbreve);
      this.setState({nyhedsbreve: nyhedsbreve_to_be_shown});
    }
  },
  render: function() {
    return (
      <Newsletters className="stepNyhedsbreveRed" nyhedsbreve={this.state.nyhedsbreve} loadUserDataSuccess={this.addAdditionalNewsletters} loadUserData={this.props.loadUserData} stepBackwards={this.props.stepBackwards} stepComplete={this.props.stepComplete} />
    );
  }
});
