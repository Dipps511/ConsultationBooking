import React, { useEffect, useState } from "react";
import {
    Button,
    CardContent,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import BookAnAppointmentHeader from "../../common/header/ModalHeader";


export default function BookAppointment({ props, userAppointments, setBookAppointmentModalOpen, doctorId: id }) {
    const [doctorName, setDoctorName] = useState('');
    const [selectedDate, handleDateChange] = useState(new Date());
    const [timeSlot, setTimeSlot] = useState('None');
    const [timeSlots, setTimeSlots] = useState([]);
    const [medicalHistory, setMedicalHistory] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [slotRequiredClass, setSlotRequiredClass] = useState("none");
    // const currentUserAppointments = userAppointments;

    const slotChangeHandler = (e) => {
        setTimeSlot(e.target.value);
        setSlotRequiredClass("none");
    };

    // Check if user already has appointment for the same date and same time
    // const existingBooking = currentUserAppointments.filter((appt) => {
    //     if (
    //         appt.appointmentDate === selectedDate
    //         && appt.timeSlot === timeSlot
    //     ) {
    //         return appt;
    //     }
    //     return appt;
    // });
    //
    // if (existingBooking.length > 0) {
    //     alert("Either the slot is already booked or not available");
    //     return;
    // }


    useEffect(() => {
        // Doctor Details
        (async function getViewDetailsData() {
            if (!id) return null;

            try {
                const rawData = await fetch(`/doctors/${id}`, {
                    method: 'GET'
                });

                if (rawData.status === 200) {
                    const data = await rawData.json();
                    setDoctorName((data.firstName || '') + ' ' + (data.lastName || ''));
                } else {
                    document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
                }
            } catch (error) {
                console.error({ error: error.message });
                document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
            }
            await getDoctorTimeSlotsByDate(new Date());
        })();
        // eslint-disable-next-line
    }, []);

    // Doctor Time Slots by Date
    async function getDoctorTimeSlotsByDate(selectedDate) {
        if (!id) return null;

        try {
            const rawData = await fetch(`/doctors/${id}/timeSlots?date=${
                require('moment')(
                    new Date(selectedDate) || new Date()
                ).format('YYYY-MM-DD')
            }`, {
                method: 'GET'
            });

            if (rawData.status === 200) {
                const data = await rawData.json();
                if (!data || (data.timeSlot || []).length === 0) {
                    return;
                }
                setTimeSlots(data.timeSlot)
            } else {
                document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
            }
        } catch (error) {
            console.error({ error: error.message });
            document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
        }

    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (
            timeSlot === "" ||
            timeSlot == null ||
            timeSlot === "None"
        ) {
            setSlotRequiredClass("block");
            return;
        }


        try {
            let userDetails = sessionStorage.getItem('user-details');
            if (userDetails) {
                userDetails = JSON.parse(userDetails);
            } else {
                alert('Please login');
                return;
            }

            const moment = require('moment');
            const rawData = await fetch(`/appointments`, {
                method: 'POST',
                body: JSON.stringify({
                    "doctorId": id,
                    "doctorName": doctorName,
                    "userId": userDetails.id,
                    "userName": userDetails.firstName + ' ' + userDetails.lastName,
                    "userEmailId": userDetails.id,
                    "timeSlot": timeSlot,
                    // "timeSlot": "08PM-09PM",
                    // "timeSlot": moment(new Date(timeSlot)).format('YYYY-MM-DD'),
                    "appointmentDate": moment(selectedDate).format('YYYY-MM-DD'),
                    "createdDate": moment(new Date()).format('YYYY-MM-DD'),
                    "symptoms": symptoms,
                    "priorMedicalHistory": medicalHistory
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access-token')}`
                }
            });
            // console.log(rawData.status);
            // console.log(timeSlot);
            if (rawData.status !== 200)
                throw new Error('Slot unavailable exception');
            else {
                alert('The appointment has been booked!');
                setBookAppointmentModalOpen(false);
            }
        } catch (error) {
            console.log(error);
            alert('Either the slot is already booked or not available');
        }
    };


    return (
        <div>
            <div className="bookingModal">
                <BookAnAppointmentHeader title="Book an Appointment" />

                <CardContent key={id}>
                    <form noValidate autoComplete="off" onSubmit={submitHandler}>
                        <div>
                            <TextField
                                disabled
                                id="standard-disabled"
                                label="DoctorName"
                                required
                                value={doctorName}
                            />
                        </div>
                        <div>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Date picker inline"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                    }}
                                />
                            </MuiPickersUtilsProvider>

                        </div>
                        <div>
                            <FormControl>
                                <InputLabel id="timeSlotInput" style={{
                                    width: '400%'
                                }}> Timeslot </InputLabel>
                                <br/>
                                <br/>
                                <Select
                                    style={{
                                        width: '100%'
                                    }}
                                    labelId="timeSlotInput"
                                    id="timeSlotInput"
                                    value={timeSlot}
                                    onChange={slotChangeHandler}
                                >
                                    <MenuItem value="None">
                                        <em>None</em>
                                    </MenuItem>
                                    {/* <MenuItem value="08PM-09PM">*/}
                                    {/*  <em>08PM-09PM</em>*/}
                                    {/*</MenuItem> */}
                                    {timeSlots.map((slot, key) => (
                                        <MenuItem key={key} value={slot}>
                                            {slot}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {slotRequiredClass==='block' && (<FormHelperText className={slotRequiredClass}>
                                    <span style={{color:'red'}}>Select a time slot</span>
                                </FormHelperText>)}
                            </FormControl>
                        </div>
                        <br/>
                        <div>
                            <FormControl>
                                <TextField
                                    id="standard-multiline-static"
                                    label="Medical History"
                                    multiline
                                    rows={3}
                                    value={medicalHistory}
                                    onChange={(e) => setMedicalHistory(e.target.value)}
                                />
                            </FormControl>
                        </div>
                        <br/>
                        <div>
                            <FormControl>
                                <TextField
                                    id="standard-multiline-static"
                                    label="Symptoms"
                                    multiline
                                    rows={3}
                                    value={symptoms}
                                    placeholder="ex.Cold, Swelling, etc"
                                    onChange={(e) => setSymptoms(e.target.value)}
                                />
                            </FormControl>
                        </div>
                        <br />
                        <Button
                            id="bookappointment"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Book Appointment
                        </Button>
                    </form>
                </CardContent>
            </div>
        </div>
    );
};