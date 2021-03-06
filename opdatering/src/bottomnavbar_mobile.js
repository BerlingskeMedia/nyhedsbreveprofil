const React = require('react');

module.exports = class extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var dots = this.props.steps.map(function(s,i) {
      return <Dot key={i} active={i === this.props.activeStep ? true : false} />
    }.bind(this));

    var userIsOnFirstStep = this.props.activeStep === 0,
        userIsOnLastStep = this.props.activeStep + 1 === this.props.steps.length;

    return (
      <footer className="bottomnavbar">
        <div className="container">
          <div className="row">
            <div className="col-xs-3">
            {!userIsOnFirstStep & !userIsOnLastStep ?
              <input type="button" value="Tilbage" className="btn btn-default prevButton pull-left" onClick={this.props.prevFunc} disabled={this.props.stepping} />
              : null
            }
            </div>
            <div className="col-xs-6 navdotscol">
              <div className="navdots">{dots}</div>
            </div>
            <div className="col-xs-3">
              {!userIsOnLastStep ?
                <input type="button" value="Næste" className="btn btn-default nextButton pull-right" onClick={this.props.nextFunc} disabled={this.props.stepping} />
                : null
              }
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

class Dot extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var size = 12,
        sizePx = size.toString().concat('px'),
        borderSizePx = (size / 2).toString().concat('px'),
        active = this.props.active ? true : false;

    var styleObj = {
      width: sizePx,
      height: sizePx,
      background: active ? '#333' : '#C5C5C5',
      MozBorderRadius: borderSizePx,
      WebkitBorderRadius: borderSizePx,
      borderRadius: borderSizePx,
      display: 'inline-block',
      margin: '0px 6px'
    };

    return (
      <div style={styleObj}></div>
    );
  }
}
