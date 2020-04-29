const $ = require('jquery');
const React = require('react');
const NewsletterList = require('./checkbox_list');
const TheBusinessTargetInterests = require('./the_business_target_interests');

module.exports = class extends React.Component {

  constructor(props) {
    super(props);
    this.sortByAbonnement = this.sortByAbonnement.bind(this);
    this.toggleNyhedsbrev = this.toggleNyhedsbrev.bind(this);
    this.setBusinessTargetInteresserSignUps = this.setBusinessTargetInteresserSignUps.bind(this);
    this.setBusinessTargetIntestSelectionCompleted = this.setBusinessTargetIntestSelectionCompleted.bind(this);
    this.completeStepFunc = this.completeStepFunc.bind(this);
    this.call_backend = this.call_backend.bind(this);
    this.state = {
      new_signups_businesstarget_interesser: {},
      new_signouts_businesstarget_interesser: {},
      business_target_interests_completed: false,
      business_target_interests_error: false,
      new_signups: [],
      new_signouts: [],
      nyhedsbreve_already: [],
      nyhedsbreve_not_yet: []
    };
  }

  componentDidMount() {

    if (window.location.host.indexOf('profil.berlingskemedia.dk') > -1) {
      ga('set', 'page', 'opdateringskampagne/step_nyhedsbreve_kommercielle');
      ga('send', 'pageview');
    }

  }

  sortByAbonnement(nyhedsbrev_a, nyhedsbrev_b) {
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
  }

  toggleNyhedsbrev(subscribe, nyhedsbrev) {
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
  }

  setBusinessTargetInteresserSignUps(new_signups_businesstarget_interesser, new_signouts_businesstarget_interesser) {
    this.setState({
      new_signups_businesstarget_interesser: new_signups_businesstarget_interesser,
      new_signouts_businesstarget_interesser: new_signouts_businesstarget_interesser
    });
  }

  setBusinessTargetIntestSelectionCompleted(completed) {
    this.setState({business_target_interests_completed: true});
  }

  hasBusinessTargetNewsletter(nyhedsbrev_id) {
    // var tbt_ids = this.state.tbt_nyhedsbreve.map(function(n) {
    //   return n.id;
    // });
    // return tbt_ids.indexOf(nyhedsbrev_id) > -1;
    return nyhedsbrev_id === 844;
  }

  completeStepFunc() {

    var dfd = $.Deferred();

    // If the user has signed up for The Business Target, or already subscribed and not signed out.
    if (this.state.new_signups.some(this.hasBusinessTargetNewsletter) || (this.props.data.nyhedsbreve.some(this.hasBusinessTargetNewsletter) && !this.state.new_signouts.some(this.hasBusinessTargetNewsletter))) {
      // Now we need to check if theres interests in both controls
      if (!this.state.business_target_interests_completed) {
        this.setState({business_target_interests_error: true});
        dfd.reject(new Error('Business Target interests missing'));
        return dfd.promise();
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

      dfd.resolve();

    } else {

      var successCallback = (function(done, count) {
        return function() {
          if (++done === count) {
            dfd.resolve();
          }
        };
      }(done, count));

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
    }

    return dfd.promise();
  }

  call_backend(type, domain, id) {
    return $.ajax({
      type: type,
      url: '/backend/users/'.concat(this.props.data.ekstern_id, '/', domain, '/', id, '?location_id=2635'),
      dataType: 'json'
    })
    .fail((xhr, status, err) => {
      console.error(status, err.toString());
    });
  }

  render() {
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
            description: 'Modtag invitationer til business events samt skræddersyede business tilbud med The Business Target, der er Berlingske Medias B2B e-mail service.',
            permissiontext: <TheBusinessTargetPermText />,
            interestsSelection: <TheBusinessTargetInterests toggle={this.setBusinessTargetInteresserSignUps} data={this.props.data} completed={this.setBusinessTargetIntestSelectionCompleted} hasError={this.state.business_target_interests_error} />,
            logo_src: 'https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/TBTBanner_530x80.jpg',
            publisher: 51}];


    var nyhedsbreve = [].concat(godttip_nyhedsbreve, tbt_nyhedsbreve);

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
}


class GodtTipPermText extends React.Component {
  render() {
    return(
      <div>GodtTip og Berlingske Media-koncernen (<a href="http://www.berlingskemedia.dk/berlingske-medias-selskaber-og-forretningsenheder" target="_blank">se udgivelser og forretningsenheder her</a>) må gerne gøre mig opmærksom på nyheder, tilbud og konkurrencer via brev og elektroniske medier (herunder e-mail, sms, mms, videobeskeder og pop-ups), når Berlingske Media-koncernen og vores samarbejdspartnere (<a href="http://www.berlingskemedia.dk/berlingske-medias-samarbejdspartnere/" target="_blank">se samarbejdspartnere her</a>) har nyheder, tilbud og konkurrencer inden for forskellige interesseområder (<a href="http://www.berlingskemedia.dk/liste-over-interesseomraader/" target="_blank">se hvilke her</a>).</div>
    );
  }
}


class TheBusinessTargetPermText extends React.Component {
  render() {
    return(
      <div>The Business Target og Berlingske Media-koncernen (<a href="http://www.berlingskemedia.dk/berlingske-medias-selskaber-og-forretningsenheder/" target="_blank">se udgivelser og forretningsenheder her</a>) må gerne gøre mig opmærksom på nyheder, tilbud og konkurrencer via brev og elektroniske medier (herunder e-mail, sms, mms, videobeskeder og pop-ups), når Berlingske Media-koncernen og vores samarbejdspartnere (<a href="http://www.berlingskemedia.dk/berlingske-medias-samarbejdspartnere/" target="_blank">se samarbejdspartnere her</a>) har nyheder, tilbud og konkurrencer inden for forskellige interesseområder (<a href="http://www.berlingskemedia.dk/liste-over-interesseomraader/" target="_blank">se hvilke her</a>).</div>
    );
  }
}
