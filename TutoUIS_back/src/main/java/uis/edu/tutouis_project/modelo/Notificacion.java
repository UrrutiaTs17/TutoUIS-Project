package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;

@Entity
@Table(name = "notificacion")
@Schema(description = "Modelo Notificacion: notificaciones enviadas a usuarios")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacion")
    @Schema(description = "ID autogenerado de la notificación", example = "1")
    private Integer idNotificacion;

    @Column(name = "id_usuario", nullable = false)
    @Schema(description = "ID del usuario destinatario", example = "4")
    private Integer idUsuario;

    @Column(name = "tipo", length = 50, nullable = false)
    @Schema(description = "Tipo de notificación", example = "reserva_confirmada")
    private String tipo;

    @Column(name = "titulo", length = 255, nullable = false)
    @Schema(description = "Título de la notificación", example = "Tu reserva ha sido confirmada")
    private String titulo;

    @Column(name = "mensaje", length = 1000)
    @Schema(description = "Contenido del mensaje")
    private String mensaje;

    @Column(name = "id_estado", nullable = false)
    @Schema(description = "ID del estado de la notificación", example = "1")
    private Integer idEstado;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de creación")
    private Timestamp fechaCreacion;

    @Column(name = "fecha_lectura")
    @Schema(description = "Fecha de lectura por el usuario")
    private Timestamp fechaLectura;

    @Column(name = "fecha_envio")
    @Schema(description = "Fecha de envío")
    private Timestamp fechaEnvio;

    public Notificacion() {
    }

    public Notificacion(Integer idUsuario, String tipo, String titulo, String mensaje) {
        this.idUsuario = idUsuario;
        this.tipo = tipo;
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.idEstado = 1;
    }

    public Integer getIdNotificacion() {
        return idNotificacion;
    }

    public void setIdNotificacion(Integer idNotificacion) {
        this.idNotificacion = idNotificacion;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public Integer getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(Integer idEstado) {
        this.idEstado = idEstado;
    }

    public Timestamp getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Timestamp fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Timestamp getFechaLectura() {
        return fechaLectura;
    }

    public void setFechaLectura(Timestamp fechaLectura) {
        this.fechaLectura = fechaLectura;
    }

    public Timestamp getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(Timestamp fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    @Override
    public String toString() {
        return "Notificacion{" +
                "idNotificacion=" + idNotificacion +
                ", idUsuario=" + idUsuario +
                ", tipo='" + tipo + '\'' +
                ", titulo='" + titulo + '\'' +
                '}';
    }
}
