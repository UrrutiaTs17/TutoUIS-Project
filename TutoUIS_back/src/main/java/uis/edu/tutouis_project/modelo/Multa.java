package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;
import java.math.BigDecimal;

@Entity
@Table(name = "multa")
@Schema(description = "Modelo Multa: registra multas por incumplimiento")
public class Multa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_multa")
    @Schema(description = "ID autogenerado de la multa", example = "1")
    private Integer idMulta;

    @Column(name = "id_estudiante", nullable = false)
    @Schema(description = "ID del estudiante multado", example = "4")
    private Integer idEstudiante;

    @Column(name = "id_reserva")
    @Schema(description = "ID de la reserva relacionada", example = "1")
    private Integer idReserva;

    @Column(name = "motivo", length = 255, nullable = false)
    @Schema(description = "Motivo de la multa", example = "Inasistencia sin justificación")
    private String motivo;

    @Column(name = "monto", nullable = false)
    @Schema(description = "Monto de la multa", example = "50000")
    private BigDecimal monto;

    @Column(name = "estado", length = 50, nullable = false)
    @Schema(description = "Estado de la multa", example = "Pendiente")
    private String estado;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de creación")
    private Timestamp fechaCreacion;

    @Column(name = "fecha_pago")
    @Schema(description = "Fecha de pago")
    private Timestamp fechaPago;

    public Multa() {
    }

    public Multa(Integer idEstudiante, String motivo, BigDecimal monto) {
        this.idEstudiante = idEstudiante;
        this.motivo = motivo;
        this.monto = monto;
        this.estado = "Pendiente";
    }

    public Integer getIdMulta() {
        return idMulta;
    }

    public void setIdMulta(Integer idMulta) {
        this.idMulta = idMulta;
    }

    public Integer getIdEstudiante() {
        return idEstudiante;
    }

    public void setIdEstudiante(Integer idEstudiante) {
        this.idEstudiante = idEstudiante;
    }

    public Integer getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Integer idReserva) {
        this.idReserva = idReserva;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Timestamp getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Timestamp fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Timestamp getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(Timestamp fechaPago) {
        this.fechaPago = fechaPago;
    }

    @Override
    public String toString() {
        return "Multa{" +
                "idMulta=" + idMulta +
                ", idEstudiante=" + idEstudiante +
                ", motivo='" + motivo + '\'' +
                ", monto=" + monto +
                ", estado='" + estado + '\'' +
                '}';
    }
}
