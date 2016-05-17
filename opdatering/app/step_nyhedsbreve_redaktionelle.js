var $ = require('jquery');
var React = require('react');
var Newsletters = require('./nyhedsbreve');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      nyhedsbreve: [],
      aok_nyhedsbreve: [
        { id: 17, navn: 'AOK', description: 'Ugen og Weekend', publisher: 3 }],
      berlingske_nyhedsbreve: [
        { id: 1, navn: 'Berlingske Morgen', publisher: 1 },
        { id: 2, navn: 'Berlingske Middag', publisher: 1 },
        { id: 6, navn: 'Berlingske Breaking News', publisher: 1 },
        { id: 248, navn: 'Berlingske Aften', publisher: 1 },
        { id: 3, navn: 'Berlingske Weekend', publisher: 1 }],
      bt_nyhedsbreve: [
        { id: 24, navn: 'BT Morgen', publisher: 4 },
        { id: 25, navn: 'BT Eftermiddag', publisher: 4 },
        { id: 26, navn: 'BT Breaking News', publisher: 4 },
        { id: 27, navn: 'BT Sporten', publisher: 4 }],
      business_nyhedsbreve: [
        { id: 9, navn: 'Berlingske Business Morgen', publisher: 2 },
        { id: 10, navn: 'Berlingske Business Eftermiddag', publisher: 2 },
        { id: 13, navn: 'Berlingske Business Breaking News', publisher: 2 }]
      };
  },
  componentDidMount: function() {

    ga('set', 'page', 'opdateringskampagne/step_nyhedsbreve_kommercielle');
    ga('send', 'pageview');

    var nyhedsbreve_to_be_shown = [].concat(this.state.berlingske_nyhedsbreve, this.state.bt_nyhedsbreve, this.state.business_nyhedsbreve);
    nyhedsbreve_to_be_shown.sort(this.sortByAbonnement);
    this.setState({nyhedsbreve: nyhedsbreve_to_be_shown});
  },
  addAdditionalNewsletters: function (user) {
    var postnummer_dk = user.postnummer_dk,
        additional_nyhedsbreve_to_be_shown = [];

    if ((postnummer_dk >= 900 && postnummer_dk <= 3699) || (postnummer_dk >= 4000 && postnummer_dk <= 4999)) {
      additional_nyhedsbreve_to_be_shown = this.state.nyhedsbreve.concat(this.state.aok_nyhedsbreve);
      additional_nyhedsbreve_to_be_shown.sort(this.sortByAbonnement);
      this.setState({nyhedsbreve: additional_nyhedsbreve_to_be_shown});
    }
  },
  sortByAbonnement: function (nyhedsbrev_a, nyhedsbrev_b) {
    if (nyhedsbrev_a.publisher === nyhedsbrev_b.publisher) {
        return 0;
    }

    function publisherOrder(sort_order) {
      var r = 0;
      for (var i = 0; i < sort_order.length && r === 0; i++) {
        var publisher_id = sort_order[i];
        if (nyhedsbrev_a.publisher === publisher_id) {
          r = -1;
        } else if (nyhedsbrev_b.publisher === publisher_id) {
          r = 1;
        }
      }
      return r;
    }

    switch (this.props.abo) {
      case 'BT':
        return publisherOrder([4]);
        break;
      default:
        return publisherOrder([1,2,4,3]);
        break;
    }
  },
  completeStep: function () {
    console.log('this.props.children', this.props.children);
  },
  render: function() {
    return (
      <div className="stepNyhedsbreveRed">
        <Newsletters nyhedsbreve={this.state.nyhedsbreve} loadUserDataSuccess={this.addAdditionalNewsletters} loadUserData={this.props.loadUserData} stepBackwards={this.props.stepBackwards} stepForward={this.props.stepForward} />
      </div>
    );
  }
});
