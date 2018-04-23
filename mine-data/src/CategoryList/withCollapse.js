import React from 'react';

export const withCollapse = (WrapperComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.isCurrentCategory = this.isCurrentCategory.bind(this);
      this.toggleCategory = this.toggleCategory.bind(this);

      this.state = {
        currentCategory: null
      };
    }

    isCurrentCategory(category) {
      return this.state.currentCategory === category.name;
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
        <WrapperComponent {...this.props}>
          {React.Children.map(this.props.children, element => React.cloneElement(element, {
            ...element.props,
            onToggle: () => this.toggleCategory(element.props.category),
            isOpen: this.isCurrentCategory(element.props.category)
          }))}
      </WrapperComponent>
      );
    }
  }
};