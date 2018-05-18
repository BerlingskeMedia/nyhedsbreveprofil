import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../Loading/Loading';

import './CategoryApiCardItem.scss';
import classnames from 'classnames';
import { CategoryCard } from '../CategoryCard/CategoryCard';

const SubCategoryCard = ({className, children, ...props}) => <CategoryCard className={classnames(className, 'SubCategoryCard')} details={() => children} {...props}/>;

export class CategoryApiCardItem extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      data: null,
      error: null,
      pending: false
    };
  }

  componentWillMount() {
    this.setState({pending: true});
    this.props.fetchData()
      .then(data => this.setState({
        data,
        pending: false
      }))
      .catch(response => this.setState({
        pending: false,
        error: response
      }));
  }

  renderDetails() {
    const {hasData, render, renderError} = this.props;
    const {pending, data, error} = this.state;

    if (pending) {
      return <Loading/>;
    }

    if (data && (!hasData || hasData(data))) {
      return render(data);
    }

    if (error && renderError) {
      return renderError(error);
    }

    return null;
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen});
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
  fetchData: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  hasData: PropTypes.func,
  renderError: PropTypes.func,
  sideNav: PropTypes.func,
  title: PropTypes.string
};