var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <form className="step2Form" onSubmit={this.handleSubmit}>
        <input type="submit" value="Videre" />
      </form>
    );
  }
});
