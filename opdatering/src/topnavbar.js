var React = require('react');

module.exports = React.createClass({
  render: function() {
    var label = '';

    if (this.props.steps && this.props.steps.length > 0 && this.props.steps[this.props.step].props) {
      label = this.props.steps[this.props.step].props.sidebar_label;
    }

    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="topnavbar row">
              <div className="col-xs-12">
                <h4 className="topnavbarheader text-center">{label}</h4>
              </div>
            </div>
          </div>
        </nav>
        <div className="topnavfiller">
          &nbsp;
        </div>
      </div>
    );
  }
});
