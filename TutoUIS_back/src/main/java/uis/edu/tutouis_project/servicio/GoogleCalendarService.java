package uis.edu.tutouis_project.servicio;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.ConferenceSolutionKey;
import com.google.api.services.calendar.model.CreateConferenceRequest;
import com.google.api.services.calendar.model.ConferenceData;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "TutoUIS Calendar Integration";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";
    private static final List<String> SCOPES = Collections.singletonList(CalendarScopes.CALENDAR);
    private static final String CREDENTIALS_FILE_PATH = "src/main/resources/credentials.json";

    /**
     * Crea y autoriza un cliente de Google Calendar API
     */
    private Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
        // Cargar credenciales del cliente
        GoogleClientSecrets clientSecrets;
        try (FileInputStream fis = new FileInputStream(CREDENTIALS_FILE_PATH);
             InputStreamReader reader = new InputStreamReader(fis)) {
            clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, reader);
        }

        // Construir flujo de autorización
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();

        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
    }

    /**
     * Crea un servicio de Calendar API
     */
    private Calendar getCalendarService() throws GeneralSecurityException, IOException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    /**
     * Crea un evento de Google Calendar para una tutoría
     * 
     * @param titulo Título de la tutoría
     * @param descripcion Descripción de la tutoría
     * @param fecha Fecha de la tutoría
     * @param horaInicio Hora de inicio
     * @param horaFin Hora de fin
     * @param correoEstudiante Correo del estudiante
     * @param correoTutor Correo del tutor
     * @param incluirMeet Si es true, crea Google Meet; si es false, solo crea el evento
     * @return URL del Google Meet creado (null si incluirMeet es false)
     */
    public String crearEventoCalendar(String titulo, String descripcion, LocalDate fecha, 
                                      LocalTime horaInicio, LocalTime horaFin, 
                                      String correoEstudiante, String correoTutor,
                                      boolean incluirMeet) {
        try {
            System.out.println("🗓️  INICIANDO CREACIÓN DE EVENTO EN GOOGLE CALENDAR");
            System.out.println("  - Título: " + titulo);
            System.out.println("  - Fecha: " + fecha);
            System.out.println("  - Hora: " + horaInicio + " - " + horaFin);
            System.out.println("  - Estudiante: " + correoEstudiante);
            System.out.println("  - Tutor: " + correoTutor);
            System.out.println("  - Incluir Google Meet: " + (incluirMeet ? "Sí" : "No"));

            Calendar service = getCalendarService();

            // Crear fecha/hora con zona horaria de Colombia
            ZoneId colombiaZone = ZoneId.of("America/Bogota");
            ZonedDateTime inicioZoned = ZonedDateTime.of(fecha, horaInicio, colombiaZone);
            ZonedDateTime finZoned = ZonedDateTime.of(fecha, horaFin, colombiaZone);

            // Configurar evento
            Event event = new Event()
                    .setSummary(titulo)
                    .setDescription(descripcion);

            // Configurar fecha y hora de inicio
            EventDateTime inicio = new EventDateTime()
                    .setDateTime(new DateTime(inicioZoned.toInstant().toEpochMilli()))
                    .setTimeZone("America/Bogota");
            event.setStart(inicio);

            // Configurar fecha y hora de fin
            EventDateTime fin = new EventDateTime()
                    .setDateTime(new DateTime(finZoned.toInstant().toEpochMilli()))
                    .setTimeZone("America/Bogota");
            event.setEnd(fin);

            // Agregar asistentes
            EventAttendee[] asistentes = new EventAttendee[]{
                    new EventAttendee().setEmail(correoEstudiante),
                    new EventAttendee().setEmail(correoTutor)
            };
            event.setAttendees(Arrays.asList(asistentes));

            // Configurar Google Meet solo si se solicita
            if (incluirMeet) {
                ConferenceSolutionKey conferenceSolutionKey = new ConferenceSolutionKey();
                conferenceSolutionKey.setType("hangoutsMeet");
                
                CreateConferenceRequest createConferenceRequest = new CreateConferenceRequest();
                createConferenceRequest.setRequestId(UUID.randomUUID().toString());
                createConferenceRequest.setConferenceSolutionKey(conferenceSolutionKey);
                
                ConferenceData conferenceData = new ConferenceData();
                conferenceData.setCreateRequest(createConferenceRequest);
                
                event.setConferenceData(conferenceData);
            }

            // Insertar evento en el calendario
            String calendarId = "primary";
            if (incluirMeet) {
                // conferenceDataVersion=1 es necesario para crear Meet
                event = service.events().insert(calendarId, event)
                        .setConferenceDataVersion(1)
                        .setSendUpdates("all") // Enviar invitaciones a todos
                        .execute();
            } else {
                // Sin Google Meet
                event = service.events().insert(calendarId, event)
                        .setSendUpdates("all") // Enviar invitaciones a todos
                        .execute();
            }

            String meetLink = incluirMeet ? event.getHangoutLink() : null;
            System.out.println("✅ Evento creado exitosamente");
            System.out.println("  - ID del evento: " + event.getId());
            if (incluirMeet && meetLink != null) {
                System.out.println("  - Enlace Meet: " + meetLink);
            } else {
                System.out.println("  - Evento presencial (sin Meet)");
            }

            return meetLink;

        } catch (Exception e) {
            System.err.println("❌ Error al crear evento de Google Calendar: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al crear evento de Google Calendar: " + e.getMessage(), e);
        }
    }

    /**
     * Método de conveniencia para crear evento con Google Meet (modalidad Virtual)
     */
    public String crearEventoMeet(String titulo, String descripcion, LocalDate fecha, 
                                   LocalTime horaInicio, LocalTime horaFin, 
                                   String correoEstudiante, String correoTutor) {
        return crearEventoCalendar(titulo, descripcion, fecha, horaInicio, horaFin, 
                                   correoEstudiante, correoTutor, true);
    }

    /**
     * Método de conveniencia para crear evento presencial (sin Google Meet)
     */
    public String crearEventoPresencial(String titulo, String descripcion, LocalDate fecha, 
                                        LocalTime horaInicio, LocalTime horaFin, 
                                        String correoEstudiante, String correoTutor) {
        crearEventoCalendar(titulo, descripcion, fecha, horaInicio, horaFin, 
                           correoEstudiante, correoTutor, false);
        return null; // No hay enlace de Meet para eventos presenciales
    }

    /**
     * Elimina un evento de Google Calendar
     * 
     * @param eventId ID del evento a eliminar
     */
    public void eliminarEvento(String eventId) {
        try {
            System.out.println("🗑️  Eliminando evento de Google Calendar: " + eventId);
            Calendar service = getCalendarService();
            service.events().delete("primary", eventId).execute();
            System.out.println("✅ Evento eliminado exitosamente");
        } catch (Exception e) {
            System.err.println("❌ Error al eliminar evento: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
