package com.jeffsilva.jkcards.Services;

import com.jeffsilva.jkcards.Services.exceptions.ForbiddenException;
import com.jeffsilva.jkcards.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserService service;

    public void validateSelfOrdAdmin(Long userId){
        User me = service.authenticated();
        if (!me.hasRole("ROLE_ADMIN") && !me.getId().equals(userId)){
            throw new ForbiddenException("Access denied");
        }
    }
}
