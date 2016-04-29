var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <form className="stepInteresser" onSubmit={this.handleSubmit}>
        <input type="submit" value="Videre" />
      </form>
    );
  }
});
