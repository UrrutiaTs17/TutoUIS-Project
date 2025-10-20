package uis.edu.tutouis_project.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT Bearer token para autenticación")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"))
                .info(new Info()
                        .title("TutoUIS Backend API")
                        .version("1.0.0")
                        .description("API REST para el sistema TutoUIS - Plataforma de tutoría académica con autenticación JWT. " +
                                "\n\n**Cómo usar:**\n" +
                                "1. Registrarse en `/api/usuarios/register` (no requiere autenticación)\n" +
                                "2. Hacer login en `/auth/login` con código y contraseña\n" +
                                "3. Copiar el token JWT devuelto\n" +
                                "4. Hacer clic en 'Authorize' e ingresa el token con formato: Bearer {token}\n" +
                                "5. Ahora puedes acceder a todos los endpoints protegidos\n\n" +
                                "**Nota:** Todos los endpoints excepto /auth/** y /api/usuarios/register requieren autenticación")
                        .contact(new Contact()
                                .name("TutoUIS Team")
                                .email("contacto@tutouis.com")));
    }
}
