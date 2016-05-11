var $ = require('jquery');
var React = require('react');
var Newsletters = require('./nyhedsbreve');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      // ekstern_id: '',
      // nyhedsbreve_already: [],
      // nyhedsbreve_not_yet: [],
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

    // this.setState({nyhedsbreve: nyhedsbreve_to_be_shown});
    //
    // var nyhedsbreve_not_yet = this.state.nyhedsbreve.filter(function(nyhedsbrev) {
    //   return user_nyhedsbreve.indexOf(nyhedsbrev.nyhedsbrev_id) === -1;
    // }.bind(this));
    //
    // nyhedsbreve_not_yet.sort(this.sort_nyhedsbreve);
    //
    // var nyhedsbreve_already = this.state.nyhedsbreve.filter(function(nyhedsbrev) {
    //   return user_nyhedsbreve.indexOf(nyhedsbrev.nyhedsbrev_id) > -1;
    // }.bind(this));
    //
    // nyhedsbreve_already.forEach(function (n) {
    //   n.preselect = true;
    // });
    // nyhedsbreve_already.sort(this.sort_nyhedsbreve);
    //
    // this.setState({nyhedsbreve_not_yet: nyhedsbreve_not_yet});
    // this.setState({nyhedsbreve_already: nyhedsbreve_already});
  },
  // componentDidMount: function() {
  //   this.loadingUserData = this.props.loadUserData().success(function (data) {
  //
  //     this.setState({ekstern_id: data.ekstern_id});
  //     var user_nyhedsbreve = data.nyhedsbreve;
  //
  //     var nyhedsbreve_to_be_shown = [].concat(this.state.berlingske_nyhedsbreve, this.state.bt_nyhedsbreve, this.state.business_nyhedsbreve);
  //
  //     var postnummer_dk = data.postnummer_dk;
  //     if ((postnummer_dk >= 900 && postnummer_dk <= 3699) || (postnummer_dk >= 4000 && postnummer_dk <= 4999)) {
  //       nyhedsbreve_to_be_shown = nyhedsbreve_to_be_shown.concat(this.state.aok_nyhedsbreve);
  //     }
  //
  //     this.setState({nyhedsbreve: nyhedsbreve_to_be_shown});
  //
  //     var nyhedsbreve_not_yet = this.state.nyhedsbreve.filter(function(nyhedsbrev) {
  //       return user_nyhedsbreve.indexOf(nyhedsbrev.nyhedsbrev_id) === -1;
  //     }.bind(this));
  //
  //     nyhedsbreve_not_yet.sort(this.sort_nyhedsbreve);
  //
  //     var nyhedsbreve_already = this.state.nyhedsbreve.filter(function(nyhedsbrev) {
  //       return user_nyhedsbreve.indexOf(nyhedsbrev.nyhedsbrev_id) > -1;
  //     }.bind(this));
  //
  //     nyhedsbreve_already.forEach(function (n) {
  //       n.preselect = true;
  //     });
  //     nyhedsbreve_already.sort(this.sort_nyhedsbreve);
  //
  //     this.setState({nyhedsbreve_not_yet: nyhedsbreve_not_yet});
  //     this.setState({nyhedsbreve_already: nyhedsbreve_already});
  //
  //   }.bind(this));
  // },
  // componentWillUnmount: function() {
  //   this.loadingUserData.abort();
  // },
  render: function() {
    return (
      <Newsletters className="stepNyhedsbreveRed" nyhedsbreve={this.state.nyhedsbreve} loadUserDataSuccess={this.addAdditionalNewsletters} loadUserData={this.props.loadUserData} stepBackwards={this.props.stepBackwards} stepComplete={this.props.stepComplete} />
      // <div >
      //   <div>Vælg</div>
      //   <NewsletterList ekstern_id={this.state.ekstern_id} nyhedsbreve={this.state.nyhedsbreve_not_yet} />
      //   <div>Allerede tilmeldte</div>
      //   <NewsletterList ekstern_id={this.state.ekstern_id} nyhedsbreve={this.state.nyhedsbreve_already} />
      //   <input type="button" value="Tilbage" onClick={this.complete(this.props.stepBackwards)} />
      //   <input type="button" value="Videre" onClick={this.complete(this.props.stepComplete)} />
      // </div>
    );
  }
});
