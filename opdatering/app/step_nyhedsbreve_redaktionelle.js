var $ = require('jquery');
var React = require('react');
var NewsletterList = require('./checkbox_list');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      ekstern_id: '',
      new_signups: [],
      new_signouts: [],
      nyhedsbreve_already: [],
      nyhedsbreve_not_yet: [],
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

    this.setState({ekstern_id: this.props.data.ekstern_id});
    var user_nyhedsbreve = this.props.data.nyhedsbreve;

    var nyhedsbreve_not_yet = nyhedsbreve_to_be_shown.filter(function(nyhedsbrev) {
      return user_nyhedsbreve.indexOf(nyhedsbrev.id) === -1;
    }.bind(this));

    this.setState({nyhedsbreve_not_yet: nyhedsbreve_not_yet});

    var nyhedsbreve_already = nyhedsbreve_to_be_shown.filter(function(nyhedsbrev) {
      return user_nyhedsbreve.indexOf(nyhedsbrev.id) > -1;
    }.bind(this));

    nyhedsbreve_already.forEach(function (n) {
      n.preselect = true;
    });

    this.setState({nyhedsbreve_already: nyhedsbreve_already});

    this.addAdditionalNewsletters(this.props.data);
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
  toggleNyhedsbrev: function (subscribe, nyhedsbrev) {
    var new_signups = this.state.new_signups;
    var new_signouts = this.state.new_signouts;

    if (subscribe) {
      var i = new_signouts.indexOf(nyhedsbrev.id);
      if (i > -1) {
        new_signouts.splice(i, 1);
      } else {
        new_signups.push(nyhedsbrev.id);
      }
    } else {
      var i = new_signups.indexOf(nyhedsbrev.id);
      if (i > -1) {
        new_signups.splice(i, 1);
      } else {
        new_signouts.push(nyhedsbrev.id);
      }
    }
    this.setState({new_signups: new_signups});
    this.setState({new_signouts: new_signouts});
  },
  completeStep: function(callback) {
    return function() {
      var ekstern_id = this.state.ekstern_id;

      var count = this.state.new_signups.length + this.state.new_signouts.length,
          done = 0;

      if (count === 0) {
        return callback();
      }

      this.state.new_signups.forEach(add_nyhedsbrev);
      this.state.new_signouts.forEach(delete_nyhedsbrev);

      function add_nyhedsbrev (nyhedsbrev_id) {
        call_backend('POST', nyhedsbrev_id);
      }

      function delete_nyhedsbrev (nyhedsbrev_id) {
        call_backend('DELETE', nyhedsbrev_id);
      }

      function call_backend (type, nyhedsbrev_id) {
        $.ajax({
          type: type,
          url: '/backend/users/'.concat(ekstern_id, '/nyhedsbreve/', nyhedsbrev_id, '?location_id=2059'),
          dataType: 'json',
          success: function (data) {
            if (++done === count) {
              callback();
            }
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(status, err.toString());
          }.bind(this)
        });
      }

    }.bind(this);
  },
  render: function() {
    return (
      <div className="stepNyhedsbreveRed">
        <h2>Dine tilmeldinger</h2>
        <NewsletterList data={this.state.nyhedsbreve_already} toggle={this.toggleNyhedsbrev} />
        <h2>Tilmeld dig</h2>
        <NewsletterList data={this.state.nyhedsbreve_not_yet} toggle={this.toggleNyhedsbrev} />
        <input type="button" value="Tilbage" onClick={this.completeStep(this.props.stepBackwards)} />
        <input type="button" value="Videre" onClick={this.completeStep(this.props.stepForward)} />
      </div>
    );
  }
});
