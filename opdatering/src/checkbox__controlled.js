var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="mdbCheckbox mdbGreenCheckbox">
        <div className="checkbox">
          <input type="checkbox" id={this.props.data.id} checked={this.props.data.checked} onChange={this.props.toggle} />
          <label className="control-label" htmlFor={this.props.data.id}>
            {this.props.data.navn}
          </label>
        </div>
        {this.props.data.description || this.props.data.permissiontext || this.props.data.interestsSelection ?
          <div className="checkboxCheckedAssets">
            {this.props.data.description ? <span className="description">{this.props.data.description}</span> : null }
            {this.props.data.checked && this.props.data.permissiontext ? <div className="permissiontext">{this.props.data.permissiontext}</div> : null }
            {this.props.data.checked && this.props.data.interestsSelection ? <div className="interestsSelection">{this.props.data.interestsSelection}</div> : null }
          </div>
          : null
        }
      </div>
    );
  }
});
