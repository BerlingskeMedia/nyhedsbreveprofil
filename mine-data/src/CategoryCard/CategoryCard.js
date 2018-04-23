import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';

import './CategoryCard.scss';

export const CategoryCard = ({category, onToggle, isOpen, details, title, sideNav}) => (
  <div className="CategoryCard">
    <div className="CategoryCard-title-wrapper">
      <strong className="CategoryCard-title" onClick={onToggle}>{title}</strong>
      {sideNav ? <div className="CategoryCard-title-side">{sideNav(category)}</div> : null}
    </div>
    <Collapse isOpen={isOpen}>
      <div className="CategoryCard-details">
        {details(category)}
      </div>
    </Collapse>
  </div>
);

CategoryCard.propTypes = {
  details: PropTypes.func,
  onToggle: PropTypes.func,
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  sideNav: PropTypes.func,
  category: PropTypes.shape({
    name: PropTypes.string,
    informationType: PropTypes.string,
    purpose: PropTypes.string,
    authority: PropTypes.string,
    access: PropTypes.string,
    origin: PropTypes.string,
    registrer: PropTypes.string,
    storeLongevity: PropTypes.string
  })
};