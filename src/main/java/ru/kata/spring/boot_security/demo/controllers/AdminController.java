package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String getUsers(Model model) {
        model.addAttribute("users", userService.allUsers());
        model.addAttribute("user", userService.UserInfo());
        model.addAttribute("editUser", new User());
        return "users";
    }

    @GetMapping(value = "/new")
    public String newUser(Model model) {
        model.addAttribute("newUser", new User());
        model.addAttribute("user", userService.UserInfo());
        return "newUser";
    }

    @PostMapping("/new")
    public String createUser(@ModelAttribute("newUser") User user, @RequestParam(value = "role") Set<Role> roles) {
        userService.saveUser(userService.createUser(user, roles));
        return "redirect:/admin";
    }

    @PostMapping("/update")
    public String update(@ModelAttribute("user") User user, @RequestParam("id") Long id, @RequestParam(value = "role", required = false) Set<Role> roles) {
        if (user.getPassword() != null && user.getPassword().trim().isEmpty()) {
            user.setPassword(null);
        }
        if (roles != null) {
            user.setRoles(roles);
        }
        userService.updateUser(id, user);
        return "redirect:/admin";
    }

    @GetMapping(value = "/delete")
    public String delete(@RequestParam("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}