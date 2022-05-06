import React, { useEffect, useState } from "react";
import {Button, Paper, Typography} from "@material-ui/core";
import Modal from 'react-modal';
import RateAppointment from "./RateAppointment";

/* Styling for the Modal */
const modalStyle = {
    content: {
        top: '50%',
        right: 'auto',
        left: '50%',
        bottom: 'auto',
        width: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export default function Appointments(props) {
    /* State variables */
    const [appointmentId, setAppointmentId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const { userAppointments, getUserAppointments } = props;
    const [isRatingModalOpen, setIsIsRatingModalOpen] = useState(false);

    /* set user as logged in if the access token is not null */
    const isLoggedIn = () => sessionStorage.getItem('access-token') != null;


    useEffect(_ => {
        // Get List of user Appointments
        if (isLoggedIn()) {
            getUserAppointments();
        }
        // eslint-disable-next-line
    }, [props.userLoggedIn]);


    let showAppointments = <h4> Login to see appointments</h4>;
    if (isLoggedIn()) {
        showAppointments = <div>
            {
                userAppointments.map(e =>
                    <Paper className="appointmentCard" align="left" key={e.appointmentId}>
                    <Typography variant="h5" component="h5">
                        Dr: {e.doctorName}
                    </Typography>
                    <br />
                    <Typography className="appointmentDetails">
                        Date: {e.appointmentDate}
                        <br />
                        Symptoms: {e.symptoms}
                        <br />
                        Prior Medical History: {e.priorMedicalHistory}
                    </Typography>
                    <br />
                    <Button
                        className="rateAppointmentButton"
                        variant="contained"
                        color="primary"
                        onClick={_ => { setAppointmentId(e.appointmentId);
                            setDoctorId(e.doctorId);
                            setIsIsRatingModalOpen(true);}
                        }
                    >
                        RATE APPOINTMENT
                    </Button>
                </Paper>)
            }
        </div>;
    }



    return (
        <div align="center">
            <div id="errorMsg"></div>
            { showAppointments }
            <Modal
                style={modalStyle}
                isOpen={isRatingModalOpen}
                ariaHideApp={false}
                appElement={document.getElementById('modal')}
                onRequestClose={_ => setIsIsRatingModalOpen(false)}

            >
                <RateAppointment {...props} setRatingModalOpen={setIsIsRatingModalOpen} appointmentId={appointmentId} doctorId={doctorId} />
            </Modal>
        </div>
    );
};