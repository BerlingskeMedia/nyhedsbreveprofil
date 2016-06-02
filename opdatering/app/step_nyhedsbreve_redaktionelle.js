var $ = require('jquery');
var React = require('react');
var NewsletterList = require('./checkbox_list');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      new_signups: [],
      new_signouts: [],
      nyhedsbreve_already: [],
      nyhedsbreve_not_yet: []
    };
  },
  componentDidMount: function() {
    ga('set', 'page', 'opdateringskampagne/step_nyhedsbreve_kommercielle');
    ga('send', 'pageview');
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

      var count = this.state.new_signups.length + this.state.new_signouts.length,
          done = 0;

      if (count === 0) {
        return callback();
      }

      var successCallback = (function(done, count, callback) {
        return function() {
          if (++done === count) {
            callback();
          }
        };
      }(done, count, callback));

      this.state.new_signups.forEach(function(id) {
        this.call_backend('POST', id)
        .success(successCallback);
      }.bind(this));

      this.state.new_signouts.forEach(function(id) {
        this.call_backend('DELETE', id)
        .success(successCallback);
      }.bind(this));

    }.bind(this);
  },
  call_backend: function(type, id) {
    return $.ajax({
      type: type,
      url: '/backend/users/'.concat(this.props.data.ekstern_id, '/nyhedsbreve/', id, '?location_id=2059'),
      dataType: 'json',
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var aok_nyhedsbreve = [
          { id: 17, navn: 'AOK', description: 'Ugen og Weekend', publisher: 3 },
          { id: 282, navn: 'AOK', description: 'Breaking', publisher: 3 }],
        berlingske_nyhedsbreve = [
          { id: 1, navn: 'Berlingske Morgen', publisher: 1 },
          { id: 2, navn: 'Berlingske Middag', publisher: 1 },
          { id: 6, navn: 'Berlingske Breaking News', publisher: 1 },
          { id: 248, navn: 'Berlingske Aften', publisher: 1 },
          { id: 3, navn: 'Berlingske Weekend', publisher: 1 }],
        bt_nyhedsbreve = [
          { id: 24, navn: 'BT Morgen', publisher: 4 },
          { id: 25, navn: 'BT Eftermiddag', publisher: 4 },
          { id: 26, navn: 'BT Breaking News', publisher: 4 },
          { id: 27, navn: 'BT Sporten', publisher: 4 }],
        business_nyhedsbreve = [
          { id: 9, navn: 'Berlingske Business Morgen', publisher: 2 },
          { id: 10, navn: 'Berlingske Business Eftermiddag', publisher: 2 },
          { id: 13, navn: 'Berlingske Business Breaking News', publisher: 2 }];

    var nyhedsbreve_to_be_shown = [].concat(berlingske_nyhedsbreve, bt_nyhedsbreve, business_nyhedsbreve);

    var postnummer = parseInt(this.props.data.postnummer);

    if ((postnummer >= 900 && postnummer <= 3699) || (postnummer >= 4000 && postnummer <= 4999)) {
      nyhedsbreve_to_be_shown = nyhedsbreve_to_be_shown.concat(aok_nyhedsbreve);
    }

    // nyhedsbreve_to_be_shown.sort(this.sortByAbonnement);

    var nyhedsbreve_not_yet = nyhedsbreve_to_be_shown.filter(function(nyhedsbrev) {
      return this.props.data.nyhedsbreve.indexOf(nyhedsbrev.id) === -1;
    }.bind(this));

    nyhedsbreve_not_yet.sort(this.sortByAbonnement);


    var nyhedsbreve_already = nyhedsbreve_to_be_shown.filter(function(nyhedsbrev) {
      return this.props.data.nyhedsbreve.indexOf(nyhedsbrev.id) > -1;
    }.bind(this));

    nyhedsbreve_already.sort(this.sortByAbonnement);

    nyhedsbreve_already.forEach(function (n) {
      n.preselect = true;
    });

    return (
      <div className="stepNyhedsbreveRed">
        <input type="button" value="Tilbage" className="btn btn-default prevButton" onClick={this.completeStep(this.props.stepBackwards)} />
        <h2>Vælg hvilke nyhedsbreve du ønsker at modtage</h2>
        <h3>Valgte</h3>
        {nyhedsbreve_already.length > 0
          ? <NewsletterList data={nyhedsbreve_already} toggle={this.toggleNyhedsbrev} />
          : <p>(Ingen)</p>
        }
        <h3>Tilføj</h3>
        {nyhedsbreve_not_yet.length > 0
          ? <NewsletterList data={nyhedsbreve_not_yet} toggle={this.toggleNyhedsbrev} />
          : <p>(Alt tilmeldt)</p>
        }
        <input type="button" className="btn btn-default nextButton pull-right" value="Næste" onClick={this.completeStep(this.props.stepForward)} />
      </div>
    );
  }
});
