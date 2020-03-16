package online.javalearn.spacelectrician.SpringBootExample.service;

import online.javalearn.spacelectrician.SpringBootExample.model.Role;
import online.javalearn.spacelectrician.SpringBootExample.model.User;

import java.util.List;

public interface RestTemplateService {

    User getUser(String name);

    User getUser(long id);

    List<Role> getAllRoles();

    List<User> getAllUsers();

    void saveCryptoUser(User user);

    void saveUser(User user);

    void deleteUser(long id);
}
