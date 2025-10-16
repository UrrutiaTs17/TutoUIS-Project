package uis.edu.tutouis_project.modelo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para la autenticación de usuarios")
public class LoginDto {
    @Schema(description = "Código de usuario", example = "jperez")
    private String codigo;

    @Schema(description = "Contraseña", example = "miPassword123")
    private String contrasena;

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}