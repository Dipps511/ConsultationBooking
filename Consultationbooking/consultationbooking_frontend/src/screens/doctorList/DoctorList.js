import React, { useEffect, useState } from "react";
import {Typography, Button, Paper, MenuItem, Select} from "@material-ui/core";
import Modal from 'react-modal';
import Rating from '@material-ui/lab/Rating';
import BookAppointment from "./BookAppointment";
import DoctorDetails from "./DoctorDetails";


/* Styling of View Details modal */
const DoctorDetailsModalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        padding: "10px",
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

/* Styling of Book Appointment modal */
const bookAppointmentModalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: "40%",
        padding: "10px",
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};


export default function DoctorList(props) {
    /* State variables */
    const [specialityList, setSpecialityList] = useState([]);
    const [speciality, setSpeciality] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const { userAppointments, getUserAppointments } = props;

    /* open/close modal state */
    const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
    const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);

    useEffect(_ => {
        // Initial Loading of Specialities like CARDIOLOGIST, GENERAL_PHYSICIAN, DENTIST, PULMONOLOGIST, ENT, GASTRO
        (async _ => {
            try {
                const rawData = await fetch('/doctors/speciality', {
                    method: 'GET'
                });

                if (rawData.status === 200) {
                    const data = await rawData.json();
                    setSpecialityList(data);
                } else {
                    document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
                }
            } catch (error) {
                console.error({ error: error.message });
                document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
            }
        })();
    }, []);

    /* Fetching List of Doctor for a chosen Speciality */
    useEffect(_ => {
        (async _ => {
            try {
                let url = 'doctors';
                if (speciality) {
                    url += `?speciality=${speciality}`
                }
                const rawData = await fetch(url, {
                    method: 'GET'
                });

                if (rawData.status === 200) {
                    const data = await rawData.json();
                    setDoctors(data);
                } else {
                    document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
                }
            } catch (error) {
                console.error({ error: error.message });
                document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
            }
        })();
    }, [speciality]);

    return (
        <div className="selectSpeciality" align="center">
            <div id="msg"></div>
            <p>
                Select Speciality:
            </p>
            <Select
                variant="filled"
                labelId="speciality"
                id="speciality"
                value={speciality}
                style={{ minWidth: "200px" }}
                onChange={e => setSpeciality(e.target.value)}
            >
                <MenuItem key={"spec none"} value={""}>
                    <br/>
                </MenuItem>
                {specialityList.map((item) => (
                    <MenuItem key={"spec" + item} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>

            <Paper className="doctorsList"  >
                {
                    doctors.map(e =>
                        <Paper key={e.id}
                               align="left"
                               padding= "20px"
                               margin="15px"
                               cursor= "pointer"
                               className="doctorCard"
                    >
                            <div style={{ fontSize: 'x-large' }}>
                                Doctor Name: {e.firstName + ' ' + e.lastName}
                            </div>
                            <br />
                            <Typography className="doctorSpeciality">
                                Speciality: {e.speciality}
                            </Typography>
                            <Typography className="doctorRating">
                                Rating:
                                <Rating
                                    name="read-only"
                                    value={e.rating}
                                    readOnly
                                />
                            </Typography>
                            <div className="navigationButtons">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={_ => {
                                        setIsBookAppointmentModalOpen(true);
                                        setDoctorId(e.id);
                                    }}
                                >
                                    BOOK APPOINTMENT
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ background: 'green' }}
                                    onClick={_ => {
                                        setIsViewDetailsModalOpen(true);
                                        setDoctorId(e.id);
                                    }}
                                >
                                    VIEW DETAILS
                                </Button>
                            </div>
                        </Paper>
                    )
                }
            </Paper>
            <Modal
                style={DoctorDetailsModalStyle}
                isOpen={isViewDetailsModalOpen || false}
                ariaHideApp={false}
                appElement={document.getElementById('modal')}
                onRequestClose={_ => setIsViewDetailsModalOpen(false)}
            >
                <DoctorDetails id={doctorId} setViewDetailsModalOpen={setIsViewDetailsModalOpen} />
            </Modal>
            <Modal
                style= {bookAppointmentModalStyle}
                isOpen={isBookAppointmentModalOpen || false}
                ariaHideApp={false}
                appElement={document.getElementById('modal')}
                onRequestClose={_ => setIsBookAppointmentModalOpen(false)}
            >
                <BookAppointment userAppointments={userAppointments} getUserAppointments={getUserAppointments} doctorId={doctorId} setBookAppointmentModalOpen={setIsBookAppointmentModalOpen} />
            </Modal>
        </div>
    );
};