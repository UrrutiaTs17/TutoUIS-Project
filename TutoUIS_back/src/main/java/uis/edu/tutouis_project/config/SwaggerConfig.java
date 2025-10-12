package uis.edu.tutouis_project.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TutoUIS Backend API")
                        .version("1.0.0")
                        .description("API REST para el sistema TutoUIS con autenticación JWT")
                        .contact(new Contact()
                                .name("TutoUIS Team")
                                .email("contacto@tutouis.com")));
    }
}
