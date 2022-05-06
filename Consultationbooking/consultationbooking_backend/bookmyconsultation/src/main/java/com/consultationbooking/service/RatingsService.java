package com.consultationbooking.service;

import com.consultationbooking.repository.DoctorRepository;
import com.consultationbooking.repository.RatingsRepository;
import com.consultationbooking.entity.Doctor;
import com.consultationbooking.entity.Rating;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
public class RatingsService {

	@Autowired
	private ApplicationEventPublisher publisher;

	@Autowired
	private RatingsRepository ratingsRepository;

	@Autowired
	private DoctorRepository doctorRepository;

	
	//created a method name submitRatings with void return type and parameter of type Rating
	public void submitRatings(Rating rating) {
		//set a UUID for the rating
		rating.setId(UUID.randomUUID().toString());
		//save the rating to the database
		ratingsRepository.save(rating);
		//get the doctor id from the rating object
		String doctorId = rating.getDoctorId();
		//find that specific doctor with the using doctor id
		Doctor doctor = doctorRepository.findById(doctorId).get();
		//modify the average rating for that specific doctor by including the new rating
		double newAverageRating = (doctor.getRating() * ratingsRepository.findByDoctorId(doctor.getId()).size() + rating.getRating()) / (ratingsRepository.findByDoctorId(doctor.getId()).size() + 1);
		//save the doctor object to the database
		doctor.setRating(newAverageRating);
		doctorRepository.save(doctor);
	}
}
