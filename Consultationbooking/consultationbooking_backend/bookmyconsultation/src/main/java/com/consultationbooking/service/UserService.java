package com.consultationbooking.service;


import com.consultationbooking.entity.User;
import com.consultationbooking.exception.ResourceUnAvailableException;
import com.consultationbooking.provider.PasswordCryptographyProvider;
import com.consultationbooking.repository.UserRepository;
import com.consultationbooking.util.ValidationUtils;
import com.consultationbooking.exception.InvalidInputException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
	private final UserRepository userRepository;

	@Autowired
	private PasswordCryptographyProvider passwordCryptographyProvider;


	public User register(User user) throws InvalidInputException {
		ValidationUtils.validate(user);

		user.setCreatedDate(LocalDate.now().toString());
		encryptPassword(user);
		userRepository.save(user);
		return user;
	}

	public User getUser(String id) {
		return Optional.ofNullable(userRepository.findById(id))
				.get()
				.orElseThrow(ResourceUnAvailableException::new);
	}

	//created a method named getAllUsers that returns a List of type User
	public List<User> getAllUsers() {
		//return all the users from the database
		return userRepository.findAll();
	}

	

	private void encryptPassword(final User newUser) {

		String password = newUser.getPassword();
		final String[] encryptedData = passwordCryptographyProvider.encrypt(password);
		newUser.setSalt(encryptedData[0]);
		newUser.setPassword(encryptedData[1]);
	}
}
