package online.javalearn.spacelectrician.SpringBootExample.controller;

import online.javalearn.spacelectrician.SpringBootExample.model.Role;
import online.javalearn.spacelectrician.SpringBootExample.model.User;
import online.javalearn.spacelectrician.SpringBootExample.service.RestTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
public class RESTController {

    private RestTemplateService restTemplateService;

    @Autowired
    public RESTController(RestTemplateService restTemplateService) {
        this.restTemplateService = restTemplateService;
    }

    @GetMapping("/current_user")
    public User currentUser() {
        return restTemplateService.getUser(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @GetMapping("/admin/users")
    public List<User> users() {
        return restTemplateService.getAllUsers();
    }

    @GetMapping("/admin/roles")
    public List<Role> roles() {
        return restTemplateService.getAllRoles();
    }

    @PostMapping("/admin/add_user")
    public void addUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        restTemplateService.saveCryptoUser(user);
    }

    @PutMapping("/admin/upd_user")
    public void updUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        if (user.getPassword().equals("")) {
            String password = restTemplateService.getUser(user.getId()).getPassword();
            user.setPassword(password);
            restTemplateService.saveUser(user);
        } else {
            restTemplateService.saveCryptoUser(user);
        }
    }

    @DeleteMapping("/admin/del_user")
    public void delUser(@RequestBody User user) {
        restTemplateService.deleteUser(user.getId());
    }

}
