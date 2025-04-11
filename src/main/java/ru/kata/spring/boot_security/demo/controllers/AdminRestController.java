package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final UserService userService;

    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.allUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user, @RequestParam(value = "roles") Set<Role> roles) {
        return ResponseEntity.ok(userService.saveUser(userService.createUser(user, roles)));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user, 
                                         @RequestParam(value = "roles", required = false) Set<Role> roles) {
        if (user.getPassword() != null && user.getPassword().trim().isEmpty()) {
            user.setPassword(null);
        }
        if (roles != null) {
            user.setRoles(roles);
        }
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
} 