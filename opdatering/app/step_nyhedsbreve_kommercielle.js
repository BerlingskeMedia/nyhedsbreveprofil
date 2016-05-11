var $ = require('jquery');
var React = require('react');
var Newsletters = require('./nyhedsbreve');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      nyhedsbreve: [],
      godttip_nyhedsbreve: [
        {id: 246, navn: 'Tilbud fra Godttip.dk'}],
      tbt_nyhedsbreve: [
        {id: 844, navn: 'The Business Target'}],
      shop_nyhedsbreve: [
        {id: 233, navn: 'BTSHOP.dk'},
        {id: 241, navn: 'Berlingske SHOP'}],
      sweetdeal_generel_nyhedsbreve: [
        {id: 821, navn: 'Sweetdeal Products'},
        {id: 833, navn: 'Sweetdeal Travel'}],
      sweetdeal_aarhus_nyhedsbreve: []};
  },
  componentDidMount: function() {
    var nyhedsbreve_id_to_be_shown = [].concat(this.state.godttip_nyhedsbreve, this.state.tbt_nyhedsbreve, this.state.shop_nyhedsbreve, this.state.sweetdeal_generel_nyhedsbreve);
    this.setState({nyhedsbreve: nyhedsbreve_id_to_be_shown});
  },
  addAdditionalNewsletters: function(user) {
    var postnummer_dk = user.postnummer_dk,
        additional_nyhedsbreve_to_be_shown = [];

    if ((postnummer_dk >= 900 && postnummer_dk <= 3699) || (postnummer_dk >= 4000 && postnummer_dk <= 4999)) {
      additional_nyhedsbreve_to_be_shown = this.state.nyhedsbreve.concat(this.state.sweetdeal_aarhus_nyhedsbreve);
      this.setState({nyhedsbreve: additional_nyhedsbreve_to_be_shown});
    }
  },
  render: function() {
    return (
      <Newsletters className="stepNyhedsbreveKom" nyhedsbreve={this.state.nyhedsbreve} loadUserDataSuccess={this.addAdditionalNewsletters} loadUserData={this.props.loadUserData} stepBackwards={this.props.stepBackwards} stepComplete={this.props.stepComplete} />
    );
  }
});
