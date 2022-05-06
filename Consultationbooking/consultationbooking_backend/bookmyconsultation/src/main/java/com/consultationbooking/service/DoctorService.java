package com.consultationbooking.service;

import com.consultationbooking.entity.Address;
import com.consultationbooking.enums.Speciality;
import com.consultationbooking.exception.InvalidInputException;
import com.consultationbooking.exception.ResourceUnAvailableException;
import com.consultationbooking.model.TimeSlot;
import com.consultationbooking.repository.AddressRepository;
import com.consultationbooking.repository.AppointmentRepository;
import com.consultationbooking.repository.DoctorRepository;
import com.consultationbooking.util.ValidationUtils;
import com.consultationbooking.entity.Doctor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import springfox.documentation.annotations.Cacheable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Log4j2
@Service
public class DoctorService {
	@Autowired
	private AppointmentRepository appointmentRepository;
	@Autowired
	private DoctorRepository doctorRepository;
	@Autowired
	private AddressRepository addressRepository;

	
	//created a method register with return type and parameter of typeDoctor
	//declared InvalidInputException for the method
	public Doctor register(Doctor doctor) throws InvalidInputException {
		//validating the doctor details
		ValidationUtils.validate(doctor);

		//if address is null throw InvalidInputException
		if (doctor.getAddress() == null) {
			throw new InvalidInputException();
		}

		//set UUID for doctor using UUID.randomUUID.
		doctor.setId(UUID.randomUUID().toString());

		//if speciality is null
		if (doctor.getSpeciality() == null) {
			//set speciality to Speciality.GENERAL_PHYSICIAN
			doctor.setSpeciality(Speciality.GENERAL_PHYSICIAN);
		}

		//Create an Address object, initialise it with address details from the doctor object
		Address address = doctor.getAddress();

		//set the id of the address object to UUID.randomUUID
		address.setId(UUID.randomUUID().toString());

		//Save the address object to the database. Store the response.
		address = addressRepository.save(address);

		//Set the address in the doctor object with the response
		doctor.setAddress(address);

		//save the doctor object to the database
		doctor = doctorRepository.save(doctor);

		//return the doctor object
		return doctor;
	}
	
	
	//created a method name getDoctor that returns object of type Doctor and has a String paramter called id
		public Doctor getDoctor(String id) throws ResourceUnAvailableException {
		//if id is null throw ResourceUnAvailableException
		if (id == null) {
			throw new ResourceUnAvailableException();
		}
		//Find the doctor object with the id
		Optional<Doctor> doctor = doctorRepository.findById(id);
		//if doctor is null throw ResourceUnAvailableException
		if (!doctor.isPresent()) {
			throw new ResourceUnAvailableException();
		}
		//return the doctor object
		return doctor.get();
	}

	

	public List<Doctor> getAllDoctorsWithFilters(String speciality) {

		if (speciality != null && !speciality.isEmpty()) {
			return doctorRepository.findBySpecialityOrderByRatingDesc(Speciality.valueOf(speciality));
		}
		return getActiveDoctorsSortedByRating();
	}

	@Cacheable(value = "doctorListByRating")
	private List<Doctor> getActiveDoctorsSortedByRating() {
		log.info("Fetching doctor list from the database");
		return doctorRepository.findAllByOrderByRatingDesc()
				.stream()
				.limit(20)
				.collect(Collectors.toList());
	}

	public TimeSlot getTimeSlots(String doctorId, String date) {

		TimeSlot timeSlot = new TimeSlot(doctorId, date);
		timeSlot.setTimeSlot(timeSlot.getTimeSlot()
				.stream()
				.filter(slot -> {
					return appointmentRepository
							.findByDoctorIdAndTimeSlotAndAppointmentDate(timeSlot.getDoctorId(), slot, timeSlot.getAvailableDate()) == null;

				})
				.collect(Collectors.toList()));

		return timeSlot;

	}
}
