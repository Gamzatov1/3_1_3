package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repo.UserRepo;
import ru.kata.spring.boot_security.demo.service.RoleService;

import java.util.Optional;

@Component
public class DataInit implements CommandLineRunner {

    private final UserRepo userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInit(UserRepo userRepository, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Initializing data...");

        Role adminRole = createRoleIfNotExists("ROLE_ADMIN");
        Role userRole = createRoleIfNotExists("ROLE_USER");

        createUserIfNotExists("admin", "admin", 30, "admin", "admin@mail.ru", adminRole);
        createUserIfNotExists("user", "user", 25, "user", "user@mail.ru", userRole);
    }

    private Role createRoleIfNotExists(String roleName) {
        Optional<Role> existingRole = roleService.findByName(roleName);
        if (existingRole.isPresent()) {
            return existingRole.get();
        } else {
            Role newRole = new Role();
            newRole.setName(roleName);
            return roleService.save(newRole);
        }
    }

    private void createUserIfNotExists(String username, String lastName, Integer age, String password, String email, Role role) {
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setLastName(lastName);
            user.setAge(age);
            user.setPassword(passwordEncoder.encode(password));
            user.setEmail(email);
            user.getRoles().add(role);
            userRepository.save(user);
        }
    }
}