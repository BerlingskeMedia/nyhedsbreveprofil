import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../Loading/Loading';

export class CategoryApiCardItem extends React.Component {
  constructor(props) {
    super(props);

    this.renderDetails = this.renderDetails.bind(this);
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
      .then(response => response.json())
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
    if (this.state.data) {
      return this.props.render(this.state.data);
    }

    if (this.state.error && this.props.renderError) {
      return this.props.renderError(this.state.error);
    }

    return null;
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    if (this.state.pending) {
      return <Loading/>;
    }

    return this.renderDetails();
  }
}

CategoryApiCardItem.propTypes = {
  fetchData: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  renderError: PropTypes.func,
  sideNav: PropTypes.func,
  title: PropTypes.string
};