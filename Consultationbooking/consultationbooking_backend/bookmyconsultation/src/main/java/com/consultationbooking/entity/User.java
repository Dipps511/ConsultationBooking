package com.consultationbooking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;




//Mark it with Data, Entity, Builder, NoArgsConstructor, AllArgsConstructor
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
//created a class named User
public class User {
    //created firstName of type String
    private String firstName;
    //created lastName of type String
    private String lastName;
    //created dob of type String
    private String dob;
    //created mobile of type String
    private String mobile;
    //created primary key 'emailId' of type String
    @Id
    private String emailId;

    //created password of type String
    private String password;
    //created createdDate of type String
    private String createdDate;
    //created salt of type String
    private String salt;
}
	//all the mentioned members are private
