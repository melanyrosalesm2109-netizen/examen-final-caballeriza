package com.caballeriza.backend.service;

import com.caballeriza.backend.model.*;
import com.caballeriza.backend.repository.AlertRepository;
import com.caballeriza.backend.repository.InventoryItemRepository;
import com.caballeriza.backend.repository.MedicalHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AlertService {

    private static final String INVENTORY_REFERENCE =
            "INVENTORY_ITEM";

    private static final String MEDICAL_REFERENCE =
            "MEDICAL_HISTORY";

    private static final int DIAS_ANTICIPACION = 30;

    private final AlertRepository alertRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final MedicalHistoryRepository medicalHistoryRepository;

    public List<Alert> findAll() {
        return alertRepository.findAll();
    }

    public List<Alert> findUnread() {
        return alertRepository.findByLeidaFalse();
    }

    public Alert findById(Long id) {
        return alertRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Alerta no encontrada"
                        )
                );
    }

    public Alert save(Alert alert) {
        return alertRepository.save(alert);
    }

    public Alert markAsRead(Long id) {
        Alert alert = findById(id);
        alert.setLeida(true);

        return alertRepository.save(alert);
    }

    public Alert markAsUnread(Long id) {
        Alert alert = findById(id);
        alert.setLeida(false);

        return alertRepository.save(alert);
    }

    /*
     * Revisa todas las alertas automáticas.
     * Se ejecutará al consultar las alertas.
     */
    @Transactional
    public synchronized void synchronizeAutomaticAlerts() {
        synchronizeLowStockAlerts();
        synchronizeMedicalAlerts();
    }

    @Transactional
    public synchronized List<Alert> generateLowStockAlerts() {
        synchronizeLowStockAlerts();
        return alertRepository.findAll();
    }

    @Transactional
    public synchronized List<Alert> generateMedicalAlerts() {
        synchronizeMedicalAlerts();
        return alertRepository.findAll();
    }

    /*
     * Se llama inmediatamente después de guardar
     * o modificar un registro médico.
     */
    @Transactional
    public synchronized void syncMedicalAlert(
            MedicalHistory medicalHistory
    ) {
        synchronizeOneMedicalHistory(medicalHistory);
    }

    @Transactional
    public void deleteMedicalAlert(Long medicalHistoryId) {
        deleteReferenceAlerts(
                MEDICAL_REFERENCE,
                medicalHistoryId
        );
    }

    private void synchronizeLowStockAlerts() {
        List<InventoryItem> inventoryItems =
                inventoryItemRepository.findAll();

        for (InventoryItem item : inventoryItems) {
            List<Alert> existingAlerts =
                    alertRepository
                            .findByReferenciaTipoAndReferenciaId(
                                    INVENTORY_REFERENCE,
                                    item.getId()
                            );

            if (!item.isStockBajo()) {
                if (!existingAlerts.isEmpty()) {
                    alertRepository.deleteAll(existingAlerts);
                }

                continue;
            }

            String title =
                    "Stock bajo: " + item.getNombre();

            String message =
                    "El insumo " + item.getNombre()
                            + " tiene stock bajo. Cantidad actual: "
                            + item.getCantidadActual() + " "
                            + item.getUnidad()
                            + ". Stock mínimo: "
                            + item.getStockMinimo() + " "
                            + item.getUnidad() + ".";

            upsertReferenceAlert(
                    TipoAlerta.STOCK_BAJO,
                    title,
                    message,
                    INVENTORY_REFERENCE,
                    item.getId()
            );
        }
    }

    private void synchronizeMedicalAlerts() {
        List<MedicalHistory> medicalHistories =
                medicalHistoryRepository.findAll();

        for (MedicalHistory medicalHistory
                : medicalHistories) {

            synchronizeOneMedicalHistory(
                    medicalHistory
            );
        }
    }

    private void synchronizeOneMedicalHistory(
            MedicalHistory medicalHistory
    ) {
        if (medicalHistory.getId() == null) {
            return;
        }

        LocalDate alertDate = null;
        TipoAlerta alertType = null;

        if (medicalHistory.getTipo()
                == TipoHistorialMedico.VACUNA) {

            alertDate =
                    medicalHistory.getFechaProxima();

            alertType = TipoAlerta.VACUNACION;
        }

        if (medicalHistory.getTipo()
                == TipoHistorialMedico.TRATAMIENTO) {

            alertDate =
                    medicalHistory.getFechaVencimiento();

            alertType = TipoAlerta.TRATAMIENTO;
        }

        if (alertDate == null || alertType == null) {
            deleteReferenceAlerts(
                    MEDICAL_REFERENCE,
                    medicalHistory.getId()
            );

            return;
        }

        LocalDate today = LocalDate.now();
        LocalDate maximumDate =
                today.plusDays(DIAS_ANTICIPACION);

        /*
         * Si todavía faltan más de 30 días,
         * la alerta no se muestra aún.
         */
        if (alertDate.isAfter(maximumDate)) {
            deleteReferenceAlerts(
                    MEDICAL_REFERENCE,
                    medicalHistory.getId()
            );

            return;
        }

        String horseName =
                medicalHistory.getHorse() != null
                        ? medicalHistory
                        .getHorse()
                        .getNombre()
                        : "caballo sin nombre";

        String formattedDate =
                alertDate.format(
                        DateTimeFormatter.ofPattern(
                                "dd/MM/yyyy"
                        )
                );

        boolean expired =
                alertDate.isBefore(today);

        String title;
        String message;

        if (alertType == TipoAlerta.VACUNACION) {
            title = expired
                    ? "Vacunación vencida: " + horseName
                    : "Próxima vacunación: " + horseName;

            message = expired
                    ? "La vacunación de " + horseName
                    + " estaba programada para el "
                    + formattedDate + "."
                    : "La próxima vacunación de "
                    + horseName
                    + " está programada para el "
                    + formattedDate + ".";
        } else {
            title = expired
                    ? "Tratamiento vencido: " + horseName
                    : "Vencimiento de tratamiento: "
                    + horseName;

            message = expired
                    ? "El tratamiento de " + horseName
                    + " venció el "
                    + formattedDate + "."
                    : "El tratamiento de " + horseName
                    + " vence el "
                    + formattedDate + ".";
        }

        if (
                medicalHistory.getDescripcion() != null
                        && !medicalHistory
                        .getDescripcion()
                        .isBlank()
        ) {
            message += " Detalle: "
                    + medicalHistory.getDescripcion();
        }

        upsertReferenceAlert(
                alertType,
                title,
                message,
                MEDICAL_REFERENCE,
                medicalHistory.getId()
        );
    }

    private Alert upsertReferenceAlert(
            TipoAlerta type,
            String title,
            String message,
            String referenceType,
            Long referenceId
    ) {
        List<Alert> existingAlerts =
                alertRepository
                        .findByReferenciaTipoAndReferenciaId(
                                referenceType,
                                referenceId
                        );

        Alert alert;

        if (existingAlerts.isEmpty()) {
            alert = Alert.builder()
                    .tipo(type)
                    .titulo(title)
                    .mensaje(message)
                    .leida(false)
                    .fechaCreacion(
                            LocalDateTime.now()
                    )
                    .referenciaTipo(referenceType)
                    .referenciaId(referenceId)
                    .build();
        } else {
            alert = existingAlerts.get(0);

            /*
             * Elimina duplicados antiguos.
             */
            if (existingAlerts.size() > 1) {
                alertRepository.deleteAll(
                        existingAlerts.subList(
                                1,
                                existingAlerts.size()
                        )
                );
            }

            boolean changed =
                    alert.getTipo() != type
                            || !Objects.equals(
                            alert.getTitulo(),
                            title
                    )
                            || !Objects.equals(
                            alert.getMensaje(),
                            message
                    );

            alert.setTipo(type);
            alert.setTitulo(title);
            alert.setMensaje(message);
            alert.setReferenciaTipo(referenceType);
            alert.setReferenciaId(referenceId);

            /*
             * Si cambió la fecha o el mensaje,
             * vuelve a quedar pendiente.
             */
            if (changed) {
                alert.setLeida(false);
                alert.setFechaCreacion(
                        LocalDateTime.now()
                );
            }
        }

        return alertRepository.save(alert);
    }

    private void deleteReferenceAlerts(
            String referenceType,
            Long referenceId
    ) {
        List<Alert> alerts =
                alertRepository
                        .findByReferenciaTipoAndReferenciaId(
                                referenceType,
                                referenceId
                        );

        if (!alerts.isEmpty()) {
            alertRepository.deleteAll(alerts);
        }
    }

    public void delete(Long id) {
        Alert alert = findById(id);
        alertRepository.delete(alert);
    }
}