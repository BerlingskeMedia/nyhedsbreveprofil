import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../Loading/Loading';

import './CategoryApiCardItem.scss';
import classnames from 'classnames';
import { CategoryCard } from '../CategoryCard/CategoryCard';

const SubCategoryCard = ({className, children, ...props}) => <CategoryCard className={classnames(className, 'SubCategoryCard')} details={() => children} {...props}/>;

export class CategoryApiCardItem extends React.Component {
  renderDetails() {
    const {hasData, render, renderError, pending, hasError} = this.props;

    if (pending) {
      return <Loading/>;
    }

    if (!!hasData) {
      return render();
    }

    if (!!hasError && renderError) {
      return renderError();
    }

    return null;
  }

  render() {
    const {title, ...otherProps} = this.props;
    const content = this.renderDetails();

    if (content) {
      return (
        <SubCategoryCard title={title} {...otherProps}>
          {content}
        </SubCategoryCard>
      );
    }

    return null;
  }
}

CategoryApiCardItem.propTypes = {
  pending: PropTypes.bool.isRequired,
  render: PropTypes.func.isRequired,
  hasData: PropTypes.any,
  hasError: PropTypes.any,
  renderError: PropTypes.func,
  sideNav: PropTypes.func,
  title: PropTypes.string
};