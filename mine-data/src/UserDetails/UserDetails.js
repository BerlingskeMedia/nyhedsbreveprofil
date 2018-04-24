import React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap';

import './UserDetails.scss';

const DetailsCard = ({user}) => (
  <Card className="UserDetails">
    <CardBody>
      <CardTitle>{user.firstName} {user.lastName}</CardTitle>
      <CardSubtitle>{user.email}</CardSubtitle>
      <div className="UserDetails-info">
        <div className="UserDetails-info-row">
          {user.nickname ? <div>nick name: {user.nickname}</div> : null}
          {user.age ? <div>age: {user.age}</div> : null}
          {(user.birthDay && user.birthMonth && user.birthYear) ?
            <div>date of birth: {`${user.birthYear}-${user.birthMonth}-${user.birthDay}`}</div> : null}
        </div>
        <div className="UserDetails-info-row">
          {user.address ? <div>address: {user.address}</div> : null}
          {user.city ? <div>city: {user.city}</div> : null}
          {user.country ? <div>country: {user.country}</div> : null}
        </div>
        {user.bio ? <div>bio: {user.bio}</div> : null}
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