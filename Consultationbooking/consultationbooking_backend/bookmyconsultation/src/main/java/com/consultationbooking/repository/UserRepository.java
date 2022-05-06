package com.consultationbooking.repository;

import com.consultationbooking.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<User, String> {

	@Override
	List<User> findAll();

	//specified a method that returns User by finding it by email id
	User findByEmailId(String emailId);


}
