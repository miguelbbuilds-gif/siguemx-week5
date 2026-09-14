# Decisiones de SigueMX (Week 5)

## Por qué empezamos después de la detección

SigueMX no compite con el tamizaje. El hueco operativo está entre “ya hay un resultado” y “alguien concreta el siguiente paso”. Empezar después de una detección simulada deja clara la promesa: la detección no es el final.

## Por qué la confirmación de la paciente no cierra el caso

Un auto-reporte puede ser honesto, incompleto o malentendido. Cerrar el caso con ese clic haría invisible el trabajo de entrega. Por eso la asistencia reportada entra a **VERIFICACIÓN PENDIENTE**. Solo una verificación simulada de la coordinadora (Ana Martínez) puede pasar a **PASO VERIFICADO**.

## Por qué los datos son simulados

Esta es una demostración de curso, no un producto clínico. Laura es una persona ficticia. No hay expediente real, no hay consentimiento clínico y no hay backend de pacientes. Todo resultado de salud está etiquetado como **SIMULADO** y **no es un diagnóstico**.

## Por qué localStorage alcanza para este prototipo

El objetivo es un slice navegable que sobreviva un refresh durante la demo. No hay autenticación, no hay datos personales reales y no hay razón para introducir Supabase. localStorage guarda el caso de ejemplo en el navegador y se puede borrar con el control de demo.

## Mechanical test bug and fix

Mechanical test bug: refresh caused progress/state loss.

The app treated “storage has not been read yet” as “there is no simulated case,” redirected to landing, and initialized the follow-up form before restored answers were available.

Fix: persisted simulated case state to localStorage and restored it on load.

The stored payload is an allowlisted fictional case (status, workflow step, check-in answers, deadline/escalation, verification-pending, and verified-handoff). Restoration waits for a client read so Next.js hydration does not clobber or discard the demo.

## Persona test: Doña Mari

Persona tested: Doña Mari, 54.

Confusion: "Escalamiento activado" sounded like medical worsening.

Fix: replaced technical escalation language with clear explanation of what happens next and who owns the follow-up.

The internal case state is still `escalated`. Patient-facing copy now says she needs help with the next step, that the appointment is not yet confirmed, that Ana owns follow-up, and that the simulated screening result has not changed.

## Primera movida de mañana

Correr el flujo completo en voz alta con el guion de 90 segundos: aterrizaje → detección → ruta → check-in incompleto → asistencia → verificación pendiente → verificación de Ana. Cronometrar fricción. Si Laura (la persona de la demo) se pierde en más de un “siguiente paso”, recortar navegación secundaria y dejar la ruta de cuidado como única pantalla madre.
