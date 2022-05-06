import React, { useState } from "react";
import {Button, FormControl, FormHelperText, Input, InputLabel} from '@material-ui/core';
import FormPopoverError from "../../common/FormPopoverError";
import FormHeader from '../formHeader/FormHeader';


export default function LoginForm({ setUserLoggedIn, updateLoginModal, activePage, setActivePage, setSuccessMessage, deactivateModal }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidEmailClass, setInvalidEmailClass] = useState("none");
    const [anchorEl, setAnchorEl] = useState(null);

    const errorStyle = {
        color: 'red',
    }

    const login = async (e) => {
        if (e) e.preventDefault();
        // validate data

        if (username === "") {
            setAnchorEl(e.currentTarget.children[0]);
            return;
        }
        if (password === "") {
            setAnchorEl(e.currentTarget.children[2]);
            return;
        }
        const emailPattern =
            /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\\.,;:\s@"]{2,})$/i;

        if (!username.match(emailPattern)) {
            setInvalidEmailClass("block");
            return;
        } else {
            setInvalidEmailClass("none");
        }
        await loginHandler(username, password);
    };

    /* Handler for login */
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
    }

    const changeEmailHandler = (event) => {
        setUsername(event.target.value);
        setInvalidEmailClass("none");
    };


    const changePasswordHandler = (event) => {
        setPassword(event.target.value);
    };

    const setParentAnchorElNull = () => {
        setAnchorEl(null);
    };

    return (
        <div align="center">
            { React.createElement(FormHeader, { activeHeader: 'LOGIN', activePage, setActivePage, setSuccessMessage }) }
            <br />
            <div>
                <form noValidate autoComplete="off" onSubmit={login}>
                    <FormControl required margin="dense">
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input
                            id="email"
                            value={username}
                            type="email"
                            onChange={changeEmailHandler}
                            validators={['required', 'isEmail']}

                        />
                        {username.length >= 1 && invalidEmailClass === "block" && (
                            <FormHelperText className={invalidEmailClass}>
                                <span className="red" style={errorStyle} >Enter valid Email</span>
                            </FormHelperText>
                        )}

                        <FormPopoverError
                            anchor={anchorEl}
                            setParentAnchorElNull={setParentAnchorElNull}
                        />

                    </FormControl>
                    <br />
                    <FormControl required margin="dense">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={changePasswordHandler}
                        />
                        <FormPopoverError
                            anchor={anchorEl}
                            setParentAnchorElNull={setParentAnchorElNull}
                        />
                    </FormControl>
                    <br />
                    <br />
                    <br />
                    <Button variant="contained" color="primary" type="submit">
                        LOGIN
                    </Button>
                    <br/>
                    <br/>
                    <br/>
                </form>
            </div>
        </div>
    )
};