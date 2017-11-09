var React = require('react');

module.exports = React.createClass({
  render: function() {
    var labels = this.props.steps.map(function(s,i) {
      if (i === this.props.step) {
        return <div key={i} className="item activeSidebarStep" style={{fontWeight: 'bold'}}>{s.props.sidebar_label}</div>
      } else {
        return <div key={i} className="item">{s.props.sidebar_label}</div>
      }
    }.bind(this));

    return (
      <div className="sidebar">
        <div className="logo">
          <img src="/opdatering/assets/bem-logo.svg" alt="BEM logo" />
        </div>
        <div className="items">
          {labels}
        </div>
      </div>
    );
  }
});
