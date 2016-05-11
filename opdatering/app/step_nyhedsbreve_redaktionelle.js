var $ = require('jquery');
var React = require('react');
var Newsletters = require('./nyhedsbreve');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      nyhedsbreve: [],
      aok_nyhedsbreve: [
        { id: 17, navn: 'AOK Ugen og AOK Weekend' }],
      berlingske_nyhedsbreve: [
        { id: 1, navn: 'Berlingske Morgen' },
        { id: 2, navn: 'Berlingske Middag' },
        { id: 6, navn: 'Berlingske Breaking News' },
        { id: 248, navn: 'Berlingske Aften' },
        { id: 3, navn: 'Berlingske Weekend' }],
      bt_nyhedsbreve: [
        { id: 24, navn: 'BT Morgen' },
        { id: 25, navn: 'BT Eftermiddag' },
        { id: 26, navn: 'BT Breaking News' },
        { id: 27, navn: 'BT Sporten' }],
      business_nyhedsbreve: [
        { id: 9, navn: 'Berlingske Business Morgen' },
        { id: 10, navn: 'Berlingske Business Eftermiddag' },
        { id: 13, navn: 'Berlingske Business Breaking News' }]
      };
  },
  componentDidMount: function() {
    var nyhedsbreve_to_be_shown = [].concat(this.state.berlingske_nyhedsbreve, this.state.bt_nyhedsbreve, this.state.business_nyhedsbreve);
    this.setState({nyhedsbreve: nyhedsbreve_to_be_shown});
  },
  addAdditionalNewsletters: function (user) {
    var postnummer_dk = user.postnummer_dk,
        additional_nyhedsbreve_to_be_shown = [];

    if ((postnummer_dk >= 900 && postnummer_dk <= 3699) || (postnummer_dk >= 4000 && postnummer_dk <= 4999)) {
      additional_nyhedsbreve_to_be_shown = this.state.nyhedsbreve.concat(this.state.aok_nyhedsbreve);
      this.setState({nyhedsbreve: additional_nyhedsbreve_to_be_shown});
    }
  },
  render: function() {
    return (
      <Newsletters className="stepNyhedsbreveRed" nyhedsbreve={this.state.nyhedsbreve} loadUserDataSuccess={this.addAdditionalNewsletters} loadUserData={this.props.loadUserData} stepBackwards={this.props.stepBackwards} stepForward={this.props.stepForward} />
    );
  }
});
