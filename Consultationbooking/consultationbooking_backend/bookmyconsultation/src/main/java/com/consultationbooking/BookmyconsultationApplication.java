package com.consultationbooking;

import com.consultationbooking.config.ApiConfiguration;
import com.consultationbooking.config.WebConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import({ApiConfiguration.class, WebConfiguration.class})
public class BookmyconsultationApplication {
	public static void main(String[] args) {
		SpringApplication.run(BookmyconsultationApplication.class, args);
	}

}
