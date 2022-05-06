package com.consultationbooking.controller;

import com.consultationbooking.service.AppointmentService;
import com.consultationbooking.entity.Appointment;
import com.consultationbooking.exception.InvalidInputException;
import com.consultationbooking.exception.SlotUnavailableException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

	@Autowired
	private AppointmentService appointmentService;


	//created a method post method named bookAppointment with return type ReponseEntity
	//method has parameter of type Appointment, used RequestBody Annotation for mapping
	@PostMapping( produces = "application/json", consumes = "application/json")
	public ResponseEntity<String> bookAppointment(@RequestBody Appointment appointment) throws InvalidInputException, SlotUnavailableException {
		//save the appointment details to the database and save the response from the method used
		String newAppointment = appointmentService.appointment(appointment);

		//return http response using ResponseEntity
		return ResponseEntity.ok("Appointment booked successfully \n Appointment Id : " + newAppointment);

	}
	
	
	
	//created a get method named getAppointment with return type as ResponseEntity
		@GetMapping(value = "{appointmentsId}", produces = "application/json")
		//method has appointmentId of type String. Used PathVariable annotation to identity appointment using the parameter defined
	    public ResponseEntity<String> getAppointment(@PathVariable("appointmentsId") String appointmentsId) throws InvalidInputException {
			//get the appointment details using the appointmentId
            //save the response
			Appointment appointment = appointmentService.getAppointment(appointmentsId);


			//return the response as an http response
			return ResponseEntity.ok(appointment.toString());
		}
}