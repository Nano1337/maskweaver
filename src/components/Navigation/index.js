import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import "./nav.css"

const Navigation = () => (
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ? (
                <NavigationAuth authUser={authUser} />
            ) : (
                <NavigationNonAuth />
            )
        }
    </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
    <ul>
        <li>
            <Link to={ROUTES.LANDING}>
                <img src={require('./img/plus.png')} alt="plus sign"/>
            </Link>

        </li>
        <li>
            <Link to={ROUTES.ACCOUNT}>
                <img src={require('./img/info.png')}/>
            </Link>
        </li>
        <li>
            <Link to={ROUTES.HOME}>
                <img src={require('./img/friend.svg')} alt="account"/>
            </Link>
        </li>
        <li>
            <Link to={ROUTES.ACCOUNT}>
                <img src={require('./img/person.png')} alt="account"/>
            </Link>
        </li>

    </ul>
);

const NavigationNonAuth = () => (
    <p>Sign Up Today!</p>
);

export default Navigation;