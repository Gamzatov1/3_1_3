package ru.kata.spring.boot_security.demo.service;



import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Set;

public interface UserService {
    List<User> allUsers();

    void saveUser(User user);

    User createUser(User user, Set<Role> roles);

    User getOne(long id);

    void updateUser(Long id, User user);

    void deleteUser(Long id);

    User UserInfo();
}