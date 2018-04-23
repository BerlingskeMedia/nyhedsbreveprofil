import React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody } from 'reactstrap';

import './UserDetails.scss';

const DetailsCard = ({userInfo}) => (
  <Card className="UserDetails">
    <CardBody>
      foo bar
    </CardBody>
    <div className="UserDetails-avatar">

    </div>
  </Card>
);

const mapStateToProps = ({userInfo}) => ({
  userInfo
});

export const UserDetails = connect(mapStateToProps)(DetailsCard);