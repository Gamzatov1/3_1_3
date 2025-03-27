package ru.kata.spring.boot_security.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.username = :username")
    User findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("Select u from User u left join fetch u.roles where u.email=:email")
    Optional<User> findByEmail(String email);
}
