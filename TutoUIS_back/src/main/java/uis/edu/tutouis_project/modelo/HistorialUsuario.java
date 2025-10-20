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
@Table(name = "historial_usuario")
@Schema(description = "Modelo HistorialUsuario: registro de cambios en usuarios")
public class HistorialUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    @Schema(description = "ID autogenerado del historial", example = "1")
    private Integer idHistorial;

    @Column(name = "id_usuario", nullable = false)
    @Schema(description = "ID del usuario afectado", example = "4")
    private Integer idUsuario;

    @Column(name = "tipo_cambio", length = 50, nullable = false)
    @Schema(description = "Tipo de cambio", example = "Editar")
    private String tipoCambio;

    @Column(name = "campos_modificados", columnDefinition = "JSON")
    @Schema(description = "Campos modificados en formato JSON")
    private String camposModificados;

    @Column(name = "motivo", length = 255)
    @Schema(description = "Motivo del cambio")
    private String motivo;

    @Column(name = "usuario_cambio_id", nullable = false)
    @Schema(description = "ID del usuario que hizo el cambio", example = "1")
    private Integer usuarioCambioId;

    @Column(name = "fecha_cambio", insertable = false, updatable = false)
    @Schema(description = "Fecha del cambio")
    private Timestamp fechaCambio;

    @Column(name = "ip_origen", length = 50)
    @Schema(description = "IP desde donde se realizó el cambio")
    private String ipOrigen;

    public HistorialUsuario() {
    }

    public HistorialUsuario(Integer idUsuario, String tipoCambio, Integer usuarioCambioId) {
        this.idUsuario = idUsuario;
        this.tipoCambio = tipoCambio;
        this.usuarioCambioId = usuarioCambioId;
    }

    public Integer getIdHistorial() {
        return idHistorial;
    }

    public void setIdHistorial(Integer idHistorial) {
        this.idHistorial = idHistorial;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getTipoCambio() {
        return tipoCambio;
    }

    public void setTipoCambio(String tipoCambio) {
        this.tipoCambio = tipoCambio;
    }

    public String getCamposModificados() {
        return camposModificados;
    }

    public void setCamposModificados(String camposModificados) {
        this.camposModificados = camposModificados;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public Integer getUsuarioCambioId() {
        return usuarioCambioId;
    }

    public void setUsuarioCambioId(Integer usuarioCambioId) {
        this.usuarioCambioId = usuarioCambioId;
    }

    public Timestamp getFechaCambio() {
        return fechaCambio;
    }

    public void setFechaCambio(Timestamp fechaCambio) {
        this.fechaCambio = fechaCambio;
    }

    public String getIpOrigen() {
        return ipOrigen;
    }

    public void setIpOrigen(String ipOrigen) {
        this.ipOrigen = ipOrigen;
    }

    @Override
    public String toString() {
        return "HistorialUsuario{" +
                "idHistorial=" + idHistorial +
                ", idUsuario=" + idUsuario +
                ", tipoCambio='" + tipoCambio + '\'' +
                ", fechaCambio=" + fechaCambio +
                '}';
    }
}
