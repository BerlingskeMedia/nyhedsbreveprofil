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
      kampagne_id: 3713,
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

    var showOffers = this.props.data.permissions.some(function(permission_id) {
      return [66,108,283,300].indexOf(permission_id) > -1;
    }) && this.props.abo !== 'NA';

    var showKidsNews = (this.props.data.kids !== undefined && this.props.data.kids.length > 0 && this.props.data.kids.some(isBetweenSixAndTwelveYearsOld)) || this.props.data.interesser.indexOf(39) > -1;

    function isBetweenSixAndTwelveYearsOld(kid){
      var thisYear = new Date().getFullYear();
      var kidsAge = thisYear - kid.birthyear;
      return kidsAge >=6 && kidsAge <= 12;
    }

    return(
      <div className="stepFinished">

        <h2>Tak for din hjælp</h2>
        <h3 className="stepsubtitle">
          Du er nu med i konkurrencen om de mange præmier inklusiv hovedpræmien, en iPad til en værdi af 4.199 kr.
          Vinderne offentliggøres torsdag d. 11. januar 2018 og de heldige vindere får direkte besked.
        </h3>
        {showOffers === true
          ? <NewspaperOffers showKidsNews={showKidsNews} abo={this.props.abo} />
          : null
        }
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
            logo_src="https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/62874_Berl_600px_mediebillede_iPhone_1017.png"
            click_href="https://www.b.dk/berlingske-abonnementer?flow=bdk_print_checkout&product=Komplet&offerId=BMSUBU12P4&utm_source=own_links&utm_medium=bem&utm_content=link_other&utm_campaign=opdateringskampagne2017&ns_fee=AL-151222-CP-WKLEDIT1WK"
            description="Berlingske kæmper hver dag for at levere journalistik, der gør en forskel og flytter noget." />
          : null }
        { this.props.abo === null ?
          <NewspaperOffer
            name="BT"
            logo_src="https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/63328_708x492px_BT_Komplet_1117.png"
            click_href="https://bt.kundeunivers.dk/koeb-abonnement/dine-oplysninger?offer=BTSUBU12P4&utm_source=own_links&utm_medium=bem&utm_term=AL-151222-CP-WKLEDIT1WK&utm_content=link_other&utm_campaign=Opdateringskampagne2017&ns_fee=AL-151222-CP-WKLEDIT1WK"
            description="BT skaber dagsordenen og formidler væsentlig og vedkommende journalistik på en underholdende måde." />
          : null }
        { this.props.abo === null ?
          <NewspaperOffer
            name="Weekendavisen"
            logo_src="https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/newspapers/400px_Wea_avis.png"
            click_href="https://kundeservice.weekendavisen.dk/#/koeb/produkt/WEMGSWUS7,WEMGSWUS6,WEMGSWUS5?ns_fee=WE-170617-CP-CALEDIT1WI&utm_source=own_links&utm_medium=bem&utm_term=AL-151222-CP-WKLEDIT1WK&utm_content=link_other&utm_campaign=Opdateringskampagne2017&ns_fee=AL-151222-CP-WKLEDIT1WK"
            description="Weekendavisen går i dybden og sætter tingene ind i en større sammenhæng." />
          : null }
        {this.props.showKidsNews && this.props.abo !== 'KN' ?
          <NewspaperOffer
            name="Kids' News"
            logo_src="https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/opdateringskampagne/newspapers/400px_KN_avis.png"
            click_href="https://kidsnews.kundeunivers.dk/koeb-abonnement/dine-oplysninger?offer=KNSUBU04&utm_source=own_links&utm_medium=bem&utm_term=AL-151222-CP-WKLEDIT1WK&utm_content=link_other&utm_campaign=Opdateringskampagne2017&ns_fee=AL-151222-CP-WKLEDIT1WK"
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
          <div style={{textAlign: 'left'}}>
            <img className="newspaperOfferImg" src={this.props.logo_src} />
          </div>
          <p className="nodecor">{this.props.description}</p>
        </a>
        <a target="_blank" href={this.props.click_href}>
          <p>Klik her og få et et godt tilbud</p>
        </a>
      </div>
    );
  }
});
