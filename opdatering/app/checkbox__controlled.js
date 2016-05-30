var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="MdbCheckbox">
        <div className="checkbox">
          <label htmlFor={this.props.data.id}>
            <input type="checkbox" id={this.props.data.id} checked={this.props.data.checked} onChange={this.props.toggle} />
            {this.props.data.navn}
            {this.props.data.description ? <span style={{fontStyle: 'italic', marginLeft: '2px'}}>{this.props.data.description}</span> : null }
          </label>
        </div>
        {this.props.data.checked && this.props.data.permissiontext ? <div style={{marginTop: '5px', marginBottom: '5px'}}>{this.props.data.permissiontext}</div> : null }
        {this.props.data.checked && this.props.data.interestsSelection ? <div>{this.props.data.interestsSelection}</div> : null }
      </div>
    );
  }
});
