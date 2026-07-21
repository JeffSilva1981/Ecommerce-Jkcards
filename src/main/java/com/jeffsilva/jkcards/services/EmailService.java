package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.entities.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.mail-from}")
    private String mailFrom;

    public EmailService(
            JavaMailSender mailSender
    ) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(User user, String rawToken) {
        String resetUrl = frontendUrl + "/redefinir-senha?token=" + rawToken;

        String body = """
                Olá, %s!

                Recebemos uma solicitação para redefinir a senha da sua conta JKCards.

                Para criar uma nova senha, acesse o link abaixo:

                %s

                Este link é válido por 30 minutos e pode ser utilizado apenas uma vez.

                Se você não solicitou a alteração da senha, ignore este e-mail.

                Atenciosamente,
                Equipe JKCards
                """.formatted(
                user.getName(),
                resetUrl
        );

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(mailFrom);
        message.setTo(user.getEmail());
        message.setSubject(
                "Recuperação de senha - JKCards"
        );
        message.setText(body);

        mailSender.send(message);
    }
}