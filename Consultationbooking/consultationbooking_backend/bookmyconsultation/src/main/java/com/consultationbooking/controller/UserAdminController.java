package com.consultationbooking.controller;

import com.consultationbooking.entity.User;
import com.consultationbooking.exception.InvalidInputException;
import com.consultationbooking.service.AppointmentService;
import com.consultationbooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/users")
public class UserAdminController {

	@Autowired
	private UserService userService;

	@Autowired
	private AppointmentService appointmentService;


	@GetMapping(path = "/{id}")
	public ResponseEntity<User> getUser(@RequestHeader("authorization") String accessToken,
                                        @PathVariable("id") final String userUuid) {
		final User User = userService.getUser(userUuid);
		return ResponseEntity.ok(User);
	}
	
	//created a post method named createUser with return type as ResponseEntity
	@PostMapping(value = "/register", consumes = "application/json", produces = "application/json")
		//define the method parameter user of type User. Set it final. Use @RequestBody for mapping.
	public ResponseEntity<User> createUser(@RequestBody final User user) throws InvalidInputException {
		//declare InvalidInputException using throws keyword
		
		//register the user
		final User createdUser = userService.register(user);
//		User createdUser = userService.register(user);
		//return http response with status set to OK
		return new ResponseEntity<User>(createdUser, HttpStatus.OK);
	}
	
	


	@GetMapping("/{userId}/appointments")
	public ResponseEntity getAppointmentForUser(@PathVariable("userId") String userId) {
		return ResponseEntity.ok(appointmentService.getAppointmentsForUser(userId));
	}


}
