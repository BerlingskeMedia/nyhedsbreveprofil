import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../Loading/Loading';
import { CategoryCard } from '../CategoryCard/CategoryCard';

export class CategoryApiCard extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      data: null,
      pending: false
    };
  }

  componentWillMount() {
    this.setState({pending: true});
    this.props.fetchData()
      .then(response => response.json())
      .then(data => {
        this.setState({
          data,
          pending: false
        });
      });
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    const {title, render, ...rest} = this.props;
    const {pending, data} = this.state;

    return (
      <CategoryCard title={title} sideNav={() => pending ? <Loading/> : null}
                    details={() => data && !pending ? render(data) : null}
                    {...rest}/>
    );
  }
}

CategoryApiCard.propTypes = {
  fetchData: PropTypes.func.isRequired,
  title: PropTypes.string,
  render: PropTypes.func.isRequired
};