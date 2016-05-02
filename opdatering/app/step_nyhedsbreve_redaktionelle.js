var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      user: {},
      nyhedsbreve: [],
      aok_nyhedsbreve: [17, 282],
      berlingske_nyhedsbreve: [1, 2, 6, 248, 3],
      bt_nyhedsbreve: [24, 25, 26, 27],
      business_nyhedsbreve: [9, 10, 13]};
  },
  componentDidMount: function() {
    this.props.loadUserData().success(function (data) {
      this.setState({user: data});
      this.loadNewsletters().success(function(data) {
        var nyhedsbreve_id_to_be_shown = [].concat(this.state.berlingske_nyhedsbreve, this.state.bt_nyhedsbreve, this.state.business_nyhedsbreve);

        var postnummer_dk = this.state.user.postnummer_dk;
        if ((postnummer_dk >= 900 && postnummer_dk <= 3699) || (postnummer_dk >= 4000 && postnummer_dk <= 4999)) {
          nyhedsbreve_id_to_be_shown= nyhedsbreve_id_to_be_shown.concat(this.state.aok_nyhedsbreve);
        }

        var nyhedsbreve = data.filter(function(nyhedsbrev) {
          return nyhedsbreve_id_to_be_shown.indexOf(nyhedsbrev.nyhedsbrev_id) > -1;
        });

        this.setState({nyhedsbreve: nyhedsbreve});
      }.bind(this));
    }.bind(this));
  },
  loadNewsletters: function() {
    return $.ajax({
      url: '/backend/nyhedsbreve',
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


var NewsletterList = React.createClass({
  changeNewsletterSubscription: function(nyhedsbrev_id) {
    var i = this.props.user.nyhedsbreve.indexOf(nyhedsbrev_id);
    if (i > -1) {
      this.props.user.nyhedsbreve.splice(i, 1);
      return this.deleteNewsletter(nyhedsbrev_id);
    } else {
      this.props.user.nyhedsbreve.push(nyhedsbrev_id);
      return this.addNewsletter(nyhedsbrev_id);
    }
  },
  addNewsletter: function(nyhedsbrev_id) {
    return $.ajax({
      type: 'POST',
      url: '/backend/users/'.concat(this.props.user.ekstern_id, '/nyhedsbreve/', nyhedsbrev_id, '?location_id=1'),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      success: function (data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  deleteNewsletter: function(nyhedsbrev_id) {
    return $.ajax({
      type: 'DELETE',
      url: '/backend/users/'.concat(this.props.user.ekstern_id, '/nyhedsbreve/', nyhedsbrev_id, '?location_id=1'),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      success: function (data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    // Sorting the subscribed newsletters at the buttom
    this.props.nyhedsbreve.sort(function(nyhedsbrev_a, nyhedsbrev_b) {
      if (this.props.user.nyhedsbreve.indexOf(nyhedsbrev_a.nyhedsbrev_id) > -1) {
        return 1;
      } else if (this.props.user.nyhedsbreve.indexOf(nyhedsbrev_b.nyhedsbrev_id) > -1) {
        return -1;
      } else {
        return 0;
      }
    }.bind(this));

    var newsletters = this.props.nyhedsbreve.map(function(nyhedsbrev) {
      var selected = false;
      if (this.props.user !== undefined) {
        selected = this.props.user.nyhedsbreve.indexOf(nyhedsbrev.nyhedsbrev_id) > -1;
      }
      return (
        <NewsletterCheckbox key={nyhedsbrev.nyhedsbrev_id} nyhedsbrev={nyhedsbrev} selected={selected} changeNewsletterSubscription={this.changeNewsletterSubscription} />
      );
    }.bind(this));

    return (
      <div className="NewsletterList">
        {newsletters}
      </div>
    )
  }
});


var NewsletterCheckbox = React.createClass({
  getInitialState: function() {
    return {selected: this.props.selected};
  },
  onChange: function() {
    this.setState({selected: !this.state.selected});
    this.props.changeNewsletterSubscription(this.props.nyhedsbrev.nyhedsbrev_id)
    .success(function (data) {
      // Do nothing at the moment
    }.bind(this))
    .error(function (data) {
      console.error('changeNewsletterSubscription', data);
      this.setState({selected: !this.state.selected});
    });
  },
  render: function() {
    return (
      <div className="NewsletterCheckbox">
        <input type="checkbox" id={this.props.nyhedsbrev.nyhedsbrev_id} checked={this.state.selected} onChange={this.onChange} />
        {this.props.nyhedsbrev.nyhedsbrev_navn}
      </div>
    )
  }
});
