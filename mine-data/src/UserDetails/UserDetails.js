import React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap';
import { DetailsItem } from '../Details/DetailsItem';

import './UserDetails.scss';

const DetailsCard = ({user}) => (
  <Card className="UserDetails">
    <CardBody>
      <CardTitle>{user.firstName} {user.lastName}</CardTitle>
      <CardSubtitle>{user.email}</CardSubtitle>
      <div className="UserDetails-info">
        <div className="UserDetails-info-row">
          <DetailsItem value={user.nickname}>nick name</DetailsItem>
          <DetailsItem value={user.age}>age</DetailsItem>
          <DetailsItem
            value={user.birthDay && user.birthMonth && user.birthYear && `${user.birthYear}-${user.birthMonth}-${user.birthDay}`}>
            date of birth
          </DetailsItem>
        </div>
        <div className="UserDetails-info-row">
          <DetailsItem value={user.address}>address</DetailsItem>
          <DetailsItem value={user.city}>city</DetailsItem>
          <DetailsItem value={user.country}>country</DetailsItem>
        </div>
        <DetailsItem value={user.bio}>bio</DetailsItem>
      </div>
    </CardBody>
    <div className="UserDetails-avatar">

    </div>
  </Card>
);

const mapStateToProps = ({userInfo}) => ({
  user: userInfo.userInfo.profile
});

export const UserDetails = connect(mapStateToProps)(DetailsCard);