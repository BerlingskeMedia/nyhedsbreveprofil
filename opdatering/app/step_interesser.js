var React = require('react');

var Step3 = React.createClass({
  render: function() {
    return (
      <form className="step2Form" onSubmit={this.handleSubmit}>
        <NewsletterList user={this.state.user} nyhedsbreve={this.state.nyhedsbreve} />
        <input type="submit" value="Videre" />
      </form>
    );
  }
});

module.exports = Step3;
