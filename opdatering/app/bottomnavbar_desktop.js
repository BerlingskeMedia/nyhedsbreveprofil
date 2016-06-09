var React = require('react');

module.exports = React.createClass({
  render: function() {
    var userIsOnFirstStep = this.props.step === 0,
        userIsOnLastStep = this.props.step + 1 === this.props.steps.length;

    return (
      <div className="navButtons">

        {!userIsOnFirstStep & !userIsOnLastStep ?
          <input type="button" value="Tilbage" className="btn btn-default prevButton" onClick={this.props.prevFunc} />
          : null
        }

        {!userIsOnLastStep ?
          <input type="button" value="Næste" className="btn btn-default nextButton pull-right" onClick={this.props.nextFunc} />
          :null
        }
      </div>
    );
  }
});
