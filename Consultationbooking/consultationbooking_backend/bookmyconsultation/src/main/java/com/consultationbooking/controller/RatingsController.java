package com.consultationbooking.controller;

import com.consultationbooking.entity.Rating;
import com.consultationbooking.service.RatingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class RatingsController {

	@Autowired
	private RatingsService ratingsService;


	//created a post method named submitRatings with return type as ResponseEntity
	//defined the method parameter rating of type Rating, used @RequestBody for mapping
	@PostMapping(value = "/ratings", produces = "application/json", consumes = "application/json")
	public ResponseEntity<Object> submitRatings(@RequestBody Rating rating) {
		
		//submit the ratings
		ratingsService.submitRatings(rating);

		//return http response with status set to OK
		return ResponseEntity.ok().build();
}
}
