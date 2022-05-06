package com.consultationbooking.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class InvalidInputException extends Exception{
    private List<String> attributeNames;

    public InvalidInputException() {
        super("Invalid Input");
    }
}
