var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var InteresseList = require('./checkbox_list');

module.exports = React.createClass({
  getInitialState: function() {
    return {showOffers: false};
  },
  componentDidMount: function() {

    if (window.location.host.indexOf('profil.berlingskemedia.dk') > -1) {
      ga('set', 'page', 'opdateringskampagne/step_finished');
      ga('send', 'pageview');
    }

    this.sendCampaignSignup();
    this.sendReceiptEmail();

    ReactDOM.findDOMNode(this).scrollIntoView();
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
      <div className="stepFinished">

        <h2>Tak for din hjælp</h2>
        <h3 className="stepsubtitle">
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
      <div className="newspaperOffers">
        { this.props.abo === null ?
          <NewspaperOffer
            name="Berlingske"
            logo_src="https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/newspapers/400px_Berlingske_avis.png"
            click_href="http://abonnement.b.dk/berlingske-alle-produkter-abonnementslink/?ns_campaign=_opdateringskampagne_berlingske&ns_mchannel=&ns_source=permissionmails&ns_linkname=pm_uspecificeret&ns_fee=AL-160509-CP-RLEDIT1OK"
            description="Berlingske kæmper hver dag for at levere journalistik, der gør en forskel og flytter noget." />
          : null }
        { this.props.abo === null ?
          <NewspaperOffer
            name="BT"
            logo_src="https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/newspapers/400px_BT_avis.png"
            click_href="http://abonnement.bt.dk/abonnementer/?ns_campaign=_opdateringskampagne_BT&ns_mchannel=na&ns_source=permissionmails&ns_linkname=pm_uspecificeret&ns_fee=AL-160509-CP-RLEDIT1OK"
            description="BT skaber dagsordenen og formidler væsentlig og vedkommende journalistik på en underholdende måde." />
          : null }
        { this.props.abo === null ?
          <NewspaperOffer
            name="Weekendavisen"
            click_href="http://www.weekendavisen.dk/29"
            logo_src="https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/newspapers/400px_Wea_avis.png"
            description="Weekendavisen går i dybden og sætter tingene ind i en større sammenhæng." />
          : null }
        {this.props.showKidsNews && this.props.abo !== 'KN' ?
          <NewspaperOffer
            name="Kids' News"
            click_href="http://kidsnews.kundeunivers.dk/koeb-abonnement/kidsnews?ns_campaign=_Opdateringskampagne_KN&ns_mchannel=&ns_source=permissionmails&ns_linkname=pm_uspecificeret&ns_fee=AL-160509-CP-RLEDIT1OK"
            logo_src="https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/newspapers/400px_KN_avis.png"
            description="Kids' News beretter om politik, samfund og begivenheder fra den store vide verden med det formål at forklare baggrund, årsager og sammenhænge, så begivenhederne giver mening for børn." />
          : null }
      </div>
    );
  }
});

var NewspaperOffer = React.createClass({
  render: function() {
    return (
      <div className="newspaperOffer">
        <a className="nodecor" target="_blank" href={this.props.click_href}>
          <h2 className="nodecor">Få et abonnement med {this.props.name}</h2>
          <img className="newspaperOfferImg" src={this.props.logo_src} />
          <p className="nodecor">{this.props.description}</p>
        </a>
        <a target="_blank" href={this.props.click_href}>
          <p>Klik her og få et et godt tilbud</p>
        </a>
      </div>
    );
  }
});
