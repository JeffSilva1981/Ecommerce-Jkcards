package com.jeffsilva.jkcards.Services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jeffsilva.jkcards.Services.exceptions.FileUploadException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) {

        if (file.isEmpty()) {
            throw new FileUploadException("O arquivo enviado está vazio.");
        }

        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new FileUploadException("Apenas imagens são permitidas.");
        }

        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "jkcards/products"
                    )
            );

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new FileUploadException("Erro ao fazer upload da imagem.", e);
        }
    }
}