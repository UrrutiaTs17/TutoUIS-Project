package uis.edu.tutouis_project.modelo;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String codigo;
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
