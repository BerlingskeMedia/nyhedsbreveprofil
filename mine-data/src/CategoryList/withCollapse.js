import React from 'react';

export const withCollapse = (WrapperComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.isCurrentElement = this.isCurrentElement.bind(this);
      this.toggleElement = this.toggleElement.bind(this);

      this.state = {
        currentElementId: null
      };
    }

    isCurrentElement(elementId) {
      return this.state.currentElementId === elementId;
    }

    toggleElement(elementId) {
      if (this.isCurrentElement(elementId)) {
        this.setState({currentElementId: null});
      } else {
        this.setState({currentElementId: elementId});
      }
    }

    render() {
      const {getId, children, ...otherProps} = this.props;

      return (
        <WrapperComponent {...otherProps}>
          {React.Children.map(children, element => React.cloneElement(element, {
            ...element.props,
            onToggle: () => this.toggleElement(getId(element.props)),
            isOpen: this.isCurrentElement(getId(element.props))
          }))}
      </WrapperComponent>
      );
    }
  }
};