package com.caballeriza.backend.service;

import com.caballeriza.backend.model.Alert;
import com.caballeriza.backend.model.Horse;
import com.caballeriza.backend.model.InventoryItem;
import com.caballeriza.backend.model.MedicalHistory;
import com.caballeriza.backend.model.TipoAlerta;
import com.caballeriza.backend.model.TipoHistorialMedico;
import com.caballeriza.backend.repository.AlertRepository;
import com.caballeriza.backend.repository.InventoryItemRepository;
import com.caballeriza.backend.repository.MedicalHistoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private AlertRepository alertRepository;

    @Mock
    private InventoryItemRepository inventoryItemRepository;

    @Mock
    private MedicalHistoryRepository medicalHistoryRepository;

    @InjectMocks
    private AlertService alertService;

    @Test
    void debeGenerarAlertaCuandoStockEstaBajo() {
        InventoryItem item = InventoryItem.builder()
                .id(1L)
                .nombre("Vacuna Influenza")
                .cantidadActual(2.0)
                .stockMinimo(5.0)
                .unidad("unidades")
                .build();

        when(inventoryItemRepository.findAll())
                .thenReturn(List.of(item));

        when(alertRepository
                .findByReferenciaTipoAndReferenciaId(
                        "INVENTORY_ITEM",
                        1L
                ))
                .thenReturn(List.of());

        when(alertRepository.save(any(Alert.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        when(alertRepository.findAll())
                .thenReturn(List.of());

        alertService.generateLowStockAlerts();

        ArgumentCaptor<Alert> captor =
                ArgumentCaptor.forClass(Alert.class);

        verify(alertRepository).save(captor.capture());

        Alert generatedAlert = captor.getValue();

        assertEquals(
                TipoAlerta.STOCK_BAJO,
                generatedAlert.getTipo()
        );

        assertEquals(
                "Stock bajo: Vacuna Influenza",
                generatedAlert.getTitulo()
        );

        assertFalse(generatedAlert.getLeida());

        assertEquals(
                "INVENTORY_ITEM",
                generatedAlert.getReferenciaTipo()
        );

        assertEquals(
                1L,
                generatedAlert.getReferenciaId()
        );
    }

    @Test
    void noDebeCrearOtraAlertaSiYaExiste() {
        InventoryItem item = InventoryItem.builder()
                .id(2L)
                .nombre("Alimento")
                .cantidadActual(3.0)
                .stockMinimo(10.0)
                .unidad("kg")
                .build();

        Alert existingAlert = Alert.builder()
                .id(20L)
                .tipo(TipoAlerta.STOCK_BAJO)
                .titulo("Stock bajo: Alimento")
                .mensaje("Mensaje anterior")
                .leida(false)
                .referenciaTipo("INVENTORY_ITEM")
                .referenciaId(2L)
                .build();

        when(inventoryItemRepository.findAll())
                .thenReturn(List.of(item));

        when(alertRepository
                .findByReferenciaTipoAndReferenciaId(
                        "INVENTORY_ITEM",
                        2L
                ))
                .thenReturn(List.of(existingAlert));

        when(alertRepository.save(existingAlert))
                .thenReturn(existingAlert);

        when(alertRepository.findAll())
                .thenReturn(List.of(existingAlert));

        alertService.generateLowStockAlerts();

        verify(alertRepository)
                .save(existingAlert);

        verify(alertRepository, never())
                .deleteAll(anyList());
    }

    @Test
    void debeGenerarAlertaDeProximaVacunacion() {
        Horse horse = new Horse();
        horse.setId(1L);
        horse.setNombre("Kitsu");

        MedicalHistory history =
                MedicalHistory.builder()
                        .id(10L)
                        .horse(horse)
                        .tipo(TipoHistorialMedico.VACUNA)
                        .descripcion(
                                "Vacuna contra influenza"
                        )
                        .fecha(LocalDate.now())
                        .fechaProxima(
                                LocalDate.now().plusDays(5)
                        )
                        .responsable("Veterinario")
                        .build();

        when(medicalHistoryRepository.findAll())
                .thenReturn(List.of(history));

        when(alertRepository
                .findByReferenciaTipoAndReferenciaId(
                        "MEDICAL_HISTORY",
                        10L
                ))
                .thenReturn(List.of());

        when(alertRepository.save(any(Alert.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        when(alertRepository.findAll())
                .thenReturn(List.of());

        alertService.generateMedicalAlerts();

        ArgumentCaptor<Alert> captor =
                ArgumentCaptor.forClass(Alert.class);

        verify(alertRepository).save(captor.capture());

        Alert generatedAlert = captor.getValue();

        assertEquals(
                TipoAlerta.VACUNACION,
                generatedAlert.getTipo()
        );

        assertTrue(
                generatedAlert.getTitulo()
                        .contains("Kitsu")
        );

        assertEquals(
                "MEDICAL_HISTORY",
                generatedAlert.getReferenciaTipo()
        );

        assertEquals(
                10L,
                generatedAlert.getReferenciaId()
        );
    }
}