const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const SelectList = require('./select_list');

module.exports = class extends React.Component {

  constructor(props) {
    super(props);
    this.createSelectOptions = this.createSelectOptions.bind(this);
    this.mapExistingUserSignups = this.mapExistingUserSignups.bind(this);
    this.toggleInteresseBusinessTarget = this.toggleInteresseBusinessTarget.bind(this);
    this.state = {
      new_signups: {},
      new_signouts: {},
      existing_signups: {},
      thebusinesstargetInterests: [
        {id: 310, navn: 'Branche', initialValue: '', options: []},
        {id: 343, navn: 'Stillingsbetegnelse', initialValue: '', options: []},
      ]
    };
  }

  componentDidMount() {
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
  }

  componentWillUnmount() {
    this.loadingThebusinesstargetInterests.abort();
  }

  componentWillReceiveProps(nextProp) {
    if (this.props.hasError === true) {
      // ReactDOM.findDOMNode(this).scrollIntoView();
    }
  }

  createSelectOptions(data) {

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
  }

  mapExistingUserSignups(data) {
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
  }

  toggleInteresseBusinessTarget(interesse_id_str, parent_id) {
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
  }

  render() {
    return(
      <div>
        <SelectList data={this.state.thebusinesstargetInterests} toggle={this.toggleInteresseBusinessTarget} />
        {this.props.hasError ? <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span> Branche og stillingsbetegnelse skal udfyldes</span>
        </div> : null}
      </div>
    );
  }
}


if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
