package com.example.ci.SignUp;

import freemarker.cache.FileTemplateLoader;
import freemarker.template.Template;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;
import redis.clients.jedis.Jedis;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.Base64;

@SpringBootApplication
public class SignUpApplication {

	private static Jedis jedis;
	private static String continueUrl = "";

	public static void main(String[] args) {
		String redisHost = System.getenv("REDIS_HOST");
		String redisSsl = System.getenv("REDIS_SSL");
		String logPath = System.getenv("LOG_FILE");
		continueUrl = System.getenv("CONTINUE_URL");

		// Connect to REDIS
		try {
			jedis = new Jedis(redisHost, 6379, Boolean.parseBoolean(redisSsl));
			System.out.println("Redis connection created to " + redisHost + ", SSL is " + redisSsl);
		} catch (Exception e){
			System.out.println("Redis connection error to " + redisHost + ", SSL " + redisSsl + " is :" + e.getMessage());
		}
		try {
			System.setOut(new PrintStream(new FileOutputStream(logPath, true)));
			System.out.println("Sending STDOUT logs to " + logPath);
		} catch (Exception e){
			System.out.println("Logs output file error to " + logPath + " is :" + e.getMessage());
		}
		SpringApplication.run(SignUpApplication.class, args);
	}

	@Configuration

	@Controller
	public class SignUpWebController {

		@PostMapping("/signup")
		public String signup(@ModelAttribute SignUpRequest signUpRequest, RedirectAttributes attributes) {
			if(signUpRequest.getUsername().length() > 0 && signUpRequest.getPassword().length() > 0) {
				try {
					jedis.set(signUpRequest.getUsername(), signUpRequest.getPassword());
					attributes.addFlashAttribute("result", "Many thanks " + signUpRequest.getUsername() + ", your Sign up was successful.");
					attributes.addFlashAttribute("continue_url", continueUrl);
				} catch (Exception e) {
					attributes.addFlashAttribute("result", e.getMessage());
					attributes.addFlashAttribute("continue_url", "/signup");
				}
			} else {
				attributes.addFlashAttribute("result", "Please fill in username and password for signing up. Thanks!");
				attributes.addFlashAttribute("continue_url", "/signup");
			}
			return "redirect:/signupresult";
		}

		@GetMapping("/signup")
		public String signup(Model model) {
			model.addAttribute("title", "Sign Up");
			model.addAttribute("hdr_username", "Username");
			model.addAttribute("hdr_password", "Password");
			model.addAttribute("hdr_create_btn", "Sign Up");
			return "signup"; // returns the name of the FreeMarker template
		}

		@GetMapping("/signupresult")
		public String signupresult(@ModelAttribute("result") String result, @ModelAttribute("continue_url") String continue_url, Model model) {
			model.addAttribute("title", "Sign Up");
			model.addAttribute("result", result);
			model.addAttribute("continue_hdr", "Continue");
			model.addAttribute("continue_url", continue_url);
			return "signupresult"; // returns the name of the FreeMarker template
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
