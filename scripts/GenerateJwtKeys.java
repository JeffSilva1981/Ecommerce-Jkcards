import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;

public class GenerateJwtKeys {

    private static final Path OUTPUT_DIRECTORY =
            Path.of("secrets");

    private static final Path PRIVATE_KEY_PATH =
            OUTPUT_DIRECTORY.resolve("jwt-private.pem");

    private static final Path PUBLIC_KEY_PATH =
            OUTPUT_DIRECTORY.resolve("jwt-public.pem");

    public static void main(String[] args)
            throws Exception {

        Files.createDirectories(OUTPUT_DIRECTORY);

        validateFilesDoNotExist();

        KeyPairGenerator generator =
                KeyPairGenerator.getInstance("RSA");

        generator.initialize(2048);

        KeyPair keyPair = generator.generateKeyPair();

        writePem(
                PRIVATE_KEY_PATH,
                "PRIVATE KEY",
                keyPair.getPrivate().getEncoded()
        );

        writePem(
                PUBLIC_KEY_PATH,
                "PUBLIC KEY",
                keyPair.getPublic().getEncoded()
        );

        protectPrivateKey();

        System.out.println(
                "JWT keys generated successfully:"
        );

        System.out.println(
                PRIVATE_KEY_PATH.toAbsolutePath()
        );

        System.out.println(
                PUBLIC_KEY_PATH.toAbsolutePath()
        );
    }

    private static void validateFilesDoNotExist() {
        if (Files.exists(PRIVATE_KEY_PATH)
                || Files.exists(PUBLIC_KEY_PATH)) {
            throw new IllegalStateException(
                    "JWT key files already exist. "
                            + "Generation was cancelled to prevent overwriting them."
            );
        }
    }

    private static void writePem(
            Path path,
            String type,
            byte[] encodedKey
    ) throws Exception {

        String base64 = Base64
                .getMimeEncoder(
                        64,
                        "\n".getBytes(
                                StandardCharsets.US_ASCII
                        )
                )
                .encodeToString(encodedKey);

        String pem = """
                -----BEGIN %s-----
                %s
                -----END %s-----
                """.formatted(type, base64, type);

        Files.writeString(
                path,
                pem,
                StandardCharsets.US_ASCII,
                StandardOpenOption.CREATE_NEW
        );
    }

    private static void protectPrivateKey()
            throws Exception {
        try {
            Files.setPosixFilePermissions(
                    PRIVATE_KEY_PATH,
                    PosixFilePermissions.fromString(
                            "rw-------"
                    )
            );
        } catch (UnsupportedOperationException ignored) {
            // Windows does not use POSIX permissions.
        }
    }
}