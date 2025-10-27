package com.example.ci.SignUp;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;

import java.util.Base64;

@SpringBootApplication
public class SignUpApplication {

	private static Jedis jedis;

	public static void main(String[] args) {
		if(args.length > 1) {
			jedis = new Jedis(args[0], 6379, Boolean.parseBoolean(args[1]));
			System.out.println("Redis connection created to " + args[0] + ":" + args[1]);
		}
		SpringApplication.run(SignUpApplication.class, args);
	}

	@RestController
	@RequestMapping("/api")
	public class SignUpController {

		@PostMapping("/signup")
		public String signup(@ModelAttribute SignUpRequest signUpRequest) {
			try {
				jedis.set(signUpRequest.getUsername(), signUpRequest.getPassword());
				return "Signup successful " + signUpRequest.getUsername();
			} catch (Exception e)
			{
				return e.getMessage();
			}
		}
	}

	public static class SignUpRequest {
		private String username;
		private String password;
		// Getters and setters
		public String getUsername() {
			return username;
		}
		public void setUsername(String username) {
			this.username = username;
		}
		public String getPassword() {
			return password;
		}
		public void setPassword(String password) {
			this.password = password;
		}
	}
}
