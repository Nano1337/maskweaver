import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import SignOutButton from "../SignOut";

const AccountPage = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <h1>Account: {authUser.email}</h1>
                    <PasswordForgetForm />
                    <PasswordChangeForm />
                </div>
            )}
        </AuthUserContext.Consumer>
        <p></p>
        <SignOutButton />
    </div>

);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);