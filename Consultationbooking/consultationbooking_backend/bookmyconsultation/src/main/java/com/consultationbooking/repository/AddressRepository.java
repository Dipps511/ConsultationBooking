package com.consultationbooking.repository;

import com.consultationbooking.entity.Address;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;




//marked it as repository
@Repository
//created an interface AddressRepository that extends CrudRepository
public interface AddressRepository extends CrudRepository<Address, Integer> {

}
