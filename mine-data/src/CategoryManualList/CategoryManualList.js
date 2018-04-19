import React, { Fragment } from 'react';
import { Card, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import data from '../../data';

import './CategoryManualList.scss';
import { addCategory, removeCategory } from './categoryManualList.actions';
import Checkbox from '../Checkbox/Checkbox';
import SubmitButton from '../SubmitButton/SubmitButton';

const Category = ({category, isSelected, toggle}) => (
  <label className="Category-card-label">
    <Card className="Category-card">
      <CardBody key={category.name}>
        <div className="Category-title">{category.name}</div>
        <Checkbox checked={isSelected} onChange={toggle}/>
      </CardBody>
    </Card>
  </label>
);

class List extends React.Component {
  constructor(props) {
    super(props);

    this.isSelected = this.isSelected.bind(this);
    this.submitManualList = this.submitManualList.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  isSelected(category) {
    return this.props.list.includes(category.name);
  }

  submitManualList() {
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
        <p>
          Below you can see a list of services that you can request the data
          insights for. Select the desired services from the list and submit the
          request.
        </p>
        {data.categories.map(category =>
          <Category key={category.name} category={category}
                    isSelected={this.isSelected(category)}
                    toggle={() => this.toggle(category)}/>
        )}
        <div className="nav-buttons">
          <form onSubmit={this.submitManualList()}>
            <SubmitButton disabled={!list || !list.length}>Submit</SubmitButton>
          </form>
        </div>
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