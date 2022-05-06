import React, { useState } from "react";
import { ValidatorForm } from 'react-material-ui-form-validator';
import {Button, FormHelperText, TextField} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import "../../common/common.css";

import RateAppointmentHeader from "../../common/header/ModalHeader";

const headerStyle = {
    margin: '-20px -10px 0px -10px'
}

export default function RateAppointment({  setRatingModalOpen, appointmentId, doctorId }) {


    /* State variables */
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState('');
    const [ratingError, setRatingError] = useState("None");

    const handleRatingChange = (event, newValue) => {
        setRating(newValue);
        setRatingError("None");
    };

    /* Submit the Rating */
    async function submitRating(comments, rating, appointmentId, doctorId) {

        if (rating === 0) {
            setRatingError("block");
            return;
        }
        else{
            setRatingError("None");
        }

        try {
            let userDetails = sessionStorage.getItem('user-details');
            if (userDetails) {
                JSON.parse(userDetails);
            } else return;

            const rawData = await fetch(`/ratings`, {
                method: 'POST',
                body: JSON.stringify({
                    "appointmentId": appointmentId,
                    "doctorId": doctorId,
                    "rating": rating,
                    "comments": comments
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access-token')}`
                }
            });

            if (rawData.status !== 200)
                throw new Error('Rating could not be submitted');

            setRatingModalOpen(false);
        } catch (error) {
            console.log(error);
            alert('Something went wrong. Rating could not be submitted');
        }
    };

    return (
        <div style={headerStyle}>
            <RateAppointmentHeader style={headerStyle} title="Rate an Appointment" />

            <ValidatorForm id="rate-appointment" onSubmit={() => { }} onError={errors => console.error(errors)}>
                <br />
                <TextField
                    label="Comments"
                    name="comments"
                    rows={3}
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                />
                <br />
                <br />
                Rating: <Rating
                    name="appointmentRating"
                    value={rating}
                    onChange={handleRatingChange}
                />
                <br />
                {rating === 0 && ratingError==='block' &&
                (<FormHelperText style={{ color: 'red' }}> Select a rating </FormHelperText>)}

                <Button
                    variant="contained"
                    color="primary"
                    style={{
                        margin: '15px 0',
                        width: '80%'
                    }}
                    onClick={() => submitRating(comments, rating, appointmentId, doctorId)}
                >
                    Rate Appointment
                </Button>
            </ValidatorForm>
        </div>
    );
};