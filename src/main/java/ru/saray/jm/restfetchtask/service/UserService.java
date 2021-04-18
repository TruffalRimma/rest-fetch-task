package ru.saray.jm.restfetchtask.service;

import ru.saray.jm.restfetchtask.model.User;

import java.util.List;

public interface UserService {
    User loadUserByUsername(String username);
    User loadUserByEmail(String email);
    List<User> getUsers();
    User getUserByID(Long id);
    void saveOrUpdate(User user);
    void deleteById(Long id);
}