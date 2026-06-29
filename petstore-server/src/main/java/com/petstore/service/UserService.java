package com.petstore.service;

import com.petstore.dto.LoginDTO;
import com.petstore.dto.RegisterDTO;
import com.petstore.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.petstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public User register(RegisterDTO dto) {
        if (dto.getUsername() == null || dto.getUsername().trim().isEmpty()) {
            throw new RuntimeException("用户名不能为空");
        }
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new RuntimeException("密码不能为空");
        }
        User exist = userRepository.findByUsername(dto.getUsername());
        if (exist != null) {
            throw new RuntimeException("用户名已存在");
        }
        User user = new User();
        user.setUsername(dto.getUsername().trim());
        user.setPassword(dto.getPassword().trim());
        user.setNickname(dto.getNickname() != null ? dto.getNickname().trim() : dto.getUsername().trim());
        if (dto.getPhone() != null && !dto.getPhone().trim().isEmpty()) {
            user.setPhone(dto.getPhone().trim());
        }
        user.setRole(User.Role.member);
        user.setLevel(0);
        return userRepository.save(user);
    }

    public User login(LoginDTO dto) {
        String account = dto.getUsername();
        log.info("Login attempt: account='{}'", account);
        // 自动识别：先按用户名查，再按手机号查
        User user = userRepository.findByUsername(account);
        log.info("findByUsername('{}') => {}", account, user != null ? "found id=" + user.getId() : "null");
        if (user == null) {
            user = userRepository.findByPhone(account);
            log.info("findByPhone('{}') => {}", account, user != null ? "found id=" + user.getId() : "null");
        }
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }
        if (!user.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        return user;
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    public User update(User user) {
        User exist = getById(user.getId());
        if (user.getNickname() != null) exist.setNickname(user.getNickname());
        if (user.getAvatar() != null) exist.setAvatar(user.getAvatar());
        if (user.getGender() != null) exist.setGender(user.getGender());
        if (user.getEmail() != null) exist.setEmail(user.getEmail());
        if (user.getPhone() != null) exist.setPhone(user.getPhone());
        log.info("update userId={}, phone='{}'", user.getId(), user.getPhone());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            exist.setPassword(user.getPassword());
        }
        return userRepository.save(exist);
    }

    public List<User> listAll() {
        return userRepository.findAll();
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}