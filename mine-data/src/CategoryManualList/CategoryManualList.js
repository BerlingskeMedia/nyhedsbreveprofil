import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import data from '../../data';
import { addCategory, removeCategory } from './categoryManualList.actions';
import SubmitButton from '../SubmitButton/SubmitButton';
import { withManualDetails } from '../CategoryCard/withManualDetails';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import { compose } from 'redux';
import { withTitle } from '../CategoryCard/withTitle';
import { withCollapse } from '../CategoryList/withCollapse';
import { CategoryList } from '../CategoryList/CategoryList';
import { withCheckbox } from '../CategoryCard/withCheckbox';
import { withCheckboxList } from '../CategoryList/withCheckboxList';

import './CategoryManualList.scss';

const ManualCard = compose(withCheckbox, withManualDetails, withTitle)(CategoryCard);
const CollapsibleList = compose(withCheckboxList, withCollapse)(CategoryList);

class List extends React.Component {
  constructor(props) {
    super(props);

    this.isSelected = this.isSelected.bind(this);
    this.requestDelete = this.requestDelete.bind(this);
    this.requestInsight = this.requestInsight.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  isSelected(category) {
    return this.props.list.includes(category.name);
  }

  requestDelete() {
    // TODO: blocked by ZenDesk integration
  }

  requestInsight() {
    // TODO: blocked by ZenDesk integration
  }

  toggle(category) {
    if (this.isSelected(category)) {
      this.props.onRemoveCategory(category);
    } else {
      this.props.onAddCategory(category);
    }
  }

  render() {
    const { list } = this.props;

    return (
      <Fragment>
        <div className="nav-buttons justify-content-start">
          <SubmitButton onClick={this.requestInsight} disabled={!list || !list.length}>Request insights</SubmitButton>
          <SubmitButton onClick={this.requestDelete} warn disabled={!list || !list.length}>Request delete</SubmitButton>
        </div>
        <CollapsibleList isChecked={this.isSelected} onCheck={this.toggle}
                         getId={({category}) => category.name}>
          {data.categories.map(category => <ManualCard key={category.name} category={category} />)}
        </CollapsibleList>
      </Fragment>
    );
  }
}

const mapStateToProps = ({categoryManualList}) => ({
  list: categoryManualList
});

const mapDispatchToProps = (dispatch) => ({
  onAddCategory: (category) => dispatch(addCategory(category.name)),
  onRemoveCategory: (category) => dispatch(removeCategory(category.name))
});

export const CategoryManualList = connect(mapStateToProps, mapDispatchToProps)(List);