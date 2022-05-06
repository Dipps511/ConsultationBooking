import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import DoctorList from "../doctorList/DoctorList";
import Appointments from "../appointment/Appointment"
import Header from "../../common/header/Header";
import "./Home.css";

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function Home(props) {

    const [isLoggedIn, setIsLoggedIn] = useState(window.sessionStorage.getItem('access-token') !== null);
    const [value, setValue] = React.useState(0);
    const [userAppointments, setUserAppointments] = useState([]);
    const [activePage, setActivePage] = React.useState('DOCTORS');

    const changeHandler = (event, newValue) => {
        setValue(newValue);
    };

    const getUserAppointments = (async _ => {
        try {
            let userDetails = sessionStorage.getItem('user-details');
            if (userDetails) {
                userDetails = JSON.parse(userDetails);
            }
            else
                return;

            const userEmail = userDetails.id;
            const rawData = await fetch(`/users/${userEmail}/appointments`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('access-token')}`
                }
            });

            if (rawData.status === 200) {
                const data = await rawData.json();
                setUserAppointments(data);
            } else {
                document.getElementById('errorMsg').innerHTML = '<br /><span style="color:red">Something went wrong.</span><br />';
            }
        } catch (error) {
            console.error({ error: error.message });
            document.getElementById('errorMsg').innerHTML = '<br /><span style="color:red">Something went wrong.</span><br />';
        }
    });

    /* Rendering Doctors/ Appointments Tab*/
    let activeTab;
    if (activePage === 'DOCTORS') {
        activeTab = <DoctorList {...props} userAppointments={userAppointments} getUserAppointments={getUserAppointments} userLoggedIn={isLoggedIn} setUserLoggedIn={setIsLoggedIn} />
    }
    else if (activePage === 'APPOINTMENTS') {
        activeTab = <Appointments {...props} userAppointments={userAppointments} getUserAppointments={getUserAppointments} setUserAppointments={setUserAppointments} userLoggedIn={isLoggedIn} setUserLoggedIn={setIsLoggedIn} />;
    }

    return (
        <div>
            <Header {...props} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={changeHandler}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab onClick={() => setActivePage('DOCTORS')} label="DOCTORS" {...a11yProps(0)} />
                    <Tab onClick={() => setActivePage('APPOINTMENTS')} label="APPOINTMENTS" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            {activeTab}
        </div>
    );
};