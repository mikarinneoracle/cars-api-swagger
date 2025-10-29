package com.example.ci.SignUp;

import freemarker.cache.FileTemplateLoader;
import freemarker.template.Template;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
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
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Enumeration;

@SpringBootApplication
public class SignUpApplication {

	private static Jedis jedis;
	private static String continueUrl = "";

	public static void main(String[] args) {
		String redisHost = System.getenv("REDIS_HOST");
		String redisSsl = System.getenv("REDIS_SSL");
		String logFile = System.getenv("LOG_FILE");
		continueUrl = System.getenv("CONTINUE_URL");

		System.out.println("REDIS_HOST:" + redisHost);
		System.out.println("REDIS_SSL:" + redisSsl);
		System.out.println("LOG_FILE:" + logFile);
		System.out.println("CONTINUE_URL:" + continueUrl);

		// Connect to REDIS
		try {
			jedis = new Jedis(redisHost, 6379, Boolean.parseBoolean(redisSsl));
			System.out.println("Redis connection created to " + redisHost + ", SSL is " + redisSsl);
		} catch (Exception e){
			System.out.println("Redis connection error to " + redisHost + ", SSL " + redisSsl + " is :" + e.getMessage());
		}
		System.out.println("Sending STDOUT logs to " + logFile);
		try {
			System.setOut(new PrintStream(new FileOutputStream(logFile, true)));
		} catch (Exception e){
			System.out.println("Logs output error to " + logFile + " is :" + e.getMessage());
		}
		SpringApplication.run(SignUpApplication.class, args);
	}

	@Configuration

	@Controller
	public class SignUpWebController {

		@PostMapping("/signup/start")
		public String signup(HttpServletRequest request, HttpServletResponse response, @ModelAttribute SignUpRequest signUpRequest, RedirectAttributes attributes) {
			if(signUpRequest.getUsername().length() > 0 && signUpRequest.getPassword().length() > 0) {
				try {
					jedis.set(signUpRequest.getUsername(), signUpRequest.getPassword());
					System.out.println("Signup successful for " + signUpRequest.getUsername());
					attributes.addFlashAttribute("result", "Your sign up was successful!");
					attributes.addFlashAttribute("continue_url", continueUrl);
					attributes.addFlashAttribute("continue_target", "_top"); // Replace from iframe to top level browser
				} catch (Exception e) {
					attributes.addFlashAttribute("result", e.getMessage());
					attributes.addFlashAttribute("continue_url", "/signup/start");
					attributes.addFlashAttribute("continue_target", "");
				}
			} else {
				attributes.addFlashAttribute("result", "Please fill in username and password for signing up.");
				attributes.addFlashAttribute("continue_url", "/signup/start");
				attributes.addFlashAttribute("continue_target", "");
			}

			String bearer = signUpRequest.getUsername() + ":" + signUpRequest.getPassword();
			String encodedBearer = Base64.getEncoder().encodeToString(bearer.getBytes(StandardCharsets.UTF_8));
			Cookie cookie = new Cookie("bearer", encodedBearer);
			//cookie.setHttpOnly(true);
			//cookie.setSecure(true);
			response.addCookie(cookie);
			String origin = request.getHeader("origin") != null ? request.getHeader("origin") : "";
			return "redirect:" + origin + "/signup/result";
		}

		@GetMapping("/signup/start")
		public String signup(Model model) {
			model.addAttribute("hdr_username", "Username");
			model.addAttribute("hdr_password", "Password");
			model.addAttribute("hdr_create_btn", "Sign Up");
			return "signup"; // returns the name of the FreeMarker template
		}

		@GetMapping("/signup/result")
		public String signupresult(@ModelAttribute("result") String result,
								   @ModelAttribute("continue_url") String continue_url,
								   @ModelAttribute("continue_target") String continue_target,
								   Model model) {
			model.addAttribute("result", result);
			model.addAttribute("continue_hdr", "Continue");
			model.addAttribute("continue_url", continue_url);
			model.addAttribute("continue_target", continue_target);
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
