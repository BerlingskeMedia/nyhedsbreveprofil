var React = require('react');

module.exports = React.createClass({
  componentWillReceiveProps: function() {
    // console.log('step', this.props.step);
    // console.log('steps', this.props.steps);
  },
  render: function() {
    var labels = this.props.steps.map(function(s,i) {
      if (i === this.props.step) {
        return <div key={i} className="activeSidebarStep" style={{fontWeight: 'bold'}}>{s.props.sidebar_label}</div>
      } else {
        return <div key={i}>{s.props.sidebar_label}</div>
      }
    }.bind(this));
    // console.log('lls', labels);
    return (
      <div className="sidebar">
        {labels}
      </div>
    );
  }
});
