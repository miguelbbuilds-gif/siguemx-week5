import assert from "node:assert/strict";
import test from "node:test";
import {
  applyCheckIn,
  createSimulatedCase,
  escalateMissedDeadline,
  isHandoffClosed,
  patientActionCanCloseCase,
  validateCheckIn,
  verifyByCoordinator,
} from "./case-machine.ts";

test("Laura persona is fictional and labeled simulated", () => {
  const demoCase = createSimulatedCase();
  assert.equal(demoCase.persona.displayName, "Laura");
  assert.equal(demoCase.persona.fictional, true);
  assert.equal(demoCase.simulated, true);
  assert.equal(demoCase.notADiagnosis, true);
});

test("incomplete check-in is blocked", () => {
  const result = validateCheckIn({ contactedClinic: "si" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(result.missing.includes("hasAppointment"));
    assert.ok(result.missing.includes("attended"));
  }
});

test("patient-reported attendance becomes verification pending, never verified", () => {
  const started = createSimulatedCase();
  const afterReport = applyCheckIn(started, {
    contactedClinic: "si",
    hasAppointment: "si",
    attended: "si",
  });

  assert.equal(afterReport.patientReportedAttendance, true);
  assert.equal(afterReport.coordinatorVerified, false);
  assert.equal(afterReport.status, "verification_pending");
  assert.equal(isHandoffClosed(afterReport), false);
  assert.equal(patientActionCanCloseCase(), false);
});

test("only coordinator verification closes the handoff", () => {
  const pending = applyCheckIn(createSimulatedCase(), {
    contactedClinic: "si",
    hasAppointment: "si",
    attended: "si",
  });
  const verified = verifyByCoordinator(pending);
  assert.equal(verified.status, "verified");
  assert.equal(verified.coordinatorVerified, true);
  assert.equal(isHandoffClosed(verified), true);
});

test("missed deadline escalates only if the next step is unresolved", () => {
  const open = escalateMissedDeadline(createSimulatedCase());
  assert.equal(open.status, "escalated");

  const pending = applyCheckIn(createSimulatedCase(), {
    contactedClinic: "si",
    hasAppointment: "si",
    attended: "si",
  });
  const stillPending = escalateMissedDeadline(pending);
  assert.equal(stillPending.status, "verification_pending");
});
