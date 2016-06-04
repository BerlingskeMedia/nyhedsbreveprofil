var $ = require('jquery');
var React = require('react');
var InteresseList = require('./checkbox_list');

module.exports = React.createClass({
  getInitialState: function() {
    return {showOffers: false};
  },
  componentDidMount: function() {

    ga('set', 'page', 'opdateringskampagne/step_finished');
    ga('send', 'pageview');

    this.sendCampaignSignup();
    this.sendReceiptEmail();
  },
  sendCampaignSignup: function() {

    var payload = {
      kampagne_id: 3703,
      ekstern_id: this.props.data.ekstern_id
    };

    return $.ajax({
      type: 'POST',
      url: '/backend/kampagner/kampagnelinie',
      data: JSON.stringify(payload),
      contentType: "application/json; charset=utf-8",
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  sendReceiptEmail: function() {
    return $.ajax({
      type: 'POST',
      url: '/opdatering/finished',
      data: JSON.stringify(this.props.data),
      contentType: "application/json; charset=utf-8",
      success: function(xhr, status, err) {
        console.log('Email sent', xhr);
      },
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {

    var showOffers = this.props.data.nyhedsbreve.some(function(nyhedsbrev_id) {
      return [66,108,283,300].indexOf(nyhedsbrev_id) > -1;
    }) && this.props.abo !== 'NA';

    var showKidsNews = (this.props.data.kids !== undefined && this.props.data.kids.length > 0) || this.props.data.interesser.indexOf(39) > -1;

    return(
      <div>
        <h3>Tak for din hjælp</h3>
        <h3>
          Du er nu med i konkurrencen om de mange præmier inklusiv hovedpræmien, en iPad Air 2 til en værdi af kr. 4.499,-
          Vinderne offentliggøres mandag d. 11. juli og de heldige vindere får direkte besked.
        </h3>
        {showOffers === true ? <NewspaperOffers showKidsNews={showKidsNews} abo={this.props.abo} /> : null}
      </div>
    );
  }
});

var NewspaperOffers = React.createClass({
  render: function() {
    return (
      <div className="newspaperOffers" style={{marginTop: '50px'}}>
        { this.props.abo === null ?
          <NewspaperOffer
            name="Berlingske"
            logo_src="opdatering/assets/images/400px_Berlingske_avis.png"
            click_href="http://abonnement.b.dk/berlingske-alle-produkter-abonnementslink/?ns_campaign=_opdateringskampagne_berlingske&ns_mchannel=&ns_source=permissionmails&ns_linkname=pm_uspecificeret&ns_fee=AL-160509-CP-RLEDIT1OK"
            description="Berlingske kæmper hver dag for at levere journalistik, der gør en forskel og flytter noget." />
          : null }
        { this.props.abo === null ?
          <NewspaperOffer
            name="BT"
            logo_src="opdatering/assets/images/400px_BT_avis.png"
            click_href="http://abonnement.bt.dk/abonnementer/?ns_campaign=_opdateringskampagne_BT&ns_mchannel=na&ns_source=permissionmails&ns_linkname=pm_uspecificeret&ns_fee=AL-160509-CP-RLEDIT1OK"
            description="BT skaber dagsordenen og formidler væsentlig og vedkommende journalistik på en underholdende måde." />
          : null }
        { this.props.abo === null ?
          <NewspaperOffer
            name="Weekendavisen"
            click_href="http://www.weekendavisen.dk/29"
            logo_src="opdatering/assets/images/400px_Wea_avis.png"
            description="Weekendavisen går i dybden og sætter tingene ind i en større sammenhæng." />
          : null }
        {this.props.showKidsNews && this.props.abo !== 'KN' ?
          <NewspaperOffer
            name="Kids' News"
            click_href="http://kidsnews.kundeunivers.dk/koeb-abonnement/kidsnews?ns_campaign=_Opdateringskampagne_KN&ns_mchannel=&ns_source=permissionmails&ns_linkname=pm_uspecificeret&ns_fee=AL-160509-CP-RLEDIT1OK"
            logo_src="opdatering/assets/images/400px_KN_avis.png"
            description="Kids' News beretter om politik, samfund og begivenheder fra den store vide verden med det formål at forklare baggrund, årsager og sammenhænge, så begivenhederne giver mening for børn." />
          : null }
      </div>
    );
  }
});

var NewspaperOffer = React.createClass({
  render: function() {
    return (
      <div className="newspaperOffer" style={{marginTop: '20px'}}>
        <h2>Få et abonnement med {this.props.name}</h2>
        <a target="_blank" href={this.props.click_href}>
          <img src={this.props.logo_src} style={{width: '100%'}} />
        </a>
        <p>{this.props.description}</p>
        <p><a target="_blank" href={this.props.click_href}>Klik her og få et et godt tilbud</a></p>
      </div>
    );
  }
});
