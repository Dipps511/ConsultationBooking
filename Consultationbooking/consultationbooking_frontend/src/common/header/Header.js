import React, { useState } from "react";
import { Button } from '@material-ui/core';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.jpeg';
import LoginForm from '../../screens/login/Login';
import RegisterForm from '../../screens/register/Register';
import './Header.css';

/* Style for the pop-up Modal */
const modalStyle = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        padding: "10px",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    }

};

const Header = function ({ isLoggedIn, setIsLoggedIn }) {

    /* Modal state variables */
    const [loginModal, setLoginModal] = useState(false);
    const [activePage, setActivePage] = useState('LOGIN');
    const [successMessage, setSuccessMessage] = useState('');
    const closeLoginModal = () => setLoginModal(false);
    const openLoginModal = () => setLoginModal(true);
    // const toggleModalHandler = () => {
    //     setLoginModal(!loginModal);
    // };
    /* Log out the user and clear session storage */
    const logoutHandler = async () => {
        try {
            const rawData = await fetch('/auth/logout', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${window.sessionStorage.getItem('access-token')}`
                },
            });

            if (rawData.status === 200) {
                window.sessionStorage.removeItem('user-details');
                window.sessionStorage.removeItem('access-token');
                setIsLoggedIn(false);
            } else {
                alert('Something went wrong.');
            }
        } catch (error) {
            console.error({ error: error.message });
            alert('Something went wrong.');
        }
    }

    /* Rendering the active tab (Login form or Register form) */
    let activePageJS;
    if (activePage === 'LOGIN') {
        activePageJS = React.createElement(LoginForm, { setUserLoggedIn: setIsLoggedIn, updateLoginModal: setLoginModal, activePage, setActivePage, setSuccessMessage, deactivateModal: closeLoginModal });
    } else if (activePage === 'REGISTER') {
        activePageJS = React.createElement(RegisterForm, { setUserLoggedIn: setIsLoggedIn, updateLoginModal: setLoginModal, activePage, setActivePage, setSuccessMessage, successMessage, deactivateModal: closeLoginModal })
    }

    /* Rendering the login button for logged out user and logout button for logged in user  */
    let loginLogoutBtn = React.createElement(Button, { className:"loginLogoutButton",variant: "contained", onClick: openLoginModal, color: "primary" }, 'Login');
    if (isLoggedIn) {
        loginLogoutBtn = React.createElement(Button, { className:"loginLogoutButton",variant: "contained", onClick: logoutHandler, color: "secondary" }, 'Logout');
    }

    return (
        <div>
            <div className="header">
                <div>
                    <Link to={`/`}>
                        <img src={logo} height="35" className="logo" alt="LOGO" />
                        <div className="brandName">Doctor Finder</div>
                    </Link>
                </div>
                <div className="nav-buttons">
                    {loginLogoutBtn}
                </div>
            </div>
            <Modal
                style={modalStyle}
                isOpen={loginModal}
                ariaHideApp={false}
                appElement={document.getElementById('modal')}
                onRequestClose={_ => setLoginModal(false)}
            >
                {activePageJS}
            </Modal>
        </div>
    )
};

export default Header;