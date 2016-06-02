var React = require('react');

module.exports = React.createClass({
  render: function() {
    var dots = this.props.steps.map(function(s,i) {
      if (i === this.props.step) {
        return <div key={i} className="activeSidebarStep" style={{fontWeight: 'bold'}}>{s.props.sidebar_label}</div>
      } else {
        return <div key={i}>{s.props.sidebar_label}</div>
      }
    }.bind(this));

    return (
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-xs-4 col-xs-offset-4">
              <p>Dots</p>
              <input type="button" className="nextButton" value="Næste" onClick={this.props.next} />
            </div>
          </div>
        </div>
      </footer>
    );
  }
});
