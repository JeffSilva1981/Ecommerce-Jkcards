package com.jeffsilva.jkcards.integrations.melhorenvio.dtos;

public class MelhorEnvioCompanyResponse {

    private Long id;
    private String name;
    private String picture;

    public MelhorEnvioCompanyResponse() {
    }

    public MelhorEnvioCompanyResponse(
            Long id,
            String name,
            String picture
    ) {
        this.id = id;
        this.name = name;
        this.picture = picture;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPicture() {
        return picture;
    }
}