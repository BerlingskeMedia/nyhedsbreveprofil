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
        {id: 845, navn: 'Sweetdeal Rejser'},
        {id: 855, navn: 'Sweetdeal Shopping'}]
    };
  },
  componentDidMount: function() {

    ga('set', 'page', '/step_nyhedsbreve_redaktionelle');
    ga('send', 'pageview');

    var nyhedsbreve_id_to_be_shown = [].concat(this.state.godttip_nyhedsbreve, this.state.tbt_nyhedsbreve, this.state.shop_nyhedsbreve, this.state.sweetdeal_generel_nyhedsbreve);
    this.setState({nyhedsbreve: nyhedsbreve_id_to_be_shown});
  },
  addAdditionalNewsletters: function(user) {
    var postnummer_dk = user.postnummer_dk,
        additional_nyhedsbreve_to_be_shown = [];

    // Bemærk at Sweetdeal Travel skal hedde Sweetdeal Rejser og Sweetdeal Product skal hedde Sweetdeal Shopping.
    // Sweetdeal Rejser (id 845) og Sweetdeal Shopping (id 855) skal vises for alle.

    // København (id 846) - postnummer 0900-3699
    if (postnummer_dk >= 900 && postnummer_dk <= 3699) {
      additional_nyhedsbreve_to_be_shown.push({id: 846, navn: 'Sweetdeal København'});
    }

    // Aabenraa (id 853) - postnummer 6200
    if (postnummer_dk === 6200) {
      additional_nyhedsbreve_to_be_shown.push({id: 853, navn: 'Sweetdeal Aabenraa'});
    }

    // Aarhus (id 847) - postnummer 8000-8300
    if (postnummer_dk >= 8000 && postnummer_dk <= 8300) {
      additional_nyhedsbreve_to_be_shown.push({id: 847, navn: 'Sweetdeal Aarhus'});
    }

    // Esbjerg (id 864) - postnummer 6700,6701,6705,6710,6715
    if ([6700,6701,6705,6710,6715].indexOf(postnummer_dk) > -1) {
      additional_nyhedsbreve_to_be_shown.push({id: 864, navn: 'Sweetdeal Esbjerg'});
    }

    // Haderslev (id 861) - postnummer 6100
    if (postnummer_dk === 6100) {
      additional_nyhedsbreve_to_be_shown.push({id: 861, navn: 'Sweetdeal Haderslev'});
    }

    // Holstebro-Struer-Lemvig (id 854) - postnummer 7500,7600,7620
    if ([7500,7600,7620].indexOf(postnummer_dk) > -1 ) {
      additional_nyhedsbreve_to_be_shown.push({id: 854, navn: 'Sweetdeal Holstebro-Struer-Lemvig'});
    }

    // Kolding (id 859) - postnummer 6000
    if (postnummer_dk === 6000) {
      additional_nyhedsbreve_to_be_shown.push({id: 859, navn: 'Sweetdeal Kolding'});
    }

    // Randers (id 856) - postnummer 8900,8920,8930,8940,8960
    if ([8900,8920,8930,8940,8960].indexOf(postnummer_dk) > -1 ) {
      additional_nyhedsbreve_to_be_shown.push({id: 856, navn: 'Sweetdeal Randers'});
    }

    // Ringkøbing-Skjern (id 875)  - postnummer 6900,6950
    if (postnummer_dk === 6900 || postnummer_dk === 6950) {
      additional_nyhedsbreve_to_be_shown.push({id: 875, navn: 'Sweetdeal Ringkøbing-Skjern'});
    }

    // Skanderborg (id 849) - postnummer 8660
    if (postnummer_dk === 8660) {
      additional_nyhedsbreve_to_be_shown.push({id: 849, navn: 'Sweetdeal Skanderborg'});
    }

    // Sønderborg (id 863) - postnummer 6400
    if (postnummer_dk === 6400) {
      additional_nyhedsbreve_to_be_shown.push({id: 863, navn: 'Sweetdeal Sønderborg'});
    }

    // Tønder (id 869) - postnummer 6270
    if (postnummer_dk === 6270) {
      additional_nyhedsbreve_to_be_shown.push({id: 869, navn: 'Sweetdeal Tønder'});
    }

    // Varde (id 862) - postnummer 6800
    if (postnummer_dk === 6800) {
      additional_nyhedsbreve_to_be_shown.push({id: 862, navn: 'Sweetdeal Varde'});
    }

    // Viborg (id 851) - postnummer 8800
    if (postnummer_dk === 8800) {
      additional_nyhedsbreve_to_be_shown.push({id: 851, navn: 'Sweetdeal Viborg'});
    }

    // Vejle (id 858) - postnummer 7100,7120
    if (postnummer_dk === 7100 || postnummer_dk === 7120) {
      additional_nyhedsbreve_to_be_shown.push({id: 858, navn: 'Sweetdeal Vejle'});
    }

    if (additional_nyhedsbreve_to_be_shown.length > 0) {
      var temp = this.state.nyhedsbreve.concat(additional_nyhedsbreve_to_be_shown);
      this.setState({nyhedsbreve: temp});
    }
  },
  render: function() {
    return (
      <Newsletters className="stepNyhedsbreveKom" nyhedsbreve={this.state.nyhedsbreve} loadUserDataSuccess={this.addAdditionalNewsletters} loadUserData={this.props.loadUserData} stepBackwards={this.props.stepBackwards} stepForward={this.props.stepForward} />
    );
  }
});
