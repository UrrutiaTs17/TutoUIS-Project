package uis.edu.tutouis_project.modelo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta JWT devuelta al autenticarse")
public class JwtResponse {
    @Schema(description = "Token JWT", example = "eyJhbGciOiJI...")
    private String token;

    @Schema(description = "Tipo de token", example = "Bearer")
    private String type = "Bearer";

    @Schema(description = "Código del usuario autenticado", example = "jperez")
    private String codigo;

    @Schema(description = "ID del usuario autenticado", example = "12")
    private Integer idUsuario;

    public JwtResponse(String token, String codigo, Integer idUsuario) {
        this.token = token;
        this.codigo = codigo;
        this.idUsuario = idUsuario;
    }

    public JwtResponse() {
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

}
