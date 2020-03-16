package online.javalearn.spacelectrician.SpringBootExample.service;

import online.javalearn.spacelectrician.SpringBootExample.model.Role;
import online.javalearn.spacelectrician.SpringBootExample.model.User;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;

@Service
public class RestTemplateServiceImpl implements RestTemplateService, UserDetailsService {

    private final RestTemplate restTemplate;

    @Autowired
    public RestTemplateServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private HttpHeaders getHttpHeaders() {
        String currentUserName = SecurityContextHolder.getContext().getAuthentication().getName();
        String currentUserPassword = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();

        HttpHeaders headers = new HttpHeaders();

        String auth = currentUserName + ":" + currentUserPassword;
        byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(Charset.forName("US-ASCII")));
        String authHeader = "Basic " + new String(encodedAuth);

        headers.set("Authorization", authHeader);

        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);

        return headers;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return getUser(username);
    }

    @Override
    public User getUser(String name) {
        return restTemplate.exchange(
                "http://localhost:8080/user/" + name,
                HttpMethod.GET,
                null,
                User.class
        ).getBody();
    }

    @Override
    public User getUser(long id) {
        return restTemplate.exchange(
                "http://localhost:8080/admin/user/" + id,
                HttpMethod.GET,
                new HttpEntity<User>(getHttpHeaders()),
                User.class
        ).getBody();
    }

    @Override
    public List<Role> getAllRoles() {
        return restTemplate.exchange(
                "http://localhost:8080/admin/roles",
                HttpMethod.GET,
                new HttpEntity<User>(getHttpHeaders()),
                new ParameterizedTypeReference<List<Role>>() {
                }
        ).getBody();
    }

    @Override
    public List<User> getAllUsers() {
        return restTemplate.exchange(
                "http://localhost:8080/admin/users",
                HttpMethod.GET,
                new HttpEntity<User>(getHttpHeaders()),
                new ParameterizedTypeReference<List<User>>() {
                }
        ).getBody();
    }

    @Override
    public void saveCryptoUser(User user) {
        restTemplate.exchange("http://localhost:8080/admin/save_crypto_user",
                HttpMethod.POST,
                new HttpEntity<User>(user, getHttpHeaders()),
                User.class);
    }

    @Override
    public void saveUser(User user) {
        restTemplate.exchange("http://localhost:8080//admin/save_user",
                HttpMethod.POST,
                new HttpEntity<User>(user, getHttpHeaders()),
                User.class);
    }

    @Override
    public void deleteUser(long id) {
        restTemplate.exchange("http://localhost:8080/admin/delete_user/" + id,
                HttpMethod.DELETE,
                new HttpEntity<User>(getHttpHeaders()),
                User.class);
    }
}
