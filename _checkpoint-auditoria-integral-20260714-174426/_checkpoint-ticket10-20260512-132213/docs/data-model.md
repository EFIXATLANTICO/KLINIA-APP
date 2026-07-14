# Modelo de datos inicial

Este documento define las entidades principales del sistema. Es una base de
partida y se refinara al implementar.

## Clinic

Representa una clinica o centro.

- id
- name
- tax_name
- tax_id
- address
- phone
- email
- timezone
- created_at
- updated_at

## User

Usuario que accede al sistema.

- id
- clinic_id
- name
- email
- password_hash
- role
- status
- created_at
- updated_at

Roles iniciales:

- admin
- reception
- practitioner
- manager

## Practitioner

Profesional que presta servicios.

- id
- clinic_id
- user_id
- display_name
- license_number
- specialties
- color
- commission_rate
- monthly_target_cents
- active
- created_at
- updated_at

## Patient

Paciente de la clinica.

- id
- clinic_id
- first_name
- last_name
- phone
- email
- birth_date
- national_id
- address
- tax_name
- tax_id
- notes
- status
- created_at
- updated_at

## Room

Sala o espacio fisico.

- id
- clinic_id
- name
- description
- capacity
- active
- created_at
- updated_at

## Service

Servicio o tratamiento reservable.

- id
- clinic_id
- name
- description
- duration_minutes
- price_cents
- tax_rate
- active
- created_at
- updated_at

## Appointment

Cita en agenda.

- id
- clinic_id
- patient_id
- practitioner_id
- room_id
- service_id
- starts_at
- ends_at
- status
- source
- cancellation_reason
- internal_notes
- created_by_user_id
- created_at
- updated_at

Estados:

- pending
- confirmed
- completed
- cancelled
- no_show

Reglas clave:

- Una sala no puede tener dos citas solapadas.
- Un profesional no puede tener dos citas solapadas.
- Un paciente no deberia tener dos citas solapadas.
- La cita debe respetar la disponibilidad del profesional salvo permiso especial.

## AvailabilityRule

Disponibilidad recurrente de un profesional o sala.

- id
- clinic_id
- practitioner_id
- room_id
- weekday
- starts_at_time
- ends_at_time
- valid_from
- valid_to
- created_at
- updated_at

## ScheduleBlock

Bloqueo puntual de agenda.

- id
- clinic_id
- practitioner_id
- room_id
- starts_at
- ends_at
- reason
- created_by_user_id
- created_at
- updated_at

## ClinicalRecord

Historial clinico del paciente.

- id
- clinic_id
- patient_id
- summary
- allergies
- relevant_conditions
- created_at
- updated_at

## ClinicalNote

Nota asociada a una cita o evolucion del paciente.

- id
- clinic_id
- patient_id
- appointment_id
- practitioner_id
- note_type
- content
- created_by_user_id
- created_at
- updated_at

## Invoice

Factura emitida.

- id
- clinic_id
- patient_id
- invoice_number
- issued_at
- due_at
- status
- subtotal_cents
- tax_cents
- total_cents
- created_at
- updated_at

## InvoiceLine

Linea de factura.

- id
- invoice_id
- service_id
- description
- quantity
- unit_price_cents
- tax_rate
- total_cents

## Payment

Pago recibido.

- id
- clinic_id
- patient_id
- invoice_id
- amount_cents
- method
- status
- paid_at
- created_at
- updated_at

## PractitionerReport

Vista calculada para mostrar la facturacion y rendimiento de cada trabajador.
En una implementacion real podria ser una consulta agregada, no necesariamente
una tabla persistida.

- practitioner_id
- period_start
- period_end
- completed_appointments
- confirmed_appointments
- revenue_cents
- average_ticket_cents
- estimated_commission_cents
- occupancy_rate
- target_progress

Reglas clave:

- Un trabajador solo debe poder ver su propio informe salvo permisos especiales.
- Direccion puede ver informes agregados y comparativas del equipo.
- La facturacion debe calcularse desde citas, servicios, facturas y pagos reales
  cuando el modulo economico este implementado.

## AutomationRule

Regla configurable de automatizacion.

- id
- clinic_id
- name
- trigger_type
- channel
- enabled
- config
- created_at
- updated_at

## Notification

Mensaje generado por una automatizacion.

- id
- clinic_id
- patient_id
- appointment_id
- automation_rule_id
- channel
- status
- scheduled_for
- sent_at
- payload
- error_message
- created_at
- updated_at
