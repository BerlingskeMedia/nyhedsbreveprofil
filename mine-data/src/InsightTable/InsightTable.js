import React from 'react';

import './InsightTable.scss';
import { Collapse } from 'reactstrap';
import data from '../../data';

export class InsightTable extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      currentCategory: null,
      isOpen: false
    };
  }

  isCurrentCategory(category) {
    return this.state.currentCategory === category.name;
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen});
  }

  toggleCategory(category) {
    if (this.isCurrentCategory(category)) {
      this.setState({currentCategory: null});
    } else {
      this.setState({currentCategory: category.name});
    }
  }

  render() {
    return (
      <div className="InsightTable">
        <p className="InsightTable-caption">Click <a className="InsightTable-link" onClick={this.toggle}>here</a> to see which data
          we store on you and why we do so.</p>
        <Collapse isOpen={this.state.isOpen}>
          {data.categories.map(category => (
            <div className="InsightTable-category" key={category.name}>
              <strong className="InsightTable-category-title" onClick={() => this.toggleCategory(category)}>{category.name}</strong>
              <Collapse isOpen={this.isCurrentCategory(category)}>
                <div className="InsightTable-details">
                  <strong>Hvilke oplysninger?</strong>
                  <p>{category.informationType}</p>
                  <strong>Hvad er formålet med databehandlingen?</strong>
                  <p>{category.purpose}</p>
                  <strong>Hvad er lovhjemlen for databehandlingen?</strong>
                  <p>{category.authority}</p>
                  <strong>Hvem har adgang til data?</strong>
                  <p>{category.access}</p>
                  <strong>Hvor kommer data fra?</strong>
                  <p>{category.origin}</p>
                  <strong>Hvem er registreret?</strong>
                  <p>{category.registrer}</p>
                  <strong>Hvor længe opbevares data?</strong>
                  <p>{category.storeLongevity}</p>
                </div>
              </Collapse>
            </div>
          ))}
        </Collapse>
      </div>
    );
  }
}