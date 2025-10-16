package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import uis.edu.tutouis_project.modelo.LoginDto;
import uis.edu.tutouis_project.servicio.IUsuarioService;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
@Tag(name = "auth-controller", description = "Endpoints de autenticación (login JWT)")
public class AuthController {
    @Autowired
    private IUsuarioService usuarioService;

    @Operation(summary = "Autenticar usuario",
            description = "Autentica con código y contraseña y devuelve un JWT en caso de éxito.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Autenticación correcta",
                            content = @Content(schema = @Schema(implementation = Object.class))),
                    @ApiResponse(responseCode = "401", description = "Credenciales inválidas o usuario inactivo/ bloqueado")
            })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        return usuarioService.loginConJwt(loginDto);
    }
}
