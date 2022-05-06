import React, { useState } from "react";
import {Button, FormControl, FormHelperText, Input, InputLabel} from '@material-ui/core';
import FormHeader from '../formHeader/FormHeader';
import FormPopoverError from "../../common/FormPopoverError";

export default function RegisterForm({ setUserLoggedIn, updateLoginModal, setSuccessMessage, activePage, setActivePage, successMessage, deactivateModal }) {
    // Styling for displaying error message in the form for inavlid input
    const errorStyle = {
        color: 'red',
    }

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [invalidEmailClass, setInvalidEmailClass] = useState("none");
    const [invalidMobileClass, setInvalidMobileClass] = useState("none");

    const setParentAnchorElNull = () => {
        setAnchorEl(null);
    };

    // removes the error message "Enter a valid Email" when the user clicks on the input field
    const changeEmailHandler = (event) => {
        setEmailId(event.target.value);
        setInvalidEmailClass("none");
    };

    // Removes the error message "Enter a valid Mobile Number" when the user clicks on the input field
    const changeMobileHandler = (e) => {
        setContactNo(e.target.value);
        setInvalidMobileClass("none");
    };



    const registerHandler = async (e) => {

        if (e) {
            e.preventDefault();
        }
        // Form Popover error Message "Please Fill out this field" in register form when the input field is empty.
        if (firstName === "") {
            setAnchorEl(e.currentTarget.children[0]);
            return;
        }
        if (lastName === "") {
            setAnchorEl(e.currentTarget.children[3]);
            return;
        }
        if (emailId === "") {
            setAnchorEl(e.currentTarget.children[6]);
            return;
        }
        if (password === "") {
            setAnchorEl(e.currentTarget.children[9]);
            return;
        }
        if (contactNo === "") {
            setAnchorEl(e.currentTarget.children[12]);
            return;
        }

        const emailPattern =
            /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\\.,;:\s@"]{2,})$/i;

        const mobilePattern = /^[6-9]\d{9}$/i;

        // when email is not valid, set invalidEmailClass to "block".
        if (!emailId.match(emailPattern)) {
            setInvalidEmailClass("block");
            return;
        } else {
            setInvalidEmailClass("none");
        }
        // when mobile number is not valid, set invalidMobileClass to "block".
        if (!contactNo.match(mobilePattern)) {
            setInvalidMobileClass("block");
            return;
        } else {
            setInvalidMobileClass("none");
        }

        let registerParameters = {
            emailId: emailId,
            firstName: firstName,
            lastName: lastName,
            mobile: contactNo,
            password: password,
        }


        try {
            const rawData = await fetch('/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(registerParameters)
            });
            const data = await rawData.json();
            if (rawData.status === 200) {
                setIsRegistered(true);
                setTimeout(function () {
                    setActivePage('LOGIN');
                }, 1000);
                setTimeout(function () {
                    setSuccessMessage('Registration Successful');
                }, 1000);

                await loginHandler(emailId, password);

            } else {
                alert(data.message || 'Something went wrong.. Please try again later...');
            }
        } catch (error) {
            console.error({ error: error.message });
            alert('Something went wrong.. Please try again later...');
        }

    };

    const loginHandler = async (username, password) => {
        try {
            const rawData = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    authorization: `Basic ${btoa(username + ':' + password)}`,
                    Accept: 'application/json;charset=UTF-8'
                },
            });
            const data = await rawData.json();
            if (rawData.status === 200) {
                window.sessionStorage.setItem('user-details', JSON.stringify(data));
                window.sessionStorage.setItem('access-token', data.accessToken);
                setUserLoggedIn(true);
                updateLoginModal(false);
            } else {
                alert(data.message || 'Something went wrong.. Please try again later...');
            }
        } catch (error) {
            console.error({ error: error.message });
            alert('Something went wrong.. Please try again later...');
        }
    };

    return (
        <div align="center" >
            { React.createElement(FormHeader, { activeHeader: 'REGISTER', activePage, setActivePage, setSuccessMessage }) }
            <br />
            <form onSubmit={registerHandler} autoComplete="off" noValidate>
                <FormControl required>
                    <InputLabel htmlFor="firstname">First Name</InputLabel>
                    <Input
                        type="text"
                        id="firstname"
                        onChange={e => setFirstName(e.target.value)}
                        value={firstName}
                    />
                    <FormPopoverError
                        anchor={anchorEl}
                        setParentAnchorElNull={setParentAnchorElNull}
                    />
                </FormControl>
                <br />
                <br />

                <FormControl required>
                    <InputLabel htmlFor="lastname">Last Name</InputLabel>
                    <Input
                        type="text"
                        id="lastname"
                        onChange={e => setLastName(e.target.value)}
                        value={lastName}
                    />
                    <FormPopoverError
                        anchor={anchorEl}
                        setParentAnchorElNull={setParentAnchorElNull}
                    />
                </FormControl>
                <br />
                <br />

                <FormControl required>
                    <InputLabel htmlFor="email">Email Id</InputLabel>
                    <Input
                        id="email"
                        type="email"
                        onChange={changeEmailHandler}
                        value={emailId}
                    />
                    {emailId.length >= 1 && invalidEmailClass === "block" && (
                        <FormHelperText className={invalidEmailClass}>
                            <span style={errorStyle}>Enter valid Email</span>
                        </FormHelperText>
                    )}
                    <FormPopoverError
                        anchor={anchorEl}
                        setParentAnchorElNull={setParentAnchorElNull}
                    />
                </FormControl>
                <br />
                <br />

                <FormControl required>
                    <InputLabel htmlFor="registrationPassword">Password</InputLabel>
                    <Input
                        type="password"
                        id="registrationPassword"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                    />
                    <FormPopoverError
                        anchor={anchorEl}
                        setParentAnchorElNull={setParentAnchorElNull}
                    />
                </FormControl>
                <br />
                <br />

                <FormControl required>
                    <InputLabel htmlFor="mobile">Mobile No.</InputLabel>
                    <Input
                        id="mobile"
                        type="number"
                        onChange={changeMobileHandler}
                        value={contactNo} />
                    {contactNo.length >= 1 && invalidMobileClass === "block" && (
                        <FormHelperText className={invalidMobileClass}>
                            <span style={errorStyle}>Enter valid mobile number</span>
                        </FormHelperText>
                    )}
                    <FormPopoverError
                        anchor={anchorEl}
                        setParentAnchorElNull={setParentAnchorElNull}
                    />
                </FormControl>
                <br />
                {isRegistered === true && (
                    <FormControl>
                        <span>Registration Successful.</span>
                    </FormControl>
                )}
                <br />
                <br />
                <Button variant="contained" color="primary" type="submit">
                    REGISTER
                </Button>
            </form>
            <br />
        </div>
    )
};