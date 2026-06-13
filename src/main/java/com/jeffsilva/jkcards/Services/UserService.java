package com.jeffsilva.jkcards.Services;

import com.jeffsilva.jkcards.Dtos.ProductDto;
import com.jeffsilva.jkcards.Dtos.RegisterDTO;
import com.jeffsilva.jkcards.Dtos.UserDto;
import com.jeffsilva.jkcards.Repositories.RoleRepository;
import com.jeffsilva.jkcards.Repositories.UserRepository;
import com.jeffsilva.jkcards.Services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.Services.exceptions.ResourceNotFoundException;
import com.jeffsilva.jkcards.entities.Role;
import com.jeffsilva.jkcards.entities.User;
import com.jeffsilva.jkcards.projections.UserDetailsProjection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    public void register(RegisterDTO dto) {

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPhone(dto.phone());
        user.setPassword(passwordEncoder.encode(dto.password()));
        Role role = roleRepository.findByAuthority("ROLE_OPERATOR").orElseThrow(()-> new ResourceNotFoundException("Role Not Found"));
        user.addRole(role);

        repository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println("LOGIN RECEBIDO: " + username);

        List<UserDetailsProjection> result = repository.searchUserAndRolesByEmail(username);
        if (result.isEmpty()) {
            throw new UsernameNotFoundException("Email not found");
        }

        System.out.println("USUARIO: " + result.get(0).getUsername());

        User user = new User();
        user.setEmail(result.get(0).getUsername());
        user.setPassword(result.get(0).getPassword());
        for (UserDetailsProjection projection : result) {
            user.addRole(new Role(projection.getRoleId(), projection.getAuthority()));
        }

        return user;
    }

    protected User authenticated() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Jwt jwtPrincipal = (Jwt) authentication.getPrincipal();
            String username = jwtPrincipal.getClaim("username");
            return repository.findByEmail(username).get();
        } catch (Exception e) {
            throw new UsernameNotFoundException("Invalid user");
        }
    }

    @Transactional(readOnly = true)
    public UserDto getMe() {
        User entity = authenticated();
        return new UserDto(entity);
    }

    @Transactional(readOnly = true)
    public Page<UserDto> findAll(String name, Pageable pageable) {
        Page<User> user = repository.findByNameContainingIgnoreCase(name, pageable);
        return user.map(UserDto::new);
    }

    @Transactional
    public UserDto findById(Long id) {
        User user = repository.findById(id).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));
        return new UserDto(user);
    }

    @Transactional
    public UserDto insert(UserDto dto) {
        User user = new User();
        copyDtoToEnity(dto, user);
        user = repository.save(user);
        return new UserDto(user);
    }

    @Transactional
    public UserDto update(Long id, UserDto dto) {
        User user = repository.getReferenceById(id);
        copyDtoToEnityToUpadate(dto, user);
        user = repository.save(user);
        return new UserDto(user);
    }

    @Transactional(propagation = Propagation.SUPPORTS)
    public void delete(Long id) {

        if (!repository.existsById(id)){
            throw new ResourceNotFoundException("User not found");
        }

        try {
            repository.deleteById(id);
        }catch (DataIntegrityViolationException e){
            throw new DataBaseException("Integrity violation - user is related to other entities");
        }

    }

    private void copyDtoToEnityToUpadate(UserDto dto, User user) {
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setBirthDate(dto.getBirthDate());

        user.getRoles().clear();

        for (String roleName : dto.getRoles()) {
            Role role = roleRepository.findByAuthority(roleName)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

            user.addRole(role);
        }
    }

    private void copyDtoToEnity(UserDto dto, User user) {
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setBirthDate(dto.getBirthDate());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user.getRoles().clear();

        for (String roleName : dto.getRoles()) {
            Role role = roleRepository.findByAuthority(roleName)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

            user.addRole(role);
        }
    }
}
