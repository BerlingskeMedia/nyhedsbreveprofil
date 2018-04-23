const React = require('react');

module.exports = class extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      checked: this.props.data.preselect ? true : false
    };
  }


  onChange() {
    this.setState({checked: !this.state.checked}, function (previousState, currentProps) {
      // Sending info to parent that the user has toggled the subscription
      this.props.toggle(this.state.checked, this.props.data);
    }.bind(this));
  }

  render() {

    var majorClassName = this.props.data.logo_src !== undefined ? 'mdbCheckbox mdbLogoCheckbox' : 'mdbCheckbox mdbGreenCheckbox';

    return (
      <div className={majorClassName}>
        <div className="checkbox">
          <input type="checkbox" id={this.props.data.id} checked={this.state.checked} onChange={this.onChange} />
          <label className="control-label" htmlFor={this.props.data.id} style={this.props.data.label_style}>
            {this.props.data.logo_src ?
              <LogoCheckbox logo_src={this.props.data.logo_src} logo_style={this.props.data.logo_style} /> :
              <span>{this.props.data.navn}</span>
            }
          </label>
        </div>
        {this.props.data.description || this.props.data.permissiontext || this.props.data.interestsSelection ?
          <div className="checkboxCheckedAssets">
            {this.props.data.description ? <div className="description" onClick={this.onChange}>{this.props.data.description}</div> : null }
            {this.state.checked && this.props.data.permissiontext ? <div className="permissiontext">{this.props.data.permissiontext}</div> : null }
            {this.state.checked && this.props.data.interestsSelection ? <div className="interestsSelection">{this.props.data.interestsSelection}</div> : null }
          </div>
          : null
        }
      </div>
    );
  }
}

class LogoCheckbox extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    var logo_style = Object.assign({width: '100%', height: '100%', border: '#C3C3C3 1px solid'}, this.props.logo_style);

    return(
      <div>
        <img className="checked_img" src="/opdatering/assets/checked_stroked.svg" />
        <img className="unchecked_img" src="/opdatering/assets/unchecked.svg" />
        <img style={logo_style} src={this.props.logo_src} />
      </div>
    );
  }
}


if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      // We must check against these specific cases.
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
