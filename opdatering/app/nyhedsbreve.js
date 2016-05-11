var $ = require('jquery');
var React = require('react');
var NewsletterCheckbox = require('./checkbox');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      ekstern_id: '',
      new_signups: [],
      new_signouts: []
    };
  },
  toggleNyhedsbrev: function (subscribe, nyhedsbrev) {
    var new_signups = this.state.new_signups;
    var new_signouts = this.state.new_signouts;

    if (subscribe) {
      var i = new_signouts.indexOf(nyhedsbrev.nyhedsbrev_id);
      if (i > -1) {
        new_signouts.splice(i, 1);
      } else {
        new_signups.push(nyhedsbrev.nyhedsbrev_id);
      }
    } else {
      var i = new_signups.indexOf(nyhedsbrev.nyhedsbrev_id);
      if (i > -1) {
        new_signups.splice(i, 1);
      } else {
        new_signouts.push(nyhedsbrev.nyhedsbrev_id);
      }
    }
    this.setState({new_signups: new_signups});
    this.setState({new_signouts: new_signouts});
  },
  // changeNewsletterSubscription: function(nyhedsbrev_id) {
  //   var i = this.props.user.nyhedsbreve.indexOf(nyhedsbrev_id);
  //   if (i > -1) {
  //     this.props.user.nyhedsbreve.splice(i, 1);
  //     return this.deleteNewsletter(nyhedsbrev_id);
  //   } else {
  //     this.props.user.nyhedsbreve.push(nyhedsbrev_id);
  //     return this.addNewsletter(nyhedsbrev_id);
  //   }
  // },
  // addNewsletter: function(nyhedsbrev_id) {
  //   return $.ajax({
  //     type: 'POST',
  //     url: '/backend/users/'.concat(this.props.user.ekstern_id, '/nyhedsbreve/', nyhedsbrev_id, '?location_id=1'),
  //     contentType: "application/json; charset=utf-8",
  //     dataType: 'json',
  //     success: function (data) {
  //     }.bind(this),
  //     error: function(xhr, status, err) {
  //       console.error(this.props.url, status, err.toString());
  //     }.bind(this)
  //   });
  // },
  // deleteNewsletter: function(nyhedsbrev_id) {
  //   return $.ajax({
  //     type: 'DELETE',
  //     url: '/backend/users/'.concat(this.props.user.ekstern_id, '/nyhedsbreve/', nyhedsbrev_id, '?location_id=1'),
  //     contentType: "application/json; charset=utf-8",
  //     dataType: 'json',
  //     success: function (data) {
  //     }.bind(this),
  //     error: function(xhr, status, err) {
  //       console.error(this.props.url, status, err.toString());
  //     }.bind(this)
  //   });
  // },
  render: function() {
    // Sorting the subscribed newsletters at the bottom
    // this.props.nyhedsbreve.sort(function(nyhedsbrev_a, nyhedsbrev_b) {
    //   if (this.props.user.nyhedsbreve.indexOf(nyhedsbrev_a.nyhedsbrev_id) > -1) {
    //     return 1;
    //   } else if (this.props.user.nyhedsbreve.indexOf(nyhedsbrev_b.nyhedsbrev_id) > -1) {
    //     return -1;
    //   } else {
    //     return 0;
    //   }
    // }.bind(this));

    var newsletters = this.props.nyhedsbreve.map(function(nyhedsbrev) {
      // var selected = false;
      // if (this.props.user !== undefined) {
      //   selected = this.props.user.nyhedsbreve.indexOf(nyhedsbrev.nyhedsbrev_id) > -1;
      // }
      return (
        <NewsletterCheckbox key={nyhedsbrev.nyhedsbrev_id} id={nyhedsbrev.nyhedsbrev_id} label={nyhedsbrev.nyhedsbrev_navn} data={nyhedsbrev} toggle={this.toggleNyhedsbrev} />
      );
    }.bind(this));

    return (
      <div className="NewsletterList">
        {newsletters}
      </div>
    )
  }
});


// var NewsletterCheckbox = React.createClass({
//   getInitialState: function() {
//     return {selected: this.props.selected};
//   },
//   onChange: function() {
//     this.setState({selected: !this.state.selected}, function (previousState, currentProps) {
//       this.props.toggleNyhedsbrev(this.state.selected, this.props.nyhedsbrev.nyhedsbrev_id)
//     });
//     // this.setState({selected: !this.state.selected});
//     // this.props.changeNewsletterSubscription(this.props.nyhedsbrev.nyhedsbrev_id)
//     // .success(function (data) {
//     //   // Do nothing at the moment
//     // }.bind(this))
//     // .error(function (data) {
//     //   console.error('changeNewsletterSubscription', data);
//     //   this.setState({selected: !this.state.selected});
//     // });
//   },
//   render: function() {
//     return (
//       <div className="NewsletterCheckbox">
//         <input type="checkbox" id={this.props.nyhedsbrev.nyhedsbrev_id} checked={this.state.selected} onChange={this.onChange} />
//         {this.props.nyhedsbrev.nyhedsbrev_navn}
//       </div>
//     )
//   }
// });
