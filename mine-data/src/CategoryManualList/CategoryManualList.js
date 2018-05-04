import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import data from '../../data';
import {
  addCategory, removeCategory, resetCategories, setMode,
  setNoneMode
} from './categoryManualList.actions';
import classNames from 'classnames';
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

const ModeButton = ({active, className, ...rest}) => (
  <SubmitButton {...rest} className={classNames(className, 'ModeButton', {active})}/>
);

class List extends React.Component {
  constructor(props) {
    super(props);

    this.isSelected = this.isSelected.bind(this);
    this.requestDelete = this.requestDelete.bind(this);
    this.requestInsight = this.requestInsight.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleMode = this.toggleMode.bind(this);
  }

  componentWillUnmount() {
    this.props.resetCategories();
    this.props.setNoneMode();
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

  toggleMode(newMode) {
    if (this.props.mode === newMode) {
      this.props.setNoneMode();
    } else {
      this.props.resetCategories();
      this.props.setMode(newMode);
    }
  }

  render() {
    const {mode} = this.props;

    return (
      <Fragment>
        <div className="nav-buttons justify-content-start">
          <ModeButton onClick={() => this.toggleMode('insight')} active={mode === 'insight'}>Request insights</ModeButton>
          <ModeButton onClick={() => this.toggleMode('delete')} className="btn-danger" active={mode === 'delete'}>Request delete</ModeButton>
        </div>
        <CollapsibleList isChecked={this.isSelected} onCheck={this.toggle}
                         getId={({category}) => category.name}>
          {data.categories.map(category => <ManualCard key={category.name} category={category} enabled={mode} />)}
        </CollapsibleList>
      </Fragment>
    );
  }
}

const mapStateToProps = ({categoryManualList: {list, mode}}) => ({
  list,
  mode
});

const mapDispatchToProps = (dispatch) => ({
  onAddCategory: (category) => dispatch(addCategory(category.name)),
  onRemoveCategory: (category) => dispatch(removeCategory(category.name)),
  resetCategories: () => dispatch(resetCategories()),
  setNoneMode: () => dispatch(setNoneMode()),
  setMode: (newMode) => dispatch(setMode(newMode))
});

export const CategoryManualList = connect(mapStateToProps, mapDispatchToProps)(List);