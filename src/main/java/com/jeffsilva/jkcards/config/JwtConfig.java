package com.jeffsilva.jkcards.config;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.security.converter.RsaKeyConverters;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import java.io.IOException;
import java.io.InputStream;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Configuration
public class JwtConfig {

    @Bean
    public RSAKey rsaKey(
            @Value("${security.jwt.public-key}")
            Resource publicKeyResource,
            @Value("${security.jwt.private-key}")
            Resource privateKeyResource) {
        try (
                InputStream publicKeyInput = publicKeyResource.getInputStream();
                InputStream privateKeyInput = privateKeyResource.getInputStream()
        ) {
            RSAPublicKey publicKey = RsaKeyConverters.x509().convert(publicKeyInput);
            RSAPrivateKey privateKey = RsaKeyConverters.pkcs8().convert(privateKeyInput);

            return new RSAKey.Builder(publicKey).privateKey(privateKey).keyID("jkcards-rsa-key").build();

        } catch (IOException exception) {
            throw new IllegalStateException("Could not load JWT RSA keys", exception);
        }
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource(RSAKey rsaKey) {
        JWKSet jwkSet = new JWKSet(rsaKey);
        return (jwkSelector, securityContext) -> jwkSelector.select(jwkSet);
    }

    @Bean
    public JwtDecoder jwtDecoder(RSAKey rsaKey) throws JOSEException {
        return NimbusJwtDecoder.withPublicKey(rsaKey.toRSAPublicKey()).build();
    }
}