package com.caballeriza.backend.service;

import com.caballeriza.backend.model.Employee;
import com.caballeriza.backend.model.EmployeeTask;
import com.caballeriza.backend.model.EstadoTarea;
import com.caballeriza.backend.repository.EmployeeRepository;
import com.caballeriza.backend.repository.EmployeeTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeTaskService {

    private final EmployeeTaskRepository employeeTaskRepository;
    private final EmployeeRepository employeeRepository;

    public List<EmployeeTask> findAll() {
        return employeeTaskRepository.findAll();
    }

    public List<EmployeeTask> findByEmployeeId(Long employeeId) {
        return employeeTaskRepository
                .findByEmployeeIdOrderByFechaAsignacionDesc(employeeId);
    }

    public EmployeeTask findById(Long id) {
        return employeeTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Tarea no encontrada"));
    }

    public EmployeeTask save(EmployeeTask employeeTask) {
        employeeTask.setEmployee(resolveEmployee(employeeTask));

        if (employeeTask.getEstado() == null) {
            employeeTask.setEstado(EstadoTarea.PENDIENTE);
        }

        return employeeTaskRepository.save(employeeTask);
    }

    public EmployeeTask update(Long id, EmployeeTask details) {
        EmployeeTask task = findById(id);

        task.setEmployee(resolveEmployee(details));
        task.setTitulo(details.getTitulo());
        task.setDescripcion(details.getDescripcion());
        task.setFechaAsignacion(details.getFechaAsignacion());
        task.setFechaLimite(details.getFechaLimite());
        task.setEstado(details.getEstado() == null
                ? EstadoTarea.PENDIENTE
                : details.getEstado());

        return employeeTaskRepository.save(task);
    }

    public EmployeeTask complete(Long id) {
        EmployeeTask task = findById(id);
        task.setEstado(EstadoTarea.COMPLETADA);
        return employeeTaskRepository.save(task);
    }

    public void delete(Long id) {
        employeeTaskRepository.delete(findById(id));
    }

    private Employee resolveEmployee(EmployeeTask task) {
        if (task.getEmployee() == null ||
                task.getEmployee().getId() == null) {
            throw new RuntimeException("Debe seleccionar un empleado");
        }

        return employeeRepository.findById(task.getEmployee().getId())
                .orElseThrow(() -> new RuntimeException(
                        "Empleado no encontrado"));
    }
}