var $ = require('jquery');
var React = require('react');
var NewsletterList = require('./checkbox_list');
var TheBusinessTargetInterests = require('./the_business_target_interests');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      new_signups_businesstarget_interesser: {},
      new_signouts_businesstarget_interesser: {},
      business_target_interests_completed: false,
      business_target_interests_error: false,
      new_signups: [],
      new_signouts: [],
      nyhedsbreve_already: [],
      nyhedsbreve_not_yet: [],
      show_sweetdeal: false
    };
  },
  componentDidMount: function() {

    if (window.location.host.indexOf('profil.berlingskemedia.dk') > -1) {
      ga('set', 'page', 'opdateringskampagne/step_nyhedsbreve_kommercielle');
      ga('send', 'pageview');
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
  setBusinessTargetIntestSelectionCompleted: function (completed) {
    this.setState({business_target_interests_completed: true});
  },
  hasBusinessTargetNewsletter: function(nyhedsbrev_id) {
    // var tbt_ids = this.state.tbt_nyhedsbreve.map(function(n) {
    //   return n.id;
    // });
    // return tbt_ids.indexOf(nyhedsbrev_id) > -1;
    return nyhedsbrev_id === 844;
  },
  completeStepFunc: function(callback) {

    // If the user has signed up for The Business Target, or already subscribed and not signed out.
    if (this.state.new_signups.some(this.hasBusinessTargetNewsletter) || (this.props.data.nyhedsbreve.some(this.hasBusinessTargetNewsletter) && !this.state.new_signouts.some(this.hasBusinessTargetNewsletter))) {
      // Now we need to check if theres interests in both controls
      if (!this.state.business_target_interests_completed) {
        this.setState({business_target_interests_error: true});
        callback('Business Target interests missing.');
        return;
      }
    }

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

    var successCallback = (function(done, count, callback) {
      return function() {
        if (++done === count) {
          callback();
        }
      };
    }(done, count, callback));

    this.state.new_signups.forEach(function(id) {
      this.call_backend('POST', 'nyhedsbreve', id)
      .done(successCallback);
    }.bind(this));

    this.state.new_signouts.forEach(function(id) {
      this.call_backend('DELETE', 'nyhedsbreve', id)
      .done(successCallback);
    }.bind(this));

    new_business_signups.forEach(function(id) {
      this.call_backend('POST', 'interesser', id)
      .done(successCallback);
    }.bind(this));

    new_business_signouts.forEach(function(id) {
      this.call_backend('DELETE', 'interesser', id)
      .done(successCallback);
    }.bind(this));
  },
  call_backend: function(type, domain, id) {
    return $.ajax({
      type: type,
      url: '/backend/users/'.concat(this.props.data.ekstern_id, '/', domain, '/', id, '?location_id=2635'),
      dataType: 'json',
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var sweetdeal_logo_src = 'https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/Sweetdeal.png';
    var godttip_nyhedsbreve = [
          {
            id: 246,
            navn: 'Tilbud fra Godttip',
            description: 'GodtTip er en personlig e-mail, hvor du modtager tilbud og gode råd vedrørende netop dine interesseområder. Dertil får du ofte specielle GodtTip rabatter.',
            permissiontext: <GodtTipPermText />,
            logo_src: 'https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/630x100_GodtTip_header_Navy.jpg',
            publisher: 34}],
        tbt_nyhedsbreve = [
          {
            id: 844,
            navn: 'The Business Target',
            description: 'Med Berlingske Medias B2B e-mail service er du sikker på at modtage relevante tilbud samt invitationer til spændende business events.',
            permissiontext: <TheBusinessTargetPermText />,
            interestsSelection: <TheBusinessTargetInterests toggle={this.setBusinessTargetInteresserSignUps} data={this.props.data} completed={this.setBusinessTargetIntestSelectionCompleted} hasError={this.state.business_target_interests_error} />,
            logo_src: 'https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/TBT.png',
            publisher: 51}],
        shop_nyhedsbreve = [
          {
            id: 233,
            navn: 'BT Shop',
            description: 'I BT SHOP får du særtilbud på rejser, teater, events- og musikoplevelser, vin og mange andre lækre produkter.',
            logo_src: 'https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/BT_shop.png',
            publisher: 4},
          {
            id: 241,
            navn: 'Berlingske Shop',
            description: 'I Berlingske Shop får du gode tilbud på alt det, der gør livet lidt bedre.',
            logo_src: 'https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/berlingske_shop.png',
            logo_style: { padding: '10px 4px 4px 4px', backgroundColor: 'white'},
            publisher: 1}],
        sweetdeal_generel_nyhedsbreve = [
          {id: 845, navn: 'Sweetdeal Rejser', description: 'Sweetdeal Rejser', publisher: 32, logo_src: sweetdeal_logo_src},
          {id: 855, navn: 'Sweetdeal Shopping', description: 'Sweetdeal Shopping', publisher: 32, logo_src: sweetdeal_logo_src}];


    var nyhedsbreve = [].concat(godttip_nyhedsbreve, tbt_nyhedsbreve, shop_nyhedsbreve);

    if (this.state.show_sweetdeal === true) {

      nyhedsbreve = nyhedsbreve.concat(sweetdeal_generel_nyhedsbreve);

      var postnummer = parseInt(this.props.data.postnummer);

      // København (id 846) - postnummer 0900-3699
      if (postnummer >= 900 && postnummer <= 3699) {
        nyhedsbreve.push({id: 846, navn: 'Sweetdeal København', description: 'Sweetdeal København', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Aabenraa (id 853) - postnummer 6200
      if (postnummer === 6200) {
        nyhedsbreve.push({id: 853, navn: 'Sweetdeal Aabenraa', description: 'Sweetdeal Aabenraa', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Aarhus (id 847) - postnummer 8000-8300
      if (postnummer >= 8000 && postnummer <= 8300) {
        nyhedsbreve.push({id: 847, navn: 'Sweetdeal Aarhus', description: 'Sweetdeal Aarhus', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Esbjerg (id 864) - postnummer 6700,6701,6705,6710,6715
      if ([6700,6701,6705,6710,6715].indexOf(postnummer) > -1) {
        nyhedsbreve.push({id: 864, navn: 'Sweetdeal Esbjerg', description: 'Sweetdeal Esbjerg', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Haderslev (id 861) - postnummer 6100
      if (postnummer === 6100) {
        nyhedsbreve.push({id: 861, navn: 'Sweetdeal Haderslev', description: 'Sweetdeal Haderslev', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Holstebro-Struer-Lemvig (id 854) - postnummer 7500,7600,7620
      if ([7500,7600,7620].indexOf(postnummer) > -1 ) {
        nyhedsbreve.push({id: 854, navn: 'Sweetdeal Holstebro-Struer-Lemvig', description: 'Sweetdeal Holstebro-Struer-Lemvig', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Kolding (id 859) - postnummer 6000
      if (postnummer === 6000) {
        nyhedsbreve.push({id: 859, navn: 'Sweetdeal Kolding', description: 'Sweetdeal Kolding', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Randers (id 856) - postnummer 8900,8920,8930,8940,8960
      if ([8900,8920,8930,8940,8960].indexOf(postnummer) > -1 ) {
        nyhedsbreve.push({id: 856, navn: 'Sweetdeal Randers', description: 'Sweetdeal Randers', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Ringkøbing-Skjern (id 875)  - postnummer 6900,6950
      if (postnummer === 6900 || postnummer === 6950) {
        nyhedsbreve.push({id: 875, navn: 'Sweetdeal Ringkøbing-Skjern', description: 'Sweetdeal Ringkøbing-Skjern', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Skanderborg (id 849) - postnummer 8660
      if (postnummer === 8660) {
        nyhedsbreve.push({id: 849, navn: 'Sweetdeal Skanderborg', description: 'Sweetdeal Skanderborg', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Sønderborg (id 863) - postnummer 6400
      if (postnummer === 6400) {
        nyhedsbreve.push({id: 863, navn: 'Sweetdeal Sønderborg', description: 'Sweetdeal Sønderborg', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Tønder (id 869) - postnummer 6270
      if (postnummer === 6270) {
        nyhedsbreve.push({id: 869, navn: 'Sweetdeal Tønder', description: 'Sweetdeal Tønder', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Varde (id 862) - postnummer 6800
      if (postnummer === 6800) {
        nyhedsbreve.push({id: 862, navn: 'Sweetdeal Varde', description: 'Sweetdeal Varde', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Viborg (id 851) - postnummer 8800
      if (postnummer === 8800) {
        nyhedsbreve.push({id: 851, navn: 'Sweetdeal Viborg', description: 'Sweetdeal Viborg', publisher: 32, logo_src: sweetdeal_logo_src});
      }

      // Vejle (id 858) - postnummer 7100,7120
      if (postnummer === 7100 || postnummer === 7120) {
        nyhedsbreve.push({id: 858, navn: 'Sweetdeal Vejle', description: 'Sweetdeal Vejle', publisher: 32, logo_src: sweetdeal_logo_src});
      }

    }

    var nyhedsbreve_not_yet = nyhedsbreve.filter(function(nyhedsbrev) {
      return this.props.data.nyhedsbreve.indexOf(nyhedsbrev.id) === -1;
    }.bind(this));

    nyhedsbreve_not_yet.sort(this.sortByAbonnement);

    var nyhedsbreve_already = nyhedsbreve.filter(function(nyhedsbrev) {
      return this.props.data.nyhedsbreve.indexOf(nyhedsbrev.id) > -1;
    }.bind(this));

    nyhedsbreve_already.sort(this.sortByAbonnement);

    nyhedsbreve_already.forEach(function (n) {
      n.preselect = true;
    });

    return (
      <div className="stepNyhedsbreveKom">
        <h3 className="stepheader">Vælg hvilke øvrige nyhedsbreve du ønsker at modtage</h3>
        <h4 className="selectionheader">Valgte</h4>
        {nyhedsbreve_already.length > 0
          ? <NewsletterList data={nyhedsbreve_already} toggle={this.toggleNyhedsbrev} />
          : <p>(Ingen)</p>
        }
        <h4 className="selectionheader">Tilføj</h4>
        {nyhedsbreve_not_yet.length > 0
          ? <NewsletterList data={nyhedsbreve_not_yet} toggle={this.toggleNyhedsbrev} />
          : <p>(Alt tilmeldt)</p>
        }
      </div>
    );
  }
});


var GodtTipPermText = React.createClass({
  render: function() {
    return(
      <div>GodtTip og Berlingske Media-koncernen (<a href="http://www.berlingskemedia.dk/berlingske-medias-selskaber-og-forretningsenheder" target="_blank">se udgivelser og forretningsenheder her</a>) må gerne gøre mig opmærksom på nyheder, tilbud og konkurrencer via brev og elektroniske medier (herunder e-mail, sms, mms, videobeskeder og pop-ups), når Berlingske Media-koncernen og vores samarbejdspartnere (<a href="http://www.berlingskemedia.dk/berlingske-medias-samarbejdspartnere/" target="_blank">se samarbejdspartnere her</a>) har nyheder, tilbud og konkurrencer inden for forskellige interesseområder (<a href="http://www.berlingskemedia.dk/liste-over-interesseomraader/" target="_blank">se hvilke her</a>).</div>
    );
  }
});


var TheBusinessTargetPermText = React.createClass({
  render: function() {
    return(
      <div>The Business Target og Berlingske Media-koncernen (<a href="http://www.berlingskemedia.dk/berlingske-medias-selskaber-og-forretningsenheder/" target="_blank">se udgivelser og forretningsenheder her</a>) må gerne gøre mig opmærksom på nyheder, tilbud og konkurrencer via brev og elektroniske medier (herunder e-mail, sms, mms, videobeskeder og pop-ups), når Berlingske Media-koncernen og vores samarbejdspartnere (<a href="http://www.berlingskemedia.dk/berlingske-medias-samarbejdspartnere/" target="_blank">se samarbejdspartnere her</a>) har nyheder, tilbud og konkurrencer inden for forskellige interesseområder (<a href="http://www.berlingskemedia.dk/liste-over-interesseomraader/" target="_blank">se hvilke her</a>).</div>
    );
  }
});
