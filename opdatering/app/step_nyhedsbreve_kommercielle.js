var $ = require('jquery');
var React = require('react');
var NewsletterList = require('./checkbox_list');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      ekstern_id: '',
      new_signups_businesstarget_interesser: {},
      new_signouts_businesstarget_interesser: {},
      new_signups: [],
      new_signouts: [],
      nyhedsbreve_already: [],
      nyhedsbreve_not_yet: [],
      nyhedsbreve: [],
      godttip_nyhedsbreve: [
        {
          id: 246,
          navn: 'Tilbud fra Godttip.dk',
          description: 'GodtTip.dk sender dig alle de gode tilbud først og giver ofte specielle rabatter kun til GodtTip.dk modtagere.',
          permissiontext: <GodtTipPermText />,
          publisher: 34}],
      tbt_nyhedsbreve: [
        {
          id: 844,
          navn: 'The Business Target',
          description: 'Med Berlingske Medias B2B e-mail service er du sikker på at modtage relevante tilbud samt invitationer til spændende business events.',
          permissiontext: <TheBusinessTargetPermText />,
          interestsSelection: <TheBusinessTargetInterests toggle={this.setBusinessTargetInteresserSignUps} data={this.props.data} />,
          publisher: 51}],
      shop_nyhedsbreve: [
        {
          id: 233,
          navn: 'BT Shop',
          description: 'I BT SHOP får du særtilbud på rejser, teater, events- og musikoplevelser, vin og mange andre lækre produkter.',
          publisher: 4},
        {
          id: 241,
          navn: 'Berlingske Shop',
          description: 'I Berlingske Shop får du gode tilbud på alt det, der gør livet lidt bedre.',
          publisher: 1}],
      sweetdeal_generel_nyhedsbreve: [
        {id: 845, navn: 'Sweetdeal Rejser', publisher: 32},
        {id: 855, navn: 'Sweetdeal Shopping', publisher: 32}]
    };
  },
  componentDidMount: function() {

    ga('set', 'page', 'opdateringskampagne/step_nyhedsbreve_redaktionelle');
    ga('send', 'pageview');

    var nyhedsbreve_to_be_shown = [].concat(this.state.godttip_nyhedsbreve, this.state.tbt_nyhedsbreve, this.state.shop_nyhedsbreve, this.state.sweetdeal_generel_nyhedsbreve);

    var postnummer = parseInt(this.props.data.postnummer);

    // København (id 846) - postnummer 0900-3699
    if (postnummer >= 900 && postnummer <= 3699) {
      nyhedsbreve_to_be_shown.push({id: 846, navn: 'Sweetdeal København', publisher: 32});
    }

    // Aabenraa (id 853) - postnummer 6200
    if (postnummer === 6200) {
      nyhedsbreve_to_be_shown.push({id: 853, navn: 'Sweetdeal Aabenraa', publisher: 32});
    }

    // Aarhus (id 847) - postnummer 8000-8300
    if (postnummer >= 8000 && postnummer <= 8300) {
      nyhedsbreve_to_be_shown.push({id: 847, navn: 'Sweetdeal Aarhus', publisher: 32});
    }

    // Esbjerg (id 864) - postnummer 6700,6701,6705,6710,6715
    if ([6700,6701,6705,6710,6715].indexOf(postnummer) > -1) {
      nyhedsbreve_to_be_shown.push({id: 864, navn: 'Sweetdeal Esbjerg', publisher: 32});
    }

    // Haderslev (id 861) - postnummer 6100
    if (postnummer === 6100) {
      nyhedsbreve_to_be_shown.push({id: 861, navn: 'Sweetdeal Haderslev', publisher: 32});
    }

    // Holstebro-Struer-Lemvig (id 854) - postnummer 7500,7600,7620
    if ([7500,7600,7620].indexOf(postnummer) > -1 ) {
      nyhedsbreve_to_be_shown.push({id: 854, navn: 'Sweetdeal Holstebro-Struer-Lemvig', publisher: 32});
    }

    // Kolding (id 859) - postnummer 6000
    if (postnummer === 6000) {
      nyhedsbreve_to_be_shown.push({id: 859, navn: 'Sweetdeal Kolding', publisher: 32});
    }

    // Randers (id 856) - postnummer 8900,8920,8930,8940,8960
    if ([8900,8920,8930,8940,8960].indexOf(postnummer) > -1 ) {
      nyhedsbreve_to_be_shown.push({id: 856, navn: 'Sweetdeal Randers', publisher: 32});
    }

    // Ringkøbing-Skjern (id 875)  - postnummer 6900,6950
    if (postnummer === 6900 || postnummer === 6950) {
      nyhedsbreve_to_be_shown.push({id: 875, navn: 'Sweetdeal Ringkøbing-Skjern', publisher: 32});
    }

    // Skanderborg (id 849) - postnummer 8660
    if (postnummer === 8660) {
      nyhedsbreve_to_be_shown.push({id: 849, navn: 'Sweetdeal Skanderborg', publisher: 32});
    }

    // Sønderborg (id 863) - postnummer 6400
    if (postnummer === 6400) {
      nyhedsbreve_to_be_shown.push({id: 863, navn: 'Sweetdeal Sønderborg', publisher: 32});
    }

    // Tønder (id 869) - postnummer 6270
    if (postnummer === 6270) {
      nyhedsbreve_to_be_shown.push({id: 869, navn: 'Sweetdeal Tønder', publisher: 32});
    }

    // Varde (id 862) - postnummer 6800
    if (postnummer === 6800) {
      nyhedsbreve_to_be_shown.push({id: 862, navn: 'Sweetdeal Varde', publisher: 32});
    }

    // Viborg (id 851) - postnummer 8800
    if (postnummer === 8800) {
      nyhedsbreve_to_be_shown.push({id: 851, navn: 'Sweetdeal Viborg', publisher: 32});
    }

    // Vejle (id 858) - postnummer 7100,7120
    if (postnummer === 7100 || postnummer === 7120) {
      nyhedsbreve_to_be_shown.push({id: 858, navn: 'Sweetdeal Vejle', publisher: 32});
    }

    nyhedsbreve_to_be_shown.sort(this.sortByAbonnement);
    this.setState({nyhedsbreve: nyhedsbreve_to_be_shown});

    this.setState({ekstern_id: this.props.data.ekstern_id});
    var user_nyhedsbreve = this.props.data.nyhedsbreve;

    var nyhedsbreve_not_yet = nyhedsbreve_to_be_shown.filter(function(nyhedsbrev) {
      return user_nyhedsbreve.indexOf(nyhedsbrev.id) === -1;
    }.bind(this));

    nyhedsbreve_not_yet.sort(this.sortByAbonnement);

    this.setState({nyhedsbreve_not_yet: nyhedsbreve_not_yet});

    var nyhedsbreve_already = nyhedsbreve_to_be_shown.filter(function(nyhedsbrev) {
      return user_nyhedsbreve.indexOf(nyhedsbrev.id) > -1;
    }.bind(this));

    nyhedsbreve_already.sort(this.sortByAbonnement);

    nyhedsbreve_already.forEach(function (n) {
      n.preselect = true;
    });

    this.setState({nyhedsbreve_already: nyhedsbreve_already});
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
        return publisherOrder([4,1,32,34,51]);
        break;
      default:
        return publisherOrder([1,4,32,34,51]);
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
  setBusinessTargetInteresserSignUps: function(new_signups_businesstarget_interesser, new_signouts_businesstarget_interesser) {
    this.setState({
      new_signups_businesstarget_interesser: new_signups_businesstarget_interesser,
      new_signouts_businesstarget_interesser: new_signouts_businesstarget_interesser
    });
  },
  completeStep: function(callback) {
    return function() {
      var ekstern_id = this.state.ekstern_id;

      var new_business_signups = Object.keys(this.state.new_signups_businesstarget_interesser).map(function(key) {
        return this.state.new_signups_businesstarget_interesser[key];
      }.bind(this));

      var new_business_signouts = Object.keys(this.state.new_signouts_businesstarget_interesser).map(function(key) {
        return this.state.new_signouts_businesstarget_interesser[key];
      }.bind(this));

      var count = this.state.new_signups.length + this.state.new_signouts.length + new_business_signups.length + new_business_signouts.length,
          done = 0;

      if (count === 0) {
        return callback();
      }

      this.state.new_signups.forEach(add_nyhedsbrev);
      this.state.new_signouts.forEach(delete_nyhedsbrev);
      new_business_signups.forEach(add_interesse);
      new_business_signouts.forEach(delete_interesse);


      function add_nyhedsbrev (id) {
        call_backend('POST', 'nyhedsbreve', id);
      }

      function delete_nyhedsbrev (id) {
        call_backend('DELETE', 'nyhedsbreve', id);
      }

      function add_interesse (id) {
        call_backend('POST', 'interesser', id);
      }

      function delete_interesse (id) {
        call_backend('DELETE', 'interesser', id);
      }

      function call_backend (type, domain, id) {
        $.ajax({
          type: type,
          url: '/backend/users/'.concat(ekstern_id, '/', domain, '/', id, '?location_id=2059'),
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
      <div className="stepNyhedsbreveKom">
        <input type="button" value="Tilbage" onClick={this.completeStep(this.props.stepBackwards)} />
        <h2>Vælg hvilke kommercielle nyhedsbreve du vil modtage</h2>
        <h3>Valgte</h3>
        <NewsletterList data={this.state.nyhedsbreve_already} toggle={this.toggleNyhedsbrev} />
        <h3>Tilføj</h3>
        <NewsletterList data={this.state.nyhedsbreve_not_yet} toggle={this.toggleNyhedsbrev} />
        <input type="button" value="Næste" className="nextButton" onClick={this.completeStep(this.props.stepForward)} />
      </div>
    );
  }
});

var GodtTipPermText = React.createClass({
  render: function() {
    return(
      <div>GodtTip.dk og Berlingske Media-koncernen (<a href="http://www.berlingskemedia.dk/berlingske-medias-selskaber-og-forretningsenheder">se udgivelser og forretningsenheder her</a>) må gerne gøre mig opmærksom på nyheder, tilbud og konkurrencer via brev og elektroniske medier (herunder e-mail, sms, mms, videobeskeder og pop-ups), når Berlingske Media-koncernen og vores samarbejdspartnere (<a href="http://www.berlingskemedia.dk/berlingske-medias-samarbejdspartnere/">se samarbejdspartnere her</a>) har nyheder, tilbud og konkurrencer inden for forskellige interesseområder (<a href="http://www.berlingskemedia.dk/liste-over-interesseomraader/">se hvilke her</a>).</div>
    );
  }
});

var TheBusinessTargetPermText = React.createClass({
  render: function() {
    return(
      <div>The Business Target og Berlingske Media-koncernen (<a href="http://www.berlingskemedia.dk/berlingske-medias-selskaber-og-forretningsenheder/">se udgivelser og forretningsenheder her</a>) må gerne gøre mig opmærksom på nyheder, tilbud og konkurrencer via brev og elektroniske medier (herunder e-mail, sms, mms, videobeskeder og pop-ups), når Berlingske Media-koncernen og vores samarbejdspartnere (<a href="http://www.berlingskemedia.dk/berlingske-medias-samarbejdspartnere/">se samarbejdspartnere her</a>) har nyheder, tilbud og konkurrencer inden for forskellige interesseområder (<a href="http://www.berlingskemedia.dk/liste-over-interesseomraader/">se hvilke her</a>).</div>
    );
  }
});

var BusinessInterestList = require('./select_list');

var TheBusinessTargetInterests = React.createClass({
  getInitialState: function() {
    return {
      new_signups: {},
      new_signouts: {},
      existing_signups: {},
      thebusinesstargetInterests: [
        {id: 310, navn: 'Branche', initialValue: '', options: []},
        {id: 343, navn: 'Stillingsbetegnelse', initialValue: '', options: []},
      ]
    }
  },
  componentDidMount: function() {
    this.loadingThebusinesstargetInterests = $.ajax({
      url: '/backend/interesser/full?displayTypeId=6',
      dataType: 'json',
      cache: true,
      success: [
        this.createSelectOptions,
        this.mapExistingUserSignups
      ],
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentWillUnmount: function() {
    this.loadingThebusinesstargetInterests.abort();
  },
  createSelectOptions: function(data) {

    var user = this.props.data;
    var temp = this.state.thebusinesstargetInterests;

    temp.forEach(function (thebusinesstargetInterest) {

      var parent_interesse = data.find(function (y) {
        return y.interesse_id === thebusinesstargetInterest.id;
      });

      if (parent_interesse) {
        thebusinesstargetInterest.initialValue = findInitialValue(parent_interesse);
        thebusinesstargetInterest.options = parent_interesse.subinterests.sort(sortByName).map(function(subinterest) {
          return {
            value: subinterest.interesse_id,
            label: subinterest.interesse_navn
          };
        });
      }
    });

    this.setState({thebusinesstargetInterests: temp});

    function findInitialValue (parent_interesse) {
      var selected = parent_interesse.subinterests.find(function (subinterest) {
        return user.interesser.indexOf(subinterest.interesse_id) > -1;
      }.bind(this));

      if (selected) {
        return selected.interesse_id;
      } else {
        return null;
      }
    }

    function sortByName(subinterest_a, subinterest_b) {
      var a = subinterest_a.interesse_navn.toUpperCase(),
          b = subinterest_b.interesse_navn.toUpperCase();

      var c =
        a < b ? -1 :
        a > b ? 1 :
        0;

      return c;
    }
  },
  mapExistingUserSignups: function(data) {
    var existing_signups = {};

    var user_interesser = this.props.data.interesser;

    user_interesser.forEach(function(user_interesse_id) {
      data.forEach(function(thebusinesstargetInterest) {
          if (user_interesse_id === thebusinesstargetInterest.interesse_id) {

            existing_signups[thebusinesstargetInterest.interesse_id] = user_interesse_id;

          } else {

            var a = thebusinesstargetInterest.subinterests.find(function(subinterest) {
              return subinterest.interesse_id === user_interesse_id;
            });

            if (a) {
              existing_signups[thebusinesstargetInterest.interesse_id] = a.interesse_id;
            }
          }
      });
    });

    this.setState({existing_signups: existing_signups});
  },
  toggleInteresseBusinessTarget: function(interesse_id_str, parent_id) {
    var interesse_id = parseInt(interesse_id_str);
    var new_signups = this.state.new_signups,
        new_signouts = this.state.new_signouts,
        existing_signups = this.state.existing_signups;

    if (existing_signups[parent_id] !== undefined && existing_signups[parent_id] !== interesse_id) {
      new_signouts[parent_id] = existing_signups[parent_id];
    }

    // In case the user switches back to the existing interest
    if (existing_signups[parent_id] === interesse_id) {
      delete new_signups[parent_id];
      delete new_signouts[parent_id];
    } else {
      new_signups[parent_id] = interesse_id;
    }

    this.setState({new_signups: new_signups, new_signouts: new_signouts}, function() {
      this.props.toggle(new_signups, new_signouts);
    }.bind(this));
  },
  render: function() {
    return(
      <BusinessInterestList data={this.state.thebusinesstargetInterests} toggle={this.toggleInteresseBusinessTarget} />
    );
  }
});
