import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import SignOutButton from "../SignOut";

const AccountPage = () => (
    <div className = "page">
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <div className="colorheader">
                            <h1>Account</h1>
                            <h3>{authUser.email}</h3>
                            <SignOutButton />
                    </div>   
                    <br /><br /><hr /><br />
                    <center>
                        <div className="colorheader">
                            <h2>Change Password</h2>
                        </div>
                        
                        <PasswordChangeForm />
                    </center>                 
                    
                </div>
            )}
        </AuthUserContext.Consumer>
        <p></p>
       
    </div>

);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);