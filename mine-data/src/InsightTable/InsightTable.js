import React from 'react';
import { Collapse } from 'reactstrap';
import data from '../../data';
import { withManualDetails } from '../CategoryCard/withManualDetails';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import { withTitle } from '../CategoryCard/withTitle';
import { compose } from 'redux';
import { withCollapse } from '../CategoryList/withCollapse';
import { CategoryList } from '../CategoryList/CategoryList';

import './InsightTable.scss';

const ManualCategoryCard = compose(withTitle, withManualDetails)(CategoryCard);
const List = withCollapse(CategoryList);

export class InsightTable extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    return (
      <div className="InsightTable">
        <p className="InsightTable-caption">Click <a
          className="InsightTable-link" onClick={this.toggle}>here</a> to see
          which data
          we store on you and why we do so.</p>
        <Collapse isOpen={this.state.isOpen}>
          <List getId={({category}) => category.name}>
            {data.categories.map(category => <ManualCategoryCard key={category.name} category={category} />)}
          </List>
        </Collapse>
      </div>
    );
  }
}