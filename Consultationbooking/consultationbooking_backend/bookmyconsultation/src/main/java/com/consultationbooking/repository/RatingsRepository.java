package com.consultationbooking.repository;

import com.consultationbooking.entity.Rating;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;




//marked it as repository
@Repository
//created an interface RatingsRepository that extends CrudRepository
public interface RatingsRepository extends CrudRepository<Rating, String> {
	//created a method findByDoctorId that returns a list of type Rating
	//defined method parameter doctorId of type String
    List<Rating> findByDoctorId(String doctorId);
}