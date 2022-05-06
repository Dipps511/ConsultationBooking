package com.consultationbooking.service;

import com.consultationbooking.entity.Appointment;
import com.consultationbooking.exception.InvalidInputException;
import com.consultationbooking.exception.ResourceUnAvailableException;
import com.consultationbooking.exception.SlotUnavailableException;
import com.consultationbooking.repository.AppointmentRepository;
import com.consultationbooking.repository.UserRepository;
import com.consultationbooking.util.ValidationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

	
	
	//marked it autowired
	@Autowired
	//created an instance of AppointmentRepository called appointmentRepository
	private AppointmentRepository appointmentRepository;


	@Autowired
	private UserRepository userRepository;


	//created a method named appointment with the return type of String and parameter of type Appointment
	//declared exceptions 'SlotUnavailableException' and 'InvalidInputException'
	public String appointment (Appointment appointment) throws InvalidInputException, SlotUnavailableException{
		//validating the appointment details using the validate method from ValidationUtils class
		ValidationUtils.validate(appointment);
		//find if an appointment exists with the same doctor for the same date and time
		//if the appointment exists throw the SlotUnavailableException
		if(appointmentRepository.findByDoctorIdAndTimeSlotAndAppointmentDate(appointment.getDoctorId(), appointment.getTimeSlot(), appointment.getAppointmentDate()) != null) {
			throw new SlotUnavailableException();
		}
		//save the appointment details to the database
		appointmentRepository.save(appointment);
		//return the appointment id
		return appointment.getAppointmentId();

	}



	
	


	//created a method getAppointment of type Appointment with a parameter name appointmentId of type String
	public Appointment getAppointment(String appointmentId) throws ResourceUnAvailableException {
		//Use the appointmentid to get the appointment details from the database
		Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);
		//if the appointment is not found throw the ResourceUnAvailableException
		if(!appointment.isPresent()) {
			throw new ResourceUnAvailableException();
		}
		//return the appointment details
		return appointment.get();
	}

		//if the appointment exists return the appointment
		//else throw ResourceUnAvailableException
		//tip: use Optional.ofNullable(). Use orElseThrow() method when Optional.ofNullable() throws NULL
	
	public List<Appointment> getAppointmentsForUser(String userId) {
		return appointmentRepository.findByUserId(userId);
	}
}
