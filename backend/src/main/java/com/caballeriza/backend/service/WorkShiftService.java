package com.caballeriza.backend.service;

import com.caballeriza.backend.model.Employee;
import com.caballeriza.backend.model.WorkShift;
import com.caballeriza.backend.repository.EmployeeRepository;
import com.caballeriza.backend.repository.WorkShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkShiftService {

    private final WorkShiftRepository workShiftRepository;
    private final EmployeeRepository employeeRepository;

    public List<WorkShift> findAll() {
        return workShiftRepository.findAll();
    }

    public List<WorkShift> findByEmployeeId(Long employeeId) {
        return workShiftRepository.findByEmployeeIdOrderByFechaDesc(employeeId);
    }

    public WorkShift findById(Long id) {
        return workShiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));
    }

    public WorkShift save(WorkShift workShift) {
        validateTimes(workShift);

        Employee employee = resolveEmployee(workShift);
        workShift.setEmployee(employee);

        return workShiftRepository.save(workShift);
    }

    public WorkShift update(Long id, WorkShift details) {
        validateTimes(details);

        WorkShift workShift = findById(id);
        workShift.setEmployee(resolveEmployee(details));
        workShift.setFecha(details.getFecha());
        workShift.setHoraInicio(details.getHoraInicio());
        workShift.setHoraFin(details.getHoraFin());
        workShift.setObservaciones(details.getObservaciones());

        return workShiftRepository.save(workShift);
    }

    public void delete(Long id) {
        workShiftRepository.delete(findById(id));
    }

    private Employee resolveEmployee(WorkShift workShift) {
        if (workShift.getEmployee() == null ||
                workShift.getEmployee().getId() == null) {
            throw new RuntimeException("Debe seleccionar un empleado");
        }

        return employeeRepository.findById(workShift.getEmployee().getId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
    }

    private void validateTimes(WorkShift workShift) {
        if (workShift.getHoraInicio() != null &&
                workShift.getHoraFin() != null &&
                !workShift.getHoraFin().isAfter(workShift.getHoraInicio())) {
            throw new RuntimeException(
                    "La hora final debe ser posterior a la hora de inicio"
            );
        }
    }
}