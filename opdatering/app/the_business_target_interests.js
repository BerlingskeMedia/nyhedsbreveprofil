var $ = require('jquery');
var React = require('react');
var SelectList = require('./select_list');

module.exports = React.createClass({
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

    if (temp.every(hasAnInitalValue)) {
      this.props.completed();
    }


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

    function hasAnInitalValue(selectControl) {
      return selectControl.initialValue !== undefined && selectControl.initialValue !== null && selectControl.initialValue !== '';
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

      var mandatoryInterests = this.state.thebusinesstargetInterests.length,
          selectedInterests = Object.keys(this.state.existing_signups).length + Object.keys(this.state.new_signups).length;
      if (mandatoryInterests === selectedInterests) {
        this.props.completed();
      }

    }.bind(this));
  },
  render: function() {
    return(
      <div>
        <SelectList data={this.state.thebusinesstargetInterests} toggle={this.toggleInteresseBusinessTarget} />
        {this.props.hasError ? <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span> Skal udfyldes</span>
        </div> : null}
      </div>
    );
  }
});
