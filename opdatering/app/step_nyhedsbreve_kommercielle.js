var $ = require('jquery');
var React = require('react');
var NewsletterList = require('./nyhedsbreve');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      user: {},
      nyhedsbreve: [],
      godttip_nyhedsbreve: [246],
      tbt_nyhedsbreve: [844],
      shop_nyhedsbreve: [233, 241],
      sweetdeal_generel_nyhedsbreve: [821, 833],
      sweetdeal_aarhus_nyhedsbreve: []};
  },
  componentDidMount: function() {
    this.props.loadUserData().success(function (data) {
      this.setState({user: data});
      this.loadNewsletters().success(function(data) {
        var nyhedsbreve_id_to_be_shown = [].concat(this.state.godttip_nyhedsbreve, this.state.tbt_nyhedsbreve, this.state.shop_nyhedsbreve, this.state.sweetdeal_generel_nyhedsbreve);

        var nyhedsbreve = data.filter(function(nyhedsbrev) {
          return nyhedsbreve_id_to_be_shown.indexOf(nyhedsbrev.nyhedsbrev_id) > -1;
        });

        this.setState({nyhedsbreve: nyhedsbreve});

        this.loadNewsletters(false).success(function(data) {
          var local_sweetdeal_newsletter_ids = [];
          var postnummer_dk = this.state.user.postnummer_dk;

          if ((postnummer_dk >= 900 && postnummer_dk <= 3699) || (postnummer_dk >= 4000 && postnummer_dk <= 4999)) {
            local_sweetdeal_newsletter_ids = local_sweetdeal_newsletter_ids.concat(this.state.sweetdeal_aarhus_nyhedsbreve);
          }

          var sweetdeal_nyhedsbreve = data.filter(function(nyhedsbrev) {
            return local_sweetdeal_newsletter_ids.indexOf(nyhedsbrev.nyhedsbrev_id) > -1;
          });

          nyhedsbreve.concat(sweetdeal_nyhedsbreve);

          this.setState({nyhedsbreve: nyhedsbreve});

        }.bind(this))
      }.bind(this));
    }.bind(this));
  },
  loadNewsletters: function(enabled) {
    return $.ajax({
      url: '/backend/nyhedsbreve?permission=0'.concat(enabled === undefined ? '' : '&enabled='.concat(enabled ? '1' : '0')),
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
