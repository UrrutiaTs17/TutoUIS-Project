package uis.edu.tutouis_project.modelo;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String correo;
    private String message;

    public JwtResponse(String token, String correo, String message) {
        this.token = token;
        this.correo = correo;
        this.message = message;
    }

    public JwtResponse() {}

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
