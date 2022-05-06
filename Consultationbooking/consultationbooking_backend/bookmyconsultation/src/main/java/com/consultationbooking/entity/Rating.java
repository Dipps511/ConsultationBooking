package com.consultationbooking.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrimaryKeyJoinColumn;
import java.util.UUID;




//marked this class as an 'entity class'
@Entity
//Used Data annotation to generate boilerplate code
@Data
//Used NoArgsConstructor annotation
@NoArgsConstructor
//created a class name Rating
public class Rating {
    //created a primary key called 'id' of type String
    @Id
    //initialised id with a UUID using UUID.randomUUID
    private String id = UUID.randomUUID().toString();
    //created appointmentId of type String
    private String appointmentId;
    //created doctorId of type String
    private String doctorId;
    //created rating of type Integer
    private Integer rating;
    //created comments of type String
    private String comments;
}
	//Set access modifiers for all these members to 'private'
	
