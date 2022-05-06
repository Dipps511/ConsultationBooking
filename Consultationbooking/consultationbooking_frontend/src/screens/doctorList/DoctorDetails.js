import React, { useState, useEffect } from "react";
import { Typography} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import DetailsHeader from "../../common/header/ModalHeader";

export default function DoctorDetails({ id, setViewDetailsModalOpen }) {
    const [name, setName] = useState('');
    const [totalYearsOfExperience, setTotalYearsOfExperience] = useState(0);
    const [speciality, setSpeciality] = useState('');
    const [dob, setDob] = useState('');
    const [city, setCity] = useState('');
    const [emailId, setEmailId] = useState('');
    const [mobile, setMobile] = useState('');
    const [rating, setRating] = useState(0);

    useEffect(() => {
        (async function ViewDetailsDataOfDoctor() {
            if (!id) return null;
            try {
                const rawData = await fetch(`/doctors/${id}`, {
                    method: 'GET'
                });

                if (rawData.status === 200) {
                    const data = await rawData.json();
                    setName((data.firstName || '') + ' ' + (data.lastName || ''));
                    const totalYearsOFExperience = data.totalYearsOfExp + ' years';
                    setTotalYearsOfExperience(totalYearsOFExperience || '0 years');
                    setSpeciality(data.speciality || '');
                    setDob(data.dob || '');
                    setCity((data.address || {}).city || '');
                    setEmailId(data.emailId || '')
                    setMobile(data.mobile || '');
                    setRating(data.rating || 0);
                } else {
                    document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
                }
            } catch (error) {
                console.error({ error: error.message });
                document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
            }
        })();
    }, [id]);

    return (
        <div>
            <DetailsHeader title="Doctor Details" />
            <br />
            <Typography variant="h6">
                Dr: {name}
            </Typography>
            <br />
            <Typography>
                Total Experience: {totalYearsOfExperience}
                <br />
                Speciality: {speciality}
                <br />
                Date Of Birth: {dob}
                <br />
                City: {city}
                <br />
                Email: {emailId}
                <br />
                Mobile: {mobile}
                <br />
                Rating: <Rating
                    name="read-only"
                    value={rating}
                    readOnly
                />
            </Typography>
        </div>
    );
};