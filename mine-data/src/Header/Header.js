import React from 'react';
import { connect } from 'react-redux';
import logo from '../../assets/BEM_logo_White_100_mm.svg';
import { LogoutLink } from '../logout/LogoutLink';

import './Header.scss';

const HeaderPure = ({userInfo}) => (
  <div className="Header">
    <img className="Header-logo" src={logo}/>
    <div className="Header-logout">
      {userInfo.userInfo && userInfo.userInfo.profile && userInfo.isVerified ?
        <LogoutLink>Logout</LogoutLink>
        :
        null
      }
    </div>
    <div className="Header-title">Persondata hos Berlingske Media</div>
  </div>
);

const mapStateToProps = ({userInfo}) => ({
  userInfo
});

export const Header = connect(mapStateToProps)(HeaderPure);