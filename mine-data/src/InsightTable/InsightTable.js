import React from 'react';
import { Collapse } from 'reactstrap';
import { withManualDetails } from '../CategoryCard/withManualDetails';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import { withTitle } from '../CategoryCard/withTitle';
import { compose } from 'redux';
import { withCollapse } from '../CategoryList/withCollapse';
import { CategoryList } from '../CategoryList/CategoryList';
import { connect } from 'react-redux';
import { fetchCategories } from '../CategoryManualList/categoryManualList.actions';
import { Loading } from '../Loading/Loading';

import './InsightTable.scss';

const ManualCategoryCard = compose(withTitle, withManualDetails)(CategoryCard);
const List = withCollapse(CategoryList);

class Table extends React.Component {
  static fetchCategoriesIfNeeded({categories: {pending, categories}, fetchCategories}) {
    if (!pending && !categories) {
      fetchCategories();
    }
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false
    };
  }

  componentWillMount() {
    Table.fetchCategoriesIfNeeded(this.props);
  }

  componentWillReceiveProps(props) {
    Table.fetchCategoriesIfNeeded(props);
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    const {categories: {pending, categories}} = this.props;

    if (pending) {
      return <Loading/>;
    }

    if (categories) {
      return (
        <div className="InsightTable">
          <p>Klik <a className="InsightTable-link" onClick={this.toggle}>her</a> for at se, hvilke typer af persondata vi gemmer, og hvorfor vi gemmer dem.</p>
          <Collapse isOpen={this.state.isOpen}>
            <List getId={({category}) => category.name}>
              {categories.map(category => <ManualCategoryCard key={category.name} category={category} />)}
            </List>
          </Collapse>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = ({categoryManualList: {categories}}) => ({
  categories
});

const mapDispatchToProps = dispatch => ({
  fetchCategories: () => dispatch(fetchCategories())
});

export const InsightTable = connect(mapStateToProps, mapDispatchToProps)(Table);