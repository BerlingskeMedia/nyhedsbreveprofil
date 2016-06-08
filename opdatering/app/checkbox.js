var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {checked: this.props.data.preselect ? true : false};
  },
  onChange: function() {
    this.setState({checked: !this.state.checked}, function (previousState, currentProps) {
      // Sending info to parent that the user has toggled the subscription
      this.props.toggle(this.state.checked, this.props.data);
    }.bind(this));
  },
  render: function() {
    var majorClassName = this.props.data.logo_src !== undefined ? 'mdbCheckbox mdbLogoCheckbox' : 'mdbCheckbox mdbGreenCheckbox';

    return (
      <div className={majorClassName}>
        <div className="checkbox">
          <input type="checkbox" id={this.props.data.id} checked={this.state.checked} onChange={this.onChange} />
          <label className="control-label" htmlFor={this.props.data.id}>
            {this.props.data.logo_src ?
              <LogoCheckbox logo_src={this.props.data.logo_src} /> :
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
});

var LogoCheckbox = React.createClass({
  render: function() {
    return(
      <div>
        <img className="checked_img" src="/opdatering/assets/checked_stroked.svg" />
        <img className="unchecked_img" src="/opdatering/assets/unchecked.svg" />
        <img style={{width: '100%', border: '#C3C3C3 1px solid'}} src={this.props.logo_src} />
      </div>
    );
  }
});
